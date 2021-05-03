using System;
using System.Collections.Generic;
using System.Text;

namespace SendActionHistoryEmail.Contracts
{
    public class LogDto
    {
        public DateTime Data { get; set; }
        public string Mensagem { get; set; }
    }
}
