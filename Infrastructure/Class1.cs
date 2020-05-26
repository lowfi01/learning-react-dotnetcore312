using System;

namespace Infrastructure
{
  public class Class1
  {
    // Notes : for commit message
    // Infrastructure initial setup, - will have the job of generating jwt tokens
    // - Infratructure has a dependency to Application.
    // - API will have a dependency to Infrastructure.
    // We will create an Interface, so that we can use dependency inject from Api down to Application
    // of our Interface class, so that Application (business logic) is able to use the Interface classes
    // to generate tokens


  }
}



