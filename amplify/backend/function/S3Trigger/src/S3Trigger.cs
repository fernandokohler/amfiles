using Amazon;
using Amazon.CognitoIdentityProvider;
using Amazon.CognitoIdentityProvider.Model;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.Model;
using Amazon.Lambda.Core;
using Amazon.SimpleEmail;
using Amazon.SimpleEmail.Model;
using S3Trigger.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

// Assembly attribute to enable the Lambda function's JSON input to be converted into a .NET class.
[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.Json.JsonSerializer))]

// If you rename this namespace, you will need to update the invocation shim
// to match if you intend to test the function with 'amplify mock function'
namespace S3Trigger
{
    // If you rename this class, you will need to update the invocation shim
    // to match if you intend to test the function with 'amplify mock function'
    public class S3Trigger
    {
        private static AmazonDynamoDBClient _amazonDynamoDBClient = new AmazonDynamoDBClient();
        private static AmazonCognitoIdentityProviderClient _amazonCognitoIdentityProviderClient = new AmazonCognitoIdentityProviderClient();

        // If you rename this function, you will need to update the invocation shim
        // to match if you intend to test the function with 'amplify mock function'
#pragma warning disable CS1998
        public async Task<bool> LambdaHandler(EventInput input, ILambdaContext context)
        {
            context.Logger.LogLine($"EventInput : {Newtonsoft.Json.JsonConvert.SerializeObject(input)}");

            try
            {
                foreach (var item in input.Records)
                {
                    switch (item.eventName)
                    {
                        case "ObjectCreated:Put":
                            await PutObject(item, context);
                            break;

                        case "ObjectRemoved:Delete":
                            await DeleteObject(item, context);
                            break;

                        default:
                            break;
                    }
                }
            }
            catch (Exception err)
            {
                context.Logger.LogLine($"Erro Fatal Message -> {Newtonsoft.Json.JsonConvert.SerializeObject(err.Message)}");
                context.Logger.LogLine($"Erro Fatal StackTrace -> {Newtonsoft.Json.JsonConvert.SerializeObject(err.StackTrace)}");
            }

            return true;

        }
        public async Task DeleteObject(RecordS3 objeto, ILambdaContext context)
        {
            try
            {
                var username = GetUsernameCognitoByIdentityId(GetUserIdentityIdFromObjectKey(objeto.s3.@object.key));

                var user = new User
                {
                    Cognito = await GetUserCognitoByUsername(username),
                    Filename = GetFileNameFromObjectKey(objeto.s3.@object.key)
                };

                await SaveLog(user, $"Removeu o arquivo {user.Filename}");
            }
            catch (Exception err)
            {
                context.Logger.LogLine($"Erro ao apagar arquivo Message-> {Newtonsoft.Json.JsonConvert.SerializeObject(err.Message)}");
                context.Logger.LogLine($"Erro ao apagar arquivo StackTrace-> {Newtonsoft.Json.JsonConvert.SerializeObject(err.StackTrace)}");
            }
        }
        public async Task PutObject(RecordS3 objeto, ILambdaContext context)
        {
            try
            {
                var username = GetUsernameCognitoByIdentityId(GetUserIdentityIdFromObjectKey(objeto.s3.@object.key));

                var user = new User
                {
                    Cognito = await GetUserCognitoByUsername(username),
                    Filename = GetFileNameFromObjectKey(objeto.s3.@object.key)
                };

                await SendEmail(user);

                await SaveLog(user, $"Upload do arquivo {user.Filename}");
            }
            catch (Exception err)
            {
                context.Logger.LogLine($"Erro ao salvar arquivo Message -> {Newtonsoft.Json.JsonConvert.SerializeObject(err.Message)}");
                context.Logger.LogLine($"Erro ao salvar arquivo StackTrace -> {Newtonsoft.Json.JsonConvert.SerializeObject(err.StackTrace)}");
            }
        }
        private string GetUsernameCognitoByIdentityId(string identityId)
        {
            QueryRequest queryRequest = new QueryRequest
            {
                TableName = Environment.GetEnvironmentVariable("API_AMFILES_USERTABLE_NAME"),
                IndexName = "user-identityId-index",
                KeyConditionExpression = "identityId = :v_identityId",
                ExpressionAttributeValues = new Dictionary<string, AttributeValue> {
                    {":v_identityId", new AttributeValue { S =  identityId }}
                },
                ScanIndexForward = true
            };

            var dynamoUser = _amazonDynamoDBClient.QueryAsync(queryRequest).Result.Items;

            return dynamoUser.FirstOrDefault()?["owner"]?.S;
        }
        private async Task SaveLog(User user, string message)
        {
            var item = new PutItemRequest
            {
                TableName = Environment.GetEnvironmentVariable("API_AMFILES_LOGTABLE_NAME"),
                Item = new Dictionary<string, AttributeValue> {
                    {"owner", new AttributeValue { S =  user.Cognito.Username }},
                    {"id", new AttributeValue { S =  Guid.NewGuid().ToString() }},
                    {"data", new AttributeValue { S =  GetDateTimeLocal().ToString("yyyy-MM-ddTHH\\:mm\\:ss.fffffffzzz")}},
                    {"mensagem", new AttributeValue { S =  message}},
                }
            };

            await _amazonDynamoDBClient.PutItemAsync(item);
        }
        private async Task<UserCognito> GetUserCognitoByUsername(string username)
        {
            var adminGetUserRequest = new AdminGetUserRequest() { UserPoolId = Environment.GetEnvironmentVariable("AUTH_AMFILESA7B0F2F2_USERPOOLID"), Username = username };
            var adminGetUserResult = await _amazonCognitoIdentityProviderClient.AdminGetUserAsync(adminGetUserRequest);

            return new UserCognito
            {
                Email = adminGetUserResult.UserAttributes.FirstOrDefault(x => x.Name == "email").Value,
                Name = adminGetUserResult.UserAttributes.FirstOrDefault(x => x.Name == "name").Value,
                Username = adminGetUserResult.Username
            };
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
                                Data = GenerateHtmlBody(user.Filename)
                            },
                            Text = new Content
                            {
                                Charset = "UTF-8",
                                Data = GenerateTextBody()
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
                    Console.WriteLine("Error message: " + ex.Message);
                }
            }

            return success;
        }
        private string GenerateHtmlBody(string filename)
        {
            return $@"<html>
                    <head></head>
                    <body>
                        <p>Upload de arquivo {filename} efetuado com sucesso.</p>
                    </body>
                    </html>";
        }
        private string GenerateTextBody() => "Upload efetuado com sucesso!";
        private string GetUserIdentityIdFromObjectKey(string key) => Uri.UnescapeDataString(key).Split("/")[1];
        private string GetFileNameFromObjectKey(string key) => Uri.UnescapeDataString(key).Split("/").Last();
        private DateTime GetDateTimeLocal() => TimeZoneInfo.ConvertTime(DateTime.Now, TimeZoneInfo.FindSystemTimeZoneById("America/Sao_Paulo"));
    }
}
