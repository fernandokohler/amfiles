using Amazon;
using Amazon.CognitoIdentityProvider.Model;
using Amazon.CognitoIdentityProvider;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.Model;
using Amazon.Lambda.Core;
using Amazon.SimpleEmail;
using Amazon.SimpleEmail.Model;
using SendActionHistoryEmail.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

// Assembly attribute to enable the Lambda function's JSON input to be converted into a .NET class.
[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.Json.JsonSerializer))]

// If you rename this namespace, you will need to update the invocation shim
// to match if you intend to test the function with 'amplify mock function'
namespace SendActionHistoryEmail
{
    // If you rename this class, you will need to update the invocation shim
    // to match if you intend to test the function with 'amplify mock function'
    public class SendActionHistoryEmail
    {
        private static AmazonDynamoDBClient _amazonDynamoDBClient = new AmazonDynamoDBClient();
        private static AmazonCognitoIdentityProviderClient _amazonCognitoIdentityProviderClient = new AmazonCognitoIdentityProviderClient();

        public async Task<bool> LambdaHandler(EventInput input, ILambdaContext context)
        {
            context.Logger.LogLine($"Received data: {Newtonsoft.Json.JsonConvert.SerializeObject(input)}");

            var success = false;

            try
            {
                var userData = new User()
                {
                    Logs = GetLogsByOwner(input.identity.sub),
                    Cognito = await GetUserCognito(input.identity.username)
                };

                await SendEmail(userData);

                success = true;
            }
            catch (Exception ex)
            {
                context.Logger.Log($"Fatal Error -> {ex.StackTrace}");
            }

            return success;
        }

        private List<LogDto> ConvertToLogDto(List<Dictionary<string, AttributeValue>> items)
        {
            return items.Select(item => new LogDto { Data = Convert.ToDateTime(item["data"].S), Mensagem = item["mensagem"].S }).ToList();
        }

        private List<LogDto> GetLogsByOwner(string ownerId)
        {
            QueryRequest queryRequest = new QueryRequest
            {
                TableName = Environment.GetEnvironmentVariable("API_AMFILES_LOGTABLE_NAME"),
                IndexName = "owner-index",
                KeyConditionExpression = "#owner = :v_owner",
                ExpressionAttributeNames = new Dictionary<string, string> {
                    {"#owner", "owner"}
                },
                ExpressionAttributeValues = new Dictionary<string, AttributeValue> {
                    {":v_owner", new AttributeValue { S =  ownerId }}
                },
                ScanIndexForward = true
            };

            var dynamoLogs = _amazonDynamoDBClient.QueryAsync(queryRequest).Result.Items;

            return ConvertToLogDto(dynamoLogs);
        }

        private async Task<bool> SendEmail(User user)
        {
            var success = false;

            using (var client = new AmazonSimpleEmailServiceClient(RegionEndpoint.USEast1))
            {
                var sendRequest = new SendEmailRequest
                {
                    Source = Environment.GetEnvironmentVariable("EMAIL_SENDER_ADDRESS"),
                    Destination = new Destination
                    {
                        ToAddresses =
                        new List<string> { user.Cognito.Email }
                    },
                    Message = new Message
                    {
                        Subject = new Content(Environment.GetEnvironmentVariable("EMAIL_SUBJECT")),
                        Body = new Body
                        {
                            Html = new Content
                            {
                                Charset = "UTF-8",
                                Data = GenerateHtmlBody(user)
                            },
                            Text = new Content
                            {
                                Charset = "UTF-8",
                                Data = GenerateTextBody(user.Logs)
                            }
                        }
                    }
                };
                try
                {
                    var response = await client.SendEmailAsync(sendRequest);
                    success = true;
                }
                catch (Exception ex)
                {
                    Console.WriteLine("The email was not sent.");
                    Console.WriteLine("Error message: " + ex.Message);
                }
            }

            return success;
        }

        private string GenerateHtmlBody(User user)
        {
            var logsString = user.Logs.OrderBy(x => x.Data).Select(x => $"<li>{x.Data.ToString("dd/MM/yyyy HH:mm:ss")} - {x.Mensagem}</li>");

            return $@"<html>
                    <head></head>
                    <body>
                        <h3>Histórico de ações realizada por {user.Cognito.Name}:</h3>
                        <ul>
                        {string.Join("",logsString)}
                        </li>
                    </body>
                    </html>";
        }

        private string GenerateTextBody(List<LogDto> logs) => "Histórico de ações\r\n"
                                        + $"Você realizou um total de {logs.Count()} ações";

        private async Task<UserCognito> GetUserCognito(string username)
        {
            var adminGetUserRequest = new AdminGetUserRequest() { UserPoolId = Environment.GetEnvironmentVariable("AUTH_AMFILESA7B0F2F2_USERPOOLID"),Username = username };
            var adminGetUserResult = await _amazonCognitoIdentityProviderClient.AdminGetUserAsync(adminGetUserRequest);

            return new UserCognito
            {
                Email = adminGetUserResult.UserAttributes.FirstOrDefault(x => x.Name == "email").Value,
                Name = adminGetUserResult.UserAttributes.FirstOrDefault(x => x.Name == "name").Value
            };
        }
    }
}
