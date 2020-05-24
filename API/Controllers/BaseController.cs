using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;

namespace API.Controllers
{
  // =============================================================================================================================
  // Base controller, will be the super class which all our controllers drive from
  // - it should hold all the common dependencies such as Mediator, Attributes etc.
  // =============================================================================================================================


  // MVC attributes
  [Route("api/[controller]")]

  // [ApiController]
  // - Magic! this will automatically validate System.ComponentModel.DataAnnotations,
  //   which will give automatic 400 responses.
  //   - So if you want to debug your API and you have data annotations, just comment this out. :D
  //     though in this demo we will be using fluent validation vs data annotation
  //   - prior to ApiController attribute we would need to check the modelState outselves.
  //     create(body request) { if(!ModelState.isValid){ return BadRequest(modelState); }  }
  [ApiController]

  public class BaseController : ControllerBase
  {

    // Provide, Mediator & inject it into any controllers that derive from this class
    private IMediator _mediator;

    // Dependency inject
    // - protected fields can only be used by class & derived class (children)
    // - we will call an expession & check if _mediator exists then using Conditional logical operator,
    //   we assign _mediator to the service IMediator which uses the microsofts dependency injection found in startup.cs
    protected IMediator Mediator => _mediator ?? (_mediator = HttpContext.RequestServices.GetService<IMediator>()); // dependecy inject (GetServices = using Microsoft.Extensions.DependencyInjection;)

  }
}