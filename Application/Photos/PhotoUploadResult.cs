namespace Application.Photos
{
  // We are creating the return object for when we Add a Photo to our PhotoAccessor.
  // - Note: we are creating the type becuase cloudinary is not a dependecy that allows us access to the class
  //         rather it's 3rd party API we are consumming.. but we want to have the ability to control the behavour
  //         of adding & removing photos


  // Create custom type that maps to the expected result returned from cloudinary... this allows us to store & keep the results sent back from cloudinary.
  // - Note, we could do this another way.. but this lets us have a strongly typed response, which is good programming.
  public class PhotoUploadResult
  {
    public string PublicId { get; set; } // public id stored in cloudinary
    public string Url { get; set; } // url that maps to image stored by cloudinary
  }

}