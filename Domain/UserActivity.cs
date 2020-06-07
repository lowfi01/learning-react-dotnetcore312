using System;

namespace Domain
{
  // This will define a join class, - many to many :D
  // - users can have many activities
  // - activities can have many users
  public class UserActivity
  {
    // Entity framework is convention based & will recognise
    // that AppUserId & ActivityId are the identifiers for
    // the joins.... it will automatically populate the
    // correct AppUser, based on AppUserId.... ORMS bby
    // Note: We do need to advice, Acitivity & AppUser tables
    //       of the existance of UserActivity.. for mapping.
    public string AppUserId { get; set; }
    public AppUser AppUser { get; set; }

    public Guid ActivityId { get; set; }
    public Activity Activity { get; set; }

    public DateTime DateJoined { get; set; }
    public bool IsHost { get; set; }
  }
}

