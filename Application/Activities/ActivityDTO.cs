using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Application.Activities
{
  // We are creating a DTO to prevent error self referencing. (ReferenceLoopHandling)
  // - "errors": "A possible object cycle was detected which is not supported. This can either be due to a cycle or if the object depth is larger than the maximum allowed depth of 32."
  // Note: This object is identical to the UserActivity Domain model, but with the difference being
  //       we return attendees in place of AppUser...
  public class ActivityDTO
  {
    public Guid Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }

    public string Category { get; set; }

    public DateTime Date { get; set; }

    public string City { get; set; }

    public string Venue { get; set; }

    [JsonPropertyName("attendees")] // will return to the client UserActivity as attendees, as AutoMapper needs UserActivity to match names (convention based)
    public ICollection<AttendeeDTO> UserActivities { get; set; }

  }
}