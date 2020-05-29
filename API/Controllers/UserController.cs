using System.Threading.Tasks;
using Application.User;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
  [AllowAnonymous] // this allows access without authentication (as Auth is setup globally in startup)
  public class UserController : BaseController
  {
    [HttpPost("login")]
    public async Task<ActionResult<User>> Login(Login.Query query) // [Frombody] model binding request data!!
    {
      // Note: password = Password12345+
      return await Mediator.Send(query); // the query handler should return user in this version
    }
  }
}