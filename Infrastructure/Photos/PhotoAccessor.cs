using System;
using Application.Interfaces;
using Application.Photos;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;

// # - using Cloudinary dotnet action nuget package
// - Cloudinary provides us with a package that makes using images easier..
//   - also contains options for  php, nodejs etc.... look at website for further information
namespace Infrastructure.Photos
{
  public class PhotoAccessor : IPhotoAccessor
  {
    private readonly Cloudinary _cloudinary; // should hold cloundinary methods

    // Note: we have used option to gain access to our startup.cs services.Configure<CloudinarySettings>
    //       - This maps to our user secrets which are strongly typed :) "look at services.configure commments"
    public PhotoAccessor(IOptions<CloudinarySettings> config)
    {
      // cloudinary Account is provided by cloudinary package
      var acc = new Account(
        config.Value.CloudName,
        config.Value.ApiKey,
        config.Value.ApiSecret
      );

      // setup cloudinary using account :)
      _cloudinary = new Cloudinary(acc);
    }

    public PhotoUploadResult AddPhoto(IFormFile file)
    {
      var uploadResults = new ImageUploadResult();

      if (file.Length > 0) // check to see if file is not empty
      {
        // as we are manipulating memory, we want to dispose of it correct once done!
        using (var stream = file.OpenReadStream())
        {
          // read file(should be image) into memory! (store to memory)
          var uploadParams = new ImageUploadParams
          {
            // tell cloudinary which files we are passing
            File = new FileDescription(file.FileName, stream),
            // Tranform our images (rescale, crop etc..) Note: we are using the client side to crop images so i'll comment this out for now.
            // Transformation = new Transformation().Height(500).Width(500).Crop("fill").Gravity("face"),
          };
          uploadResults = _cloudinary.Upload(uploadParams); // Should pass to cloudinary
        }
      };

      // Add error handling for _cloudinary
      if (uploadResults.Error != null) throw new Exception(uploadResults.Error.Message);

      // lets turn the finished result into a custom object we created :)
      return new PhotoUploadResult
      {
        PublicId = uploadResults.PublicId,
        Url = uploadResults.SecureUrl.AbsoluteUri
      };
    }

    public string DeletePhoto(string publicId)
    {
      var deleteParams = new DeletionParams(publicId);

      var result = _cloudinary.Destroy(deleteParams); // Destroy returns a result string value

      return result.Result == "ok" ? result.Result : null; // check if result is ok else return null
    }
  }
}