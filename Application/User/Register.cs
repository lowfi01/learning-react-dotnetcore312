using System;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using Application.Validators;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application.User
{
  public class Register
  {
    // Note: we generally don't return anything from commands..
    //       - but in this case, when we register a use we will have them automatically login
    //         straight after..
    //         - Note: we could seperate the logic, register & then force user to login after
    //                 but that isn't what the tutorial did lol!! though i like that approach.
    //       - Command returns user object
    public class Command : IRequest<User>
    {
      public string DisplayName { get; set; }
      public string Username { get; set; }
      public string Email { get; set; }
      public string Password { get; set; }
    }


    // Validation
    public class CommandValidator : AbstractValidator<Command>
    {
      public CommandValidator()
      {
        RuleFor(x => x.DisplayName).NotEmpty();
        RuleFor(x => x.Username).NotEmpty();
        RuleFor(x => x.Email).NotEmpty().EmailAddress(); // EmailAddress, is a premade validator given by Fluent
        RuleFor(x => x.Password).Password(); // Note: Password is a custom ruleset, ValidatorExtensions.cs

        // note we can do this, instead of using an extension.
        //  RuleFor(x => x.Password)
        // .NotEmpty()
        // .MaximumLength(6).WithMessage("Password must be at least 6 characters")
        // .Matches("[A-Z]").WithMessage("Password must contain 1 uppercase letter");
      }
    }

    public class Handler : IRequestHandler<Command, User>
    {
      private readonly DataContext _context;
      private readonly ILogger<Command> _logger;
      private readonly UserManager<AppUser> _userManager;
      private readonly IJwtGenerator _jwtGenerator;

      public Handler(DataContext context, ILogger<Command> logger, UserManager<AppUser> userManager, IJwtGenerator jwtGenerator)
      {
        this._jwtGenerator = jwtGenerator;
        this._userManager = userManager;
        this._logger = logger;
        this._context = context;
      }

      public async Task<User> Handle(Command request, CancellationToken cancellationToken)
      {
        // User should not be able to
        // - create a user with existing email, username

        if (await _context.Users.AnyAsync(x => x.Email == request.Email))
        {
          throw new RestException(HttpStatusCode.BadRequest, new { Email = "Email Already exists" });
        }

        if (await _context.Users.AnyAsync(x => x.UserName == request.Username))
        {
          throw new RestException(HttpStatusCode.BadRequest, new { Username = "Username already exits" });
        }

        var user = new AppUser
        {
          DisplayName = request.DisplayName,
          UserName = request.Username,
          Email = request.Email
        };

        // Note: Because we are using our User manager we will not need to use _context to save to database
        //       - UserManager.CreateAsync() has an overloaded method that create a hashed password for us.
        var result = await _userManager.CreateAsync(user, request.Password);

        // if succesfully saving & a user to database return a new user.
        if (result.Succeeded)
        {
          return new User
          {
            DisplayName = user.DisplayName,
            Token = _jwtGenerator.CreateToken(user),
            Username = user.UserName,
            Image = null
          };
        }

        // throw error if result is unsuccessful
        throw new Exception("Problem creating user");
      }

    }
  }
}