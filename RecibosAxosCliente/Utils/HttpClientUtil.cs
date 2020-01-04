using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Security.Principal;
using System.Web;

namespace RecibosAxosCliente.Utils
{
    public class HttpClientUtil: HttpClient
    {
        public HttpClientUtil(IPrincipal user)
        {
            this.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", ((ClaimsIdentity)user.Identity).Claims.FirstOrDefault(e => e.Type.Equals("Token"))?.Value);
            this.BaseAddress = new Uri(ConfigurationManager.AppSettings["UrlApi"].ToString());
        }
    }
}