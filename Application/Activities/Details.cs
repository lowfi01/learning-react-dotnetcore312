using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
  public class Details
  {
    public class Query : IRequest<Activity>
    {
      public Guid Id { get; set; }
    }

    public class Handler : IRequestHandler<Query, Activity>
    {
      private readonly DataContext _context;
      public Handler(DataContext context)
      {
        this._context = context;
      }

      public async Task<Activity> Handle(Query request, CancellationToken cancellationToken)
      {
        var activityInDb = await _context.Activities.FindAsync(request.Id);

        // throw custom exception!!
        if (activityInDb == null)
          throw new RestException(HttpStatusCode.NotFound, new { activity = "Not Found" });

        return activityInDb;
      }
    }
  }
}