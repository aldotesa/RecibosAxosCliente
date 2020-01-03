using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.Owin;
using Owin;
using RecibosAxosCliente.Models;

[assembly: OwinStartupAttribute(typeof(RecibosAxosCliente.Startup))]
namespace RecibosAxosCliente
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            CreacionRoles();
            ConfigureAuth(app);
        }
        public void CreacionRoles()
        {
            using (var context = new ApplicationDbContext())
            {
                var roleManager = new RoleManager<IdentityRole>(new RoleStore<IdentityRole>(context));
                var userManager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(context));

                if (!roleManager.RoleExists("Administracion"))
                {
                    var role = new IdentityRole
                    {
                        Name = "Administracion"
                    };
                    roleManager.Create(role);
                }
                if (!roleManager.RoleExists("Root"))
                {
                    var role = new IdentityRole
                    {
                        Name = "Root"
                    };
                    roleManager.Create(role);

                    var user = new ApplicationUser
                    {
                        Email = "sa",
                        UserName = "sa",
                        //FechaRegistro = DateTime.Now
                    };
                    string password = "Aa123456";
                    var registrado = userManager.Create(user, password);
                    if (registrado.Succeeded)
                    {
                        userManager.AddToRole(user.Id, "Root");
                    }
                }
            }
        }
    }
}
