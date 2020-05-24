using System.Threading.Tasks;
using Application.User;
using Domain;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
  public class UserController : BaseController
  {
    [HttpPost("login")]
    public async Task<ActionResult<AppUser>> Login(Login.Query query) // [Frombody] model binding request data!!
    {
      // Note: password = Password12345+
      return await Mediator.Send(query); // the query handler should return user in this version
    }
  }
}