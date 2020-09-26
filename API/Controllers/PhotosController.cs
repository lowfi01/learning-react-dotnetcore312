using System.Threading.Tasks;
using Application.Photos;
using Domain;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
  public class PhotosController : BaseController
  {
    // Our request command objec, requires some help to be assigned a FileForm type
    // So we will give it a hint [FromForm], this will ensure that instead of looking
    // inside the body or the query of the request, it will know specifically where to look
    // to locate the File we need.
    [HttpPost]
    public async Task<ActionResult<Photo>> Add([FromForm] Add.Command command)
    {
      return await Mediator.Send(command);
    }
  }
}