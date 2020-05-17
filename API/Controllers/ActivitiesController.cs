using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Application.Activities;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
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
  public class ActivitiesController : ControllerBase
  {
    // Thin API controller model
    // - only handles response and requests
    // - does not have knowledge about BL within Application/ project

    // API controller, requires.
    // -- Root
    // -- API attribute
    // -- Derive from MVC controller class

    // API Responsability.
    // -- Recieve requests
    // -- Response to requests
    // -- Asks a question... (can we fetch data?), answered by Application Layer (business logic)
    //    -- uses mediator to get the data we need.

    // Inject and use MediatorR
    // -- we are clearly injecting MediatorR here, but still requing it's package.
    private readonly IMediator _mediator;

    public ActivitiesController(IMediator mediator)
    {
      _mediator = mediator;
    }

    // HTTP GET Activities
    // -- CancellationToken allows users to pass a cancelation request while awaiting API request
    //    -- doing this prevents the database from being overwhelmed with requests..
    //    -- as users could just spam f5 pm the request window..
    [HttpGet]
    public async Task<ActionResult<List<Activity>>> List(CancellationToken ct)
    {

      // Controller action.
      // -- using Query (CQRS) we fetch the list of activites

      // Using MediatorR
      // -- We send a message to our list query to fetch.
      return await _mediator.Send(new List.Query(), ct);

    }

    // HTTP Get Activities Detail based on Guid Id
    // -- Handle Query string
    //    -- within the HttpGet Attribute
    //    -- pass expect Guid Id within the param of the API request

    [HttpGet("{id}")]
    public async Task<ActionResult<Activity>> Details(Guid id)
    {

      // Send Mediator send request with Query message
      // -- initialize our Query prop of Id using the prop initializer syntax
      return await _mediator.Send(new Details.Query { Id = id });

    }

    // Post Requests
    // -- As we are making a post request & using [ApiController] attribute
    //    -- the api controller is smart enough to know where to look for the objects
    //       that our create command needs
    // -- If you look in Application/Activities/Create.cs, our command object has
    //    properties which can easily be mapped to our request object being passed.
    //    - this is called object binding.
    //    -- Lets assume we were not using ApiController attributes, we would could then use this
    //       --  Create([Frombody]Type variable) // which would give a hint to where to look to help binding the model
    [HttpPost]
    public async Task<ActionResult<Unit>> Create([FromBody] Create.Command command)  // note - Auto binding we map the request body to the command!! similar to DTO
    {
      // Note - this is the approach we would do prior to [ApiAttribute]
      // if (!ModelState.IsValid) return BadRequest(ModelState); // should return 400 if data attribute fails

      return await _mediator.Send(command);
    }


    [HttpPut("{id}")]
    public async Task<ActionResult<Unit>> Edit(Guid id, Edit.Command command)
    {
      command.Id = id; // attach the id to the command object
      return await _mediator.Send(command);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<Unit>> Edit(Guid id)
    {
      return await _mediator.Send(new Delete.Command { Id = id });
    }

  }
}