using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
  public class Details
  {
    public class Query : IRequest<ActivityDTO> // Fixing ReferenceLoop error, return DTO
    {
      public Guid Id { get; set; }
    }

    public class Handler : IRequestHandler<Query, ActivityDTO>
    {
      private readonly DataContext _context;
      private readonly IMapper _mapper;
      public Handler(DataContext context, IMapper mapper)
      {
        this._mapper = mapper;
        this._context = context;
      }

      public async Task<ActivityDTO> Handle(Query request, CancellationToken cancellationToken)
      {
        // implemented Eager loading
        // - We send related data with the initial query, requires, Include() & ThenInclude()
        // - https://docs.microsoft.com/en-us/ef/core/querying/related-data
        var activityInDb = await _context.Activities
          .Include(x => x.UserActivities)
            .ThenInclude(x => x.AppUser)
          .SingleOrDefaultAsync(x => x.Id == request.Id); // Method needed to be changes as it was not compatible with Eager Loading include

        // throw custom exception!!
        if (activityInDb == null)
          throw new RestException(HttpStatusCode.NotFound, new { activity = "Not Found" });


        // Implement AutoMapping - Activity to ActivityDTO
        var activityToReturn = _mapper.Map<Activity, ActivityDTO>(activityInDb);
        return activityToReturn;
      }
    }
  }
}