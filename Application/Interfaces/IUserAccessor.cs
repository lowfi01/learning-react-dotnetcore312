namespace Application.Interfaces
{
  // Should allow us the ability to extract username from token
  public interface IUserAccessor
  {
    string GetCurrentUsername();
  }
}