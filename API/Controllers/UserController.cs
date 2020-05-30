using System.Threading.Tasks;
using Application.User;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{

  public class UserController : BaseController
  {
    // Note: -- all of these methods should return a new token, which should  be passed as a bearer token to gain access to all policy protected fields
    [AllowAnonymous] // (over-rides global policy protection we setup in startup.cs) this allows access without authentication (as Auth is setup globally in startup)
    [HttpPost("login")]
    public async Task<ActionResult<User>> Login(Login.Query query) // [Frombody] model binding request data!!
    {
      // Note: password = Password12345+
      return await Mediator.Send(query); // the query handler should return user in this version
    }

    [HttpPost("register")]
    [AllowAnonymous] // (over-rides global policy protection we setup in startup.cs) this allows access without authentication (as Auth is setup globally in startup)
    public async Task<ActionResult<User>> Register(Register.Command cmd)
    {
      // Note: password = Password12345+
      return await Mediator.Send(cmd);
    }

    [HttpGet] // Note: no need for routing as we only have one get method in this controller "/api/user"
    public async Task<ActionResult<User>> CurrentUser()
    {
      // Note: You must pass the bearer token for this to work!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

      return await Mediator.Send(new CurrentUser.Query());

      // Note: We create a new Currentuser.Query, as we do not need to pass any parameters!! unlike our login
      //       controller above which had the username & password..
      //       Note: - By passing it within as a parameter we had auto binding..
      // - Neils answer within the tutorial:
      //   With the Login query we have data in the body of the request.
      //   The API controller will bind the values sent from the body of the request and
      //   be used to log the user in. With the get current user we do not need to pass any
      //   parameters so we can just create a new CurrentUser.Query in this case.
    }
  }
}