using System;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Interfaces;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
  public class Create
  {
    public class Command : IRequest // note we don't pass unit type to IRequest.
    {
      public Guid Id { get; set; }

      public string Title { get; set; }

      public string Description { get; set; }

      public string Category { get; set; }

      public DateTime Date { get; set; }

      public string City { get; set; }

      public string Venue { get; set; }
    }

    public class CommandValidator : AbstractValidator<Command>
    {
      public CommandValidator()
      {
        RuleFor(x => x.Title).NotEmpty();
        RuleFor(x => x.Description).NotEmpty();
        RuleFor(x => x.Category).NotEmpty();
        RuleFor(x => x.Date).NotEmpty();
        RuleFor(x => x.City).NotEmpty();
        RuleFor(x => x.Venue).NotEmpty();
      }
    }

    public class Handler : IRequestHandler<Command>
    {
      private readonly DataContext _context;
      private readonly IUserAccessor _userAccessor;

      public Handler(DataContext context, IUserAccessor userAccessor)
      {
        this._userAccessor = userAccessor; // get user from token!
        this._context = context;
      }

      public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
      {
        var activity = new Activity
        {
          Id = request.Id,
          Title = request.Title,
          Description = request.Description,
          Category = request.Category,
          Date = request.Date,
          City = request.City,
          Venue = request.Venue
        };

        _context.Activities.Add(activity);

        // Logic for associating a User to activity.
        // - get user from database, using the jwt token id: userName.
        // - userAccessor,  will look at the jwt token within the request header automatically
        //   this happens via the http context.
        // 1. get user from database, using jwt token found within IHttpContext
        // 2. create UserActivity object to store attendee data,
        //    mix of user & activity (join table)
        // 3. Save Attendee to UserActivity Table
        // 4. Save Activity to Activity Table.

        var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUsername());

        var attendee = new UserActivity
        {
          Activity = activity,
          AppUser = user,
          DateJoined = DateTime.Now,
          IsHost = true,
        };

        _context.UserActivity.Add(attendee);

        // Success & SaveChangesAsync
        // -- SaveChangesAsync, will return an int based on successful saves to database
        //    -- we can conditional check result by adding a trailling > operator that.
        //       - checks if returned int is greater than 0,
        //    -- if successful success should be true!.
        var success = await _context.SaveChangesAsync() > 0;

        // handle exception errors
        if (!success) throw new Exception("Problem saving activity to database");

        // return success, which is an empty object
        return Unit.Value;
      }
    }
  }
}