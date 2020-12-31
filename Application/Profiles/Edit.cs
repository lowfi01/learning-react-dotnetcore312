using System;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application.Profiles
{
  public class Edit
  {
    public class Command : IRequest
    {
      public string UserName { get; set; }
      public string DisplayName { get; set; }
      public string Bio { get; set; }
    }

    public class CommandValidator : AbstractValidator<Command>
    {
      public CommandValidator()
      {
        RuleFor(x => x.DisplayName).NotEmpty();
      }
    }

    public class Handler : IRequestHandler<Command>
    {
      private readonly DataContext _context;
      private readonly ILogger _logger;

      public Handler(DataContext context, ILogger<Edit> logger)
      {
        this._logger = logger;
        this._context = context;
      }

      public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
      {

        // fetch profile
        var user = _context.Users.SingleOrDefault(x => x.UserName == request.UserName);

        if (user == null)
        {
          _logger.LogInformation($"Could not user with the username of {request.UserName}");
          throw new RestException(HttpStatusCode.NotFound, new { user = "Not Found" });
        }

        // Use null coalessence operator to do or operator for a different value
        user.DisplayName = request.DisplayName ?? user.DisplayName;
        user.Bio = request.Bio ?? user.Bio;

        var success = await _context.SaveChangesAsync() > 0;

        // handle exception errors
        if (!success) throw new Exception("Problem saving changes");

        // return success, which is an empty object
        return Unit.Value;
      }
    }
  }

}