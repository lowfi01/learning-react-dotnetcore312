using System;
using System.ComponentModel.DataAnnotations;
using System.Threading;
using System.Threading.Tasks;
using Domain;
using MediatR;
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

    public class Handler : IRequestHandler<Command>
    {
      private readonly DataContext _context;

      public Handler(DataContext context)
      {
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