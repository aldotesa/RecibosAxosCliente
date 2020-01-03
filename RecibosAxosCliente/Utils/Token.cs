using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RecibosAxosCliente.Utils
{
    /// <summary>
    /// Clase que se utiliza para generar el token de autentificación con el api
    /// </summary>
    public class Token
    {
        public string access_token { get; set; }
        public string userName { get; set; }
        public DateTime expires { get; set; }
    }
}