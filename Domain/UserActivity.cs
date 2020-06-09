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
    public virtual AppUser AppUser { get; set; } // navigation props - virtual keyword is used for related data, required for lazyloading

    public Guid ActivityId { get; set; }
    public virtual Activity Activity { get; set; } // navigation props - virtual keyword is used for related data, required for lazyloading

    public DateTime DateJoined { get; set; }
    public bool IsHost { get; set; }
  }
}

