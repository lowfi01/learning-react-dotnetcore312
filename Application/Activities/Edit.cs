using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application.Activities
{
  public class Edit
  {
    public class Command : IRequest
    {
      public Guid Id { get; set; }
      public string Title { get; set; }
      public string Description { get; set; }

      public string Category { get; set; }

      public DateTime? Date { get; set; }

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
      private readonly ILogger _logger;
      public Handler(DataContext context, ILogger<Edit> logger)
      {
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

        _logger.LogTrace("Check to see if activity exists");
        var activityInDb = await _context.Activities.FindAsync(request.Id); // find activity
        if (activityInDb == null)
        {
          _logger.LogInformation("Could not find activity throwing exception");
          throw new RestException(HttpStatusCode.NotFound, new { activity = "Not Found" });
        }



        // Use null coalessence operator to do or operator for a different value
        activityInDb.Title = request.Title ?? activityInDb.Title;
        activityInDb.Description = request.Description ?? activityInDb.Description;
        activityInDb.Category = request.Category ?? activityInDb.Category;
        activityInDb.Date = request.Date ?? activityInDb.Date;
        activityInDb.City = request.City ?? activityInDb.City;
        activityInDb.Venue = request.Venue ?? activityInDb.Venue;

        // -- this will still trigger a change as activityInDb is being tracked by _context
        var success = await _context.SaveChangesAsync() > 0;

        // handle exception errors
        if (!success) throw new Exception("Problem saving activity to database");

        // return success, which is an empty object
        return Unit.Value;
      }
    }
  }
}