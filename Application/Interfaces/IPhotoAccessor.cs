using Application.Photos;
using Microsoft.AspNetCore.Http;

namespace Application.Interfaces
{
  public interface IPhotoAccessor
  {
    PhotoUploadResult AddPhoto(IFormFile file); // Store image that is provided by cloudinary
    string DeletePhoto(string publicId); // Delete image using the public id provided by Cloudinary
  }
}