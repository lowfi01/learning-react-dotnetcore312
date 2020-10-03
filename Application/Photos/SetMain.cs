using System;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application.Photos
{
  public class SetMain
  {
    public class Command : IRequest
    {
      public string Id { get; set; }
    }

    public class Handler : IRequestHandler<Command>
    {
      private readonly DataContext _context;
      private readonly ILogger<Handler> _logger;
      private readonly IUserAccessor _userAccessor;

      public Handler(DataContext context, IUserAccessor userAccessor, ILogger<Handler> logger)
      {
        _userAccessor = userAccessor;
        _logger = logger;
        _context = context;
      }

      public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
      {
        var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUsername());

        var photo = user.Photos.FirstOrDefault(x => x.Id == request.Id);

        if (photo == null) throw new RestException(HttpStatusCode.NotFound, new { Photo = "Not Found!" });

        var currentMainPhoto = user.Photos.FirstOrDefault(x => x.IsMain);

        // Note: These changes are being tracked by _context & when we call .SaveChangesAsync, we will save changes.
        currentMainPhoto.IsMain = false;
        photo.IsMain = true;

        var success = await _context.SaveChangesAsync() > 0;

        // handle exception errors
        if (!success) throw new Exception("Problem saving changes");

        // return success, which is an empty object
        return Unit.Value;
      }
    }
  }
}