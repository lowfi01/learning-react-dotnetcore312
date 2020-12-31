using System;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application.Comments
{
  public class Create
  {
    public class Command : IRequest<CommentDto>
    {
      public string Body { get; set; }
      public Guid ActivityId { get; set; }
      public string UserName { get; set; }
      public int MyProperty { get; set; }
    }

    public class Handler : IRequestHandler<Command, CommentDto>
    {
      private readonly DataContext _context;
      private readonly ILogger<Create> _logger;
      private readonly IMapper _mapper;

      public Handler(DataContext context, ILogger<Create> logger, IMapper mapper)
      {
        this._mapper = mapper;
        this._logger = logger;
        this._context = context;
      }

      public async Task<CommentDto> Handle(Command request, CancellationToken cancellationToken)
      {
        // Fetch activity & user
        // Create new comment
        // Add comment to the activity
        // return the comment back as a comment dto

        var activity = await _context.Activities.FindAsync(request.ActivityId);
        if (activity == null)
        {
          throw new RestException(HttpStatusCode.NotFound, new { Activity = "Not Found" });
        }

        var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == request.UserName);

        var comment = new Comment
        {
          Author = user,
          Activity = activity,
          Body = request.Body,
          CreatedAt = DateTime.Now
        };

        activity.Comments.Add(comment);

        var success = await _context.SaveChangesAsync() > 0;

        // handle exception errors
        if (!success) throw new Exception("Problem saving changes");

        // return success, which is an empty object
        return _mapper.Map<CommentDto>(comment);
      }
    }
  }
}