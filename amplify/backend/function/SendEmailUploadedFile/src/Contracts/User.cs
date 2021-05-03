using System;
using System.Collections.Generic;
using System.Text;

namespace SendEmailUploadedFile.Contracts
{
    class User
    {
        public UserCognito Cognito { get; set; }
        public string Filename { get; set; }
    }
}
