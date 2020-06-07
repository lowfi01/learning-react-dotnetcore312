using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace Domain
{
  // Note: We do want domain to have no dependencies..
  //       - but to immplement DotnetCore Identity we would need to inherit IdentityUser
  //       - alternatives provided was to create a new project that handled Identification,
  //         having an indentiy server, but that is outside of the scope of this project.

  public class AppUser : IdentityUser
  {
    // model is an extension of IdentityUser
    // - this will popoulate our databse with all the required IdentityUser fields
    // - we add DisplayName so as to ensure we are able to add this additional field to the db :D
    public string DisplayName { get; set; }

    // This defines the relationship for UserActivity
    // - this will let entity framwork know that this is a joining table.
    // - this also acts as a navigation point for our linq statments
    public ICollection<UserActivity> UserActivities { get; set; }

  }
}