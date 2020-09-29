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
  public class Delete
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
      private readonly IPhotoAccessor _photoAccessor;

      public Handler(IUserAccessor userAccessor, IPhotoAccessor photoAccessor, DataContext context, ILogger<Handler> logger)
      {
        _photoAccessor = photoAccessor;
        _userAccessor = userAccessor;
        _logger = logger;
        _context = context;
      }

      public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
      {

        var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUsername());

        var photo = user.Photos.FirstOrDefault(x => x.Id == request.Id);

        // only delete photos that are associated with user
        if (photo == null)
        {
          throw new RestException(HttpStatusCode.NotFound, new { Photo = "Not Found" });
        }

        // main photos cannot be deleted
        if (photo.IsMain)
        {
          throw new RestException(HttpStatusCode.BadRequest, new { Photo = "You cannot delete your main photo" });
        }

        var result = _photoAccessor.DeletePhoto(photo.Id);

        if (result == null)
        {
          throw new Exception("Problem deleting the photo");
        }

        user.Photos.Remove(photo); // make changes to database

        var success = await _context.SaveChangesAsync() > 0;

        // handle exception errors
        if (!success) throw new Exception("Problem saving changes");

        // return success, which is an empty object
        return Unit.Value;
      }

    }
  }
}