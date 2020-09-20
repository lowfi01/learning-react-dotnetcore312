using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application.Photos
{
  public class Add
  {
    public class Command : IRequest<Photo> // Normally Commands do not return data.. but in this instance we will allow it as we would like to make use of cloudanaries returned ID
    {
      public IFormFile File { get; set; }
    }

    public class Handler : IRequestHandler<Command, Photo> // Normally Commands do not return data.. but in this instance we will allow it as we would like to make use of cloudanaries returned ID
    {
      private readonly DataContext _context;
      private readonly ILogger<Handler> _logger;
      private readonly IUserAccessor _userAccessor;
      private readonly IPhotoAccessor _photoAccessor;

      public Handler(DataContext context, IUserAccessor userAccessor, IPhotoAccessor photoAccessor, ILogger<Handler> logger)
      {
        _photoAccessor = photoAccessor;
        _userAccessor = userAccessor;
        _logger = logger;
        _context = context;
      }

      public async Task<Photo> Handle(Command request, CancellationToken cancellationToken)
      {

        // Upload photo & Store Photo url & ID
        var photoUploadResult = _photoAccessor.AddPhoto(request.File);

        // Note: exception handling is provided by PhotoAccessor method, so need to check for null.

        // Fetch current user provided by the AuthToken
        var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUsername());

        // Set up new Photo data to be provided to user & returned
        var photo = new Photo
        {
          Url = photoUploadResult.Url,
          Id = photoUploadResult.PublicId
        };

        // Lets also check if the User has a current main photo.. if not we will set this photo as their main pic
        if (!user.Photos.Any(x => x.IsMain))
        {
          photo.IsMain = true;
        }

        // Now save photo to user Photos collection
        user.Photos.Add(photo);

        var success = await _context.SaveChangesAsync() > 0;

        // handle exception errors
        if (!success) throw new Exception("Problem saving activity to database");

        // return success, which is an empty object
        return photo;
      }

    }
  }
}