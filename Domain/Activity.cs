using System;
using System.Collections.Generic;

namespace Domain
{
  public class Activity
  {
    public Guid Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }

    public string Category { get; set; }

    public DateTime Date { get; set; }

    public string City { get; set; }

    public string Venue { get; set; }

    // This defines the relationship for UserActivity
    // - this will let entity framwork know that this is a joining table.
    // - this also acts as a navigation point for our linq statments
    public ICollection<UserActivity> UserActivities { get; set; }
  }
}