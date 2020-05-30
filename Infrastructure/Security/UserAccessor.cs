using System.Linq;
using System.Security.Claims;
using Application.Interfaces;
using Microsoft.AspNetCore.Http;

namespace Infrastructure.Security
{
  // Note: to use this User access, we must register it as a service so that it is
  //       injectable into other classes, via the constructor.
  public class UserAccessor : IUserAccessor
  {
    private readonly IHttpContextAccessor _httpContextAccessor;
    public UserAccessor(IHttpContextAccessor httpContextAccessor) // inject IHttpContextAccessor
    {
      this._httpContextAccessor = httpContextAccessor;
    }
    public string GetCurrentUsername()
    {
      // Goal - Get username from token
      // - Within the HttpContext, we have access to a User object, if this User Object exists then
      //   we can access the claims for that user object, from the list of claims, we want to get
      //   the first or default, that matches the type of the name identifier!! (which should be the user)
      //   then capture that specific value from the resulting match.
      var username = _httpContextAccessor.HttpContext
                      .User?  // get the user from this current http request, could be null
                      .Claims? // get claims from the current http request, could be null
                      .FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value; // linq

      return username;
    }
  }
}