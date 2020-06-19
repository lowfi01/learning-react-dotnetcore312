namespace Application.Photos
{
  // We are creating the return object for when we Add a Photo to our PhotoAccessor.
  // - Note: we are creating the type becuase cloudinary is not a dependecy that allows us access to the class
  //         rather it's 3rd party API we are consumming.. but we want to have the ability to control the behavour
  //         of adding & removing photos
  public class PhotoUploadResult
  {
    public string PublicId { get; set; }
    public string Url { get; set; }
  }

}