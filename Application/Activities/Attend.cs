using System;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application.Activities
{
  public class Attend
  {
    public class Command : IRequest
    {
      public Guid Id { get; set; } // reqest must contain the activity ID

    }

    public class Handler : IRequestHandler<Command>
    {
      private readonly DataContext _context;
      private readonly ILogger<Attend> _logger;
      private readonly IUserAccessor _userAccessor;

      public Handler(DataContext context, ILogger<Attend> logger, IUserAccessor userAccessor)
      {
        this._userAccessor = userAccessor;
        this._logger = logger;
        this._context = context;
      }

      public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
      {
        // handler logic goes here
        // -- Should be,
        //    - new type of domain entity
        //    - should add, edit, delete from database context
        //    - _context.ContextObject.Add(activity); // example

        var activtyInDb = await _context.Activities.FindAsync(request.Id);
        if (activtyInDb == null)
          throw new RestException(HttpStatusCode.NotFound, new { Activity = "Attendee cannot join an activity that does not exist!" });

        // Note: As we are not searching using the primary key, we cannot use FindAsync!!
        var userInDb = await _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUsername());

        // Note: we don't really need a check here as this method requires a token to access.. i've added it for just safety.
        if (userInDb == null)
          throw new RestException(HttpStatusCode.NotFound, new { User = "User not found! strangely this method requires a token!! so how did you get here?" });


        var attendence = await _context.UserActivity.SingleOrDefaultAsync(x => x.ActivityId == activtyInDb.Id && x.AppUserId == userInDb.Id);

        // Check to see if use is attending?
        if (attendence != null)
        {
          // check user is already attending Activity, they don't need to attend twice :D lets throw exception to break from method
          throw new RestException(HttpStatusCode.BadRequest, new { Attendence = "User already attending Activity!" });
        }

        // Create a new instance of UserActivity
        // Note: we should be overwritting the null value of attendence
        attendence = new UserActivity
        {
          Activity = activtyInDb,
          AppUser = userInDb,
          DateJoined = DateTime.Now,
          IsHost = false,
        };

        // Lets attempt to save it to database
        _context.UserActivity.Add(attendence);


        // Lets execute ACID process and await the result
        var success = await _context.SaveChangesAsync() > 0;

        // handle exception errors
        if (!success) throw new Exception("Problem saving activity to database");

        // return success, which is an empty object
        return Unit.Value;
      }

    }
  }
}