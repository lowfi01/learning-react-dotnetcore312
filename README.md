## REACTIVITIES - Learning resource
 - Dotnet core 3.1
 - Clean architecture
 - Global Exceptions
 - Fluent validation
 - Automapper
 - Photo uploading
 - Mediator & CQRS

## User Secrets, store global configuration values on local machine

 - Store user secrets to to dotnet user-secrets, during development ( execute CLI commands from startup project -p API/ )
   - dotnet user-secrets -h
   - dotnet user-secrets list -p API/
   - dotnet user-secrets set "key" "value"
   - dotnet user-secrets set "keyGroup:key" "value"  // allows you to assign entire sections as object
        ```
        keyGroup:{
            key1: value
            key2: value
        }
        ```

 ### How to use

  ```
    - User-secret config for existing project

        C:\Users\james\Documents\Programming\mixed-projects\Reactivities>dotnet user-secrets list -p API/
            TokenKey = super secret key that will sign all tokens
            Cloudinary:CloudName = lowfi01
            Cloudinary:ApiSecret = 6ZQGuVuqQKuH6gtF54ziVFn4T0w
            Cloudinary:ApiKey = 263189922523254
  ```

  ```
    - class we will create a custom class, which will map & allow our user-secrets to be strongly typed
      to the values of service configuration

          namespace Infrastructure.Photos
              {
                public class CloudinarySettings
                {
                  public string CloudName { get; set; }
                  public string ApiKey { get; set; }
                  public string ApiSecret { get; set; }
                }
              }

    - Startup.cs, using our User-Secrets

          services.Configure<CloudinarySettings>(
                // We will pass our secret key
                // - dotnet user-secrets list (to show all secret keys stores on our machine)
                // - output of user-secrets, we are mapping :D
                //    - Cloudinary:CloudName = lowfi01
                //    - Cloudinary:ApiSecret = 6ZQGuVuqQKuH6gtF54ziVFn4T0w
                //    - Cloudinary:ApiKey = 263189922523254
                Configuration.GetSection("Cloudinary")  // get keyGroup.. which will map to our custom type
              );
  ```


  ```
    Migrations -- Perform within root folder.

      // Creates migration file to allow you to skaffold or Update tables
      dotnet ef migrations add "PhotoEntityAdded" -p Persistence/ -s API/

      // Run migration that will update database directly


  ```

  ###


