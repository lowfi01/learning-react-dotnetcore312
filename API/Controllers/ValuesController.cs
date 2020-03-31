using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace DatingApp.API.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class ValuesController : ControllerBase
  {
    private readonly DataContext _context;

    public ValuesController(DataContext context)
    {
      this._context = context;
    }

    // GET api/values
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Value>>> Get()
    {

      // Passing the request to call database on a different thread -- Async
      // - await task that is passed to different thread with this keyword.
      // - does not block the thread, that the request comes in on.
      // - 1 thread makes request
      //   new thread is created for database request for Values
      //   await for new thread before storing to variable<valuesInDb>
      // - Note - goal is to prevent blocking of requesting thread
      // - Note - calls that have the potential to be long running should be made asycn
      //          database calls can be potentially long running.
      var valuesInDb = await _context.Values.ToListAsync();
      return Ok(valuesInDb); // ok returns 200 status code

    }

    // GET api/values/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Value>> Get(int id)
    {

      // returns default value if no result,
      // - Value is a class, hence this is an object so the default value is null.
      // var valueInDb = await _context.Values.SingleOrDefaultAsync();
      var valueInDb = await _context.Values.FindAsync(id); // similar but will always return null if unfound
      return Ok(valueInDb); // ok returns 200 status code

    }

    // POST api/values
    [HttpPost]
    public void Post([FromBody] string value)
    {
    }

    // PUT api/values/5
    [HttpPut("{id}")]
    public void Put(int id, [FromBody] string value)
    {
    }

    // DELETE api/values/5
    [HttpDelete("{id}")]
    public void Delete(int id)
    {
    }
  }
}