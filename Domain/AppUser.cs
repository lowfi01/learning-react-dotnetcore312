using Microsoft.AspNetCore.Identity;

namespace Domain
{
  // Note: We do want domain to have no dependencies..
  //       - but to immplement DotnetCore Identity we would need to inherit IdentityUser
  //       - alternatives provided was to create a new project that handled Identification,
  //         having an indentiy server, but that is outside of the scope of this project.

  public class AppUser : IdentityUser
  {
    public string DisplayName { get; set; } // name displayed in application for this particular user.


  }
}