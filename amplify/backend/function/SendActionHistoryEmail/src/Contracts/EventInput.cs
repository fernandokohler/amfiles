using Newtonsoft.Json;
using System.Collections.Generic;

namespace SendActionHistoryEmail.Contracts
{
    public class Claims
    {
        public string sub { get; set; }
        public bool email_verified { get; set; }
        public string iss { get; set; }
        public bool phone_number_verified { get; set; }

        [JsonProperty("cognito:username")]
        public string CognitoUsername { get; set; }
        public string aud { get; set; }
        public string event_id { get; set; }
        public string token_use { get; set; }
        public int auth_time { get; set; }
        public string name { get; set; }
        public string phone_number { get; set; }
        public int exp { get; set; }
        public int iat { get; set; }
        public string email { get; set; }
    }

    public class Identity
    {
        public Claims claims { get; set; }
        public string defaultAuthStrategy { get; set; }
        public string issuer { get; set; }
        public List<string> sourceIp { get; set; }
        public string sub { get; set; }
        public string username { get; set; }
    }

    public class EventInput
    {
        public string typeName { get; set; }
        public string fieldName { get; set; }
        public Identity identity { get; set; }
    }
}
