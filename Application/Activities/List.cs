using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Persistence;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using Microsoft.Extensions.Logging;

namespace Application.Activities
{
  // Handler - for list of activities
  public class List
  {

    // Implement CQRS  -- Query logic using Mediator pattern
    //  -- Mediator pattern has a Query + Handler.
    //  -- IRequest<> lives within MediatR

    public class Query : IRequest<List<Activity>> { }  // returns a list of activities

    public class Handler : IRequestHandler<Query, List<Activity>>
    {

      // Implement our Mediator Pattern Here
      // Implement out Business logic here
      // - Out API should now be dumb, DBcontext should be implement here


      // Fetch Context from Dependecy injection
      // -- Provided but Microsoft.Extensions.DependencyInjection.IServicesCollection
      // -- DBContext added is defined in API/Startup.cs
      private readonly DataContext _context;
      private readonly ILogger<List> _logger;

      public Handler(DataContext context, ILogger<List> logger)
      {
        this._logger = logger;
        this._context = context;
      }

      public async Task<List<Activity>> Handle(Query request, CancellationToken cancellationToken)
      {

        // Example viewing cancellationToken
        // -- Note we are adding a delay to view this example within out api requirest (postman etc.)
        // try
        // {
        //   for (var i = 0; i < 10; i++)
        //   {
        //     cancellationToken.ThrowIfCancellationRequested();
        //     await Task.Delay(1000, cancellationToken);
        //     _logger.LogInformation($"Task {i} has Completed");
        //   }
        // }
        // catch (System.Exception ex) when (ex is TaskCanceledException)
        // {
        //   _logger.LogInformation($"{ex} - Task was cancelled");
        //   throw ex;
        // }



        // Asynronously fetch list of activities
        // -- Dependencies
        //    --  System.Linq
        //    --  Microsoft.EntityFrameworkCore.Linq
        //    --  System.Collection.Generics

        var activities = await _context.Activities.ToListAsync(cancellationToken);

        return activities;
      }
    }
  }
}