using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Amazon;
using Amazon.CognitoIdentityProvider;
using Amazon.CognitoIdentityProvider.Model;
using Amazon.Lambda.Core;
using Amazon.SimpleEmail;
using Amazon.SimpleEmail.Model;
using SendEmailUploadedFile.Contracts;

// Assembly attribute to enable the Lambda function's JSON input to be converted into a .NET class.
[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.Json.JsonSerializer))]

// If you rename this namespace, you will need to update the invocation shim
// to match if you intend to test the function with 'amplify mock function'
namespace SendEmailUploadedFile
{
    // If you rename this class, you will need to update the invocation shim
    // to match if you intend to test the function with 'amplify mock function'
    public class SendEmailUploadedFile
    {

        static readonly string SenderAddress = "play_bilu@hotmail.com";

        static readonly string Subject = "[AMFiles] Upload de arquivo";

        // If you rename this function, you will need to update the invocation shim
        // to match if you intend to test the function with 'amplify mock function'
#pragma warning disable CS1998
        public async Task<bool> LambdaHandler(EventInput input, ILambdaContext context)
        {
            context.Logger.LogLine($"Received data: {Newtonsoft.Json.JsonConvert.SerializeObject(input)}");

            var success = false;

            try
            {
                var userData = new User
                {
                    Cognito = await GetUserCognito(input.identity.sub),
                    Filename = input.arguments.filename
                };

                await SendEmail(userData);

                success = true;
            }
            catch(Exception ex)
            {
                context.Logger.Log($"Fatal Error -> {ex.StackTrace}");
            }

            return success;
        }

        private async Task<UserCognito> GetUserCognito(string username)
        {
            var client = new AmazonCognitoIdentityProviderClient();

            var adminGetUserRequest = new AdminGetUserRequest() { UserPoolId = Environment.GetEnvironmentVariable("AUTH_AMFILESA7B0F2F2_USERPOOLID"), Username = username };
            var adminGetUserResult = await client.AdminGetUserAsync(adminGetUserRequest);

            return new UserCognito
            {
                Email = adminGetUserResult.UserAttributes.FirstOrDefault(x => x.Name == "email").Value,
                Name = adminGetUserResult.UserAttributes.FirstOrDefault(x => x.Name == "name").Value
            };
        }

        private async Task<bool> SendEmail(User user)
        {
            var success = false;

            using (var client = new AmazonSimpleEmailServiceClient(RegionEndpoint.USEast1))
            {
                var sendRequest = new SendEmailRequest
                {
                    Source = SenderAddress,
                    Destination = new Destination
                    {
                        ToAddresses =
                        new List<string> { user.Cognito.Email }
                    },
                    Message = new Message
                    {
                        Subject = new Content(Subject),
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
                    Console.WriteLine("The email was not sent.");
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
    }
}
