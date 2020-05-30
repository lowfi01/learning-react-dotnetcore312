using System.Threading;
using System.Threading.Tasks;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application.User
{

  // Handler logic to capture current user who is logged in!
  public class CurrentUser
  {
    public class Query : IRequest<User> { }

    public class Handler : IRequestHandler<Query, User>
    {
      private readonly UserManager<AppUser> _userManager;
      private readonly IJwtGenerator _jwtGenerator;
      private readonly IUserAccessor _userAccessor;

      public Handler(UserManager<AppUser> userManager, IJwtGenerator jwtGenerator, IUserAccessor userAccessor)
      {
        this._userAccessor = userAccessor;
        this._jwtGenerator = jwtGenerator;
        this._userManager = userManager;
      }

      public async Task<User> Handle(Query request, CancellationToken cancellationToken)
      {
        // Usermanager, gives us access to the Identiy tables... we are search for names.
        // UserAccessor, gives us the current logged in user, by searching the jwt token passed in the http request header  (bearer token)
        var user = await _userManager.FindByNameAsync(_userAccessor.GetCurrentUsername());

        return new User
        {
          DisplayName = user.DisplayName,
          Username = user.UserName,
          Image = null,
          Token = _jwtGenerator.CreateToken(user)  // Note: we generate a new token so as to keep user logged in & it's a nice way to refresh the token.. (which has a life span)
        };
      }

    }
  }
}