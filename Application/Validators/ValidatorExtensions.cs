using FluentValidation;

namespace Application.Validators
{

  // Static: will make it so we do not need to abstantiate this class to make use of it
  //         - ie, we do not need a new version of this class anywhere.
  public static class ValidatorExtensions
  {
    public static IRuleBuilder<T, string> Password<T>(this IRuleBuilder<T, string> ruleBuilder)
    {
      // This will be our fluent validation rules.
      // Note: we created this so we can reuse the rules anywhere & to reduce the code bloat in our handlers
      var options = ruleBuilder
        .NotEmpty()
        .MinimumLength(6).WithMessage("Password must be at least 6 characters")
        .Matches("[A-Z]").WithMessage("Password must contain 1 uppercase letter")
        .Matches("[a-z]").WithMessage("Password must have at least 1 lowercase character")
        .Matches("[0-9]").WithMessage("Password must contain a number")
        .Matches("^[a-zA-Z0-9]").WithMessage("Password must contain non alphanumeric");

      return options;
    }
  }
}