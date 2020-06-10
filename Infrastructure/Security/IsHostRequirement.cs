using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Filters;
using Persistence;

namespace Infrastructure.Security
{

  // Custom Authentication policy, (security policy)
  // - check if the user is the host of the activity before allowing them to
  //   edit, delete or remove participants.
  public class IsHostRequirement : IAuthorizationRequirement
  {
    // This is the requirement we pass as an attribute
  }


  public class IsHostRequirementHandler : AuthorizationHandler<IsHostRequirement>
  {
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly DataContext _context;

    // Constructor is mainly used to give access to our services which are dependecy injected through the startup services
    public IsHostRequirementHandler(
          IHttpContextAccessor httpContextAccessor, // inject http context accessor to give access to the header properties including the token
          DataContext context) // inject database context to give us access to the database
    {
      this._httpContextAccessor = httpContextAccessor;
      this._context = context;
    }


    protected override Task HandleRequirementAsync(
          AuthorizationHandlerContext context,
          IsHostRequirement requirement
        )
    {
      // This will defines how our requirement attribute checks authorization
      // - Is the user the host of a particular activity??
      //   - we first capture the need values  for our check
      //     - UserName form the token passed with request (remember we set this up in jwtgenerator.cs)
      //     - activityId from the request url  paramater all passed with request

      //   - Note: context.Resource, Prior to dotnet 3.0 this method was an authrization filter context and it would
      //           give access to root data.. ie, the edit handler, delete handler etc..

      // - We will gain access to our root data, using our context!
      //   - we use the httpcontext to gain access to our claims (payload), with the token passed in the header.
      //     - Note: User object & Claims could be null..
      //   - This should give our current username... by digging through our token.
      //     - x.Type, linq will check for claims with the claim type that matchs our name identifier (id! which is our DisplayName)
      var currentUserName = _httpContextAccessor.HttpContext.User?.Claims?.SingleOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;

      // - We will gain access to our ActivityId from the Url paramater passed with the request
      //   - Note: requests we are checking is for IsHost, which means they want to edit, delete or add to existing activity
      //           all of these API points require, ActivityId to be passed.
      //   - Our ActivityId is a Guid & the Id passed into our paramter is a string.. lets convert it first
      var activityId = Guid.Parse(
          _httpContextAccessor.HttpContext
                              .Request // Access the request data
                              .RouteValues // Route values are returned as a dictionary type so we can map using SingleOrDefault linq
                              .SingleOrDefault(x => x.Key == "id").Value // match only for the param we define in the [HttpPost("id")]
                              .ToString() // convert type to string as that is what Guid.Parse expects
                              );

      var activity = _context.Activities.FindAsync(activityId).Result; // abstract result from FindAync

      // look for this activity in UserActivity table
      UserActivity host = activity.UserActivities.FirstOrDefault(x => x.IsHost == true); // Note: we can just check for IsHost, bt


      //  Remember we can interigate our host as it contains an AppUser which contains our userName
      //  - check if Username is == to current Username
      if (host?.AppUser?.UserName == currentUserName)
      {
        context.Succeed(requirement); //  return access authorized success :D
      }

      return Task.CompletedTask; // Note: if it fails you will get a 403 forbidden

    }


    // Student alternative code
    // protected override async Task HandleRequirementAsync(
    //         AuthorizationHandlerContext context,
    //         IsHostRequirement requirement)
    //     {
    //         if (context.Resource is AuthorizationFilterContext authContext)
    //         {
    //             var currentUserName = _httpContextAccessor.HttpContext.User?.Claims?
    //                 .SingleOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;

    //             var activityId = Guid.Parse(authContext.RouteData.Values["id"].ToString());
    //             Activity activity = await _dataContext.Activities.FindAsync(activityId);

    //             UserActivity host = activity.UserActivities.FirstOrDefault(x => x.IsHost);

    //             if (host?.AppUser?.UserName == currentUserName)
    //             {
    //                 context.Succeed(requirement);
    //             }
    //             else
    //             {
    //                 context.Fail();
    //             }
    //         }
    //     }
  }
}