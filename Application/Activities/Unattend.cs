using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application.Activities
{
  public class Unattend
  {
    public class Command : IRequest
    {
      public Guid Id { get; set; }
    }

    public class Handler : IRequestHandler<Command>
    {
      private readonly DataContext _context;
      private readonly ILogger<Unattend> _logger;
      private readonly IUserAccessor _userAccessor;

      public Handler(DataContext context, ILogger<Unattend> logger, IUserAccessor userAccessor)
      {
        this._userAccessor = userAccessor;
        this._logger = logger;
        this._context = context;
      }

      public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
      {
        var activityInDb = await _context.Activities.FindAsync(request.Id);

        if (activityInDb == null)
          throw new RestException(HttpStatusCode.NotFound, new { Activity = "Unable to find Activity to remove user from!" });

        // Note: As we are not searching using the primary key, we cannot use FindAsync!!
        var userInDb = await _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUsername());

        // Note: we use linq here so we are able to check both foreign keys
        var attendence = await _context.UserActivity.SingleOrDefaultAsync(x => x.ActivityId == activityInDb.Id && x.AppUserId == userInDb.Id);

        if (attendence == null)
          throw new RestException(HttpStatusCode.NotFound, new { Attendance = "User is not attending this Activity!" });

        if (attendence.IsHost)
          throw new RestException(HttpStatusCode.BadRequest, new { Attendance = "Host cannot remove themselves from Activity" });

        _context.UserActivity.Remove(attendence);

        var success = await _context.SaveChangesAsync() > 0;

        // handle exception errors
        if (!success) throw new Exception("Problem saving activity to database");

        // return success, which is an empty object
        return Unit.Value;
      }
    }
  }
}