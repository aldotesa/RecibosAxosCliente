using AxosApiClient;
using RecibosAxosCliente.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web;
using System.Web.Mvc;

namespace RecibosAxosCliente.Controllers
{
    public class ReciboController : Controller
    {
        // GET: Recibo
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Register()
        {
            return View();
        }

        public ActionResult Editar(int idRecibo)
        {

            using(HttpClientUtil httpClient = new HttpClientUtil(User))
            {
                ReciboClient cliente = new ReciboClient(httpClient);
                try
                {
                    var recibo = cliente.GetReciboAsync(idRecibo).GetAwaiter().GetResult().ObjectResponse;
                    return View(recibo);
                }
                catch (ApiException<AxosResponse> ex)
                {
                    return RedirectToAction("","Home");
                }
                
            }
            
        }
        [Authorize(Roles ="Root")]
        public ActionResult RecibosGlobales()
        {
            return View();
        }
    }
}