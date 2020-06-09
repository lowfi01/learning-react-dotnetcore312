using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Persistence;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using Microsoft.Extensions.Logging;
using AutoMapper;

namespace Application.Activities
{
  // Handler - for list of activities
  public class List
  {

    // Implement CQRS  -- Query logic using Mediator pattern
    //  -- Mediator pattern has a Query + Handler.
    //  -- IRequest<> lives within MediatR

    public class Query : IRequest<List<ActivityDTO>> { }  // returns a list of activities

    public class Handler : IRequestHandler<Query, List<ActivityDTO>>
    {

      // Implement our Mediator Pattern Here
      // Implement out Business logic here
      // - Out API should now be dumb, DBcontext should be implement here


      // Fetch Context from Dependecy injection
      // -- Provided but Microsoft.Extensions.DependencyInjection.IServicesCollection
      // -- DBContext added is defined in API/Startup.cs
      private readonly DataContext _context;
      private readonly ILogger<List> _logger;
      private readonly IMapper _mapper;

      public Handler(DataContext context, ILogger<List> logger, IMapper mapper)
      {
        this._mapper = mapper;
        this._logger = logger;
        this._context = context;
      }

      public async Task<List<ActivityDTO>> Handle(Query request, CancellationToken cancellationToken)
      {

        // throw new System.Exception(); // testing agent.ts error handling & toast messages

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

        // // implemented Eager loading
        // // - We send related data with the initial query, requires, Include() & ThenInclude()
        // // - https://docs.microsoft.com/en-us/ef/core/querying/related-data
        // var activities = await _context.Activities
        //   .Include(x => x.UserActivities) // Note: UserActivities is a navigation variable
        //     .ThenInclude(x => x.AppUser) // return the AppUser that is nested within UserActivities
        //   .ToListAsync(cancellationToken);


        // Implementation of Lazy loading
        // - we no longer need include() or theninclude(), as virtual keyword in related & navigation propers
        //   within our models... UserActivity, Activity & AppUser will implement lazy loading
        var activities = await _context.Activities
          .ToListAsync(cancellationToken);

        // Map takes a Generic of, Object to convert & object to convert to!
        return _mapper.Map<List<Activity>, List<ActivityDTO>>(activities);
      }
    }
  }
}