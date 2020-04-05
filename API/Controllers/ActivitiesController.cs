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
  [ApiController]
  public class ActivitiesController : ControllerBase
  {
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
    public async Task<ActionResult<Unit>> Create([FromBody]Create.Command command)
    {
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