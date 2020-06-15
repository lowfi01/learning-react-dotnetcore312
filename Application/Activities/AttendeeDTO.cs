namespace Application.Activities
{
  // This will replace AppUser so as to prevent error below. (ReferenceLoopHandling)
  //    - Note: it's possible to ignore this message, but it's better to handle it with DTOs to reduce server burden
  //    - Note: Stack overflow answer
  //          - Really you shouldn't be returning your DB entities directly from your API. I'd suggest creating API-specific DTOs and mapping accordingly.
  //            Granted you said you didn't want to do that but I'd consider it general good practice to keep API and persistence internals separate.
  // Note: this is basically self referencing errors, it's confusing for the database... so we want
  //       to differentiate the data we sent back & DTOs are a perfect solution
  // - "errors": "A possible object cycle was detected which is not supported. This can either be due to a cycle or if the object depth is larger than the maximum allowed depth of 32."
  public class AttendeeDTO
  {
    public string Username { get; set; } // Changed to Username from UserName was this was not storing correct in mobxStore - clientApp
    public string DisplayName { get; set; }
    public string Image { get; set; }
    public bool IsHost { get; set; }
  }
}