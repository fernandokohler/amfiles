using System;
using System.Collections.Generic;
using System.Text;

namespace SendActionHistoryEmail.Contracts
{
    class User
    {
        public List<LogDto> Logs { get; set; }
        public UserCognito Cognito { get; set; }
    }
}
