namespace Application.User
{
  // this will be the user object we would want to return in place of the AppUser which will expose the password hash
  public class User
  {
    public string DisplayName { get; set; }
    public string Token { get; set; }
    public string Username { get; set; }
    public string Image { get; set; }
  }
}