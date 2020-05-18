using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using MediatR;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application.Activities
{
  public class Delete
  {
    public class Command : IRequest
    {
      public Guid Id { get; set; }
    }

    public class Handler : IRequestHandler<Command>
    {
      private readonly DataContext _context;
      private readonly ILogger _logger;
      public Handler(DataContext context, ILogger<Delete> logger)
      {
        this._logger = logger;
        this._context = context;
      }

      public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
      {

        // find activity by Id
        var activityInDb = await _context.Activities.FindAsync(request.Id);

        // throw custom exception!!
        if (activityInDb == null)
          throw new RestException(HttpStatusCode.NotFound, new { activity = "Not Found, unable to delete" });

        // remove activity from database -- will require a saveChanges "commit"
        _context.Remove(activityInDb);

        // commit changes requested to database
        var success = await _context.SaveChangesAsync() > 0;

        // throw error if unable to complete save change
        if (!success) throw new Exception("Problem saving changes");

        // return empty object of tyle Unit.Value;
        return Unit.Value;
      }
    }
  }
}