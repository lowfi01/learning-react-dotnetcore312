using System.Collections.Generic;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
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
      private readonly UserManager<AppUser> _userManager;
      private readonly SignInManager<AppUser> _signInManager;

      public Handler(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, ILogger<Login> logger)
      {
        this._userManager = userManager;
        this._signInManager = signInManager;
        this._logger = logger;
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
          // TODO: generate token

          // return User data
          return new User
          {
            DisplayName = user.DisplayName,
            Token = "This will be a token",
            Username = user.UserName,
            Image = null,
          };
        }


        throw new RestException(HttpStatusCode.Unauthorized);
      }
    }
  }
}