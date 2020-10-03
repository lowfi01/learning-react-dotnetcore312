using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application.User
{
  // Login Handler
  public class Login
  {

    // query object which should redine the content of our request data being passed
    public class Query : IRequest<User> // Return user!
    {
      public string Email { get; set; }
      public string Password { get; set; }

    }

    // ADD VALIDATION
    public class QueryValidator : AbstractValidator<Query>
    {
      public QueryValidator()
      {
        RuleFor(x => x.Email).NotEmpty();
        RuleFor(x => x.Password).NotEmpty();
      }
    }

    public class Handler : IRequestHandler<Query, User> // handler will return user
    {
      private readonly ILogger<Login> _logger;
      private readonly IJwtGenerator _jwtGenerator;
      private readonly UserManager<AppUser> _userManager;
      private readonly SignInManager<AppUser> _signInManager;

      public Handler(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, ILogger<Login> logger, IJwtGenerator jwtGenerator)
      {
        this._userManager = userManager;
        this._signInManager = signInManager;
        this._logger = logger;
        this._jwtGenerator = jwtGenerator; // Note we get this through dependecy inject (service.AddScope<>) startup.cs
      }

      public async Task<User> Handle(Query request, CancellationToken cancellationToken)
      {
        // check if the user exists
        var user = await _userManager.FindByEmailAsync(request.Email);

        if (user == null)
        {
          throw new RestException(HttpStatusCode.Unauthorized); // can contain an error message
        }

        // check if users password is correct
        var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, false);

        if (result.Succeeded)
        {
          // Generate token.
          // - because we are using an interface, all our applicaiton project knows about is that,
          //   we have an interface, that has a method, which sends a user & returns a string!
          //   - it does not know about any of the logic we have within our JwtGenerator.
          //   - Note: we associate the class which uses the interface within startup.cs when we add it as a service(dependency injection)
          //           - service & it's implemention,  Interface which implements this class <IJwtGenerator, JwtGenerator>
          var jwtToken = _jwtGenerator.CreateToken(user);

          // return User data
          return new User
          {
            DisplayName = user.DisplayName,
            Token = jwtToken, // we can technicall just pass _jwtGenerator.CreateToken(user), but i wanted to add notes
            Username = user.UserName,
            Image = user.Photos.FirstOrDefault(x => x.IsMain)?.Url,
          };
        }

        throw new RestException(HttpStatusCode.Unauthorized);
      }
    }
  }
}