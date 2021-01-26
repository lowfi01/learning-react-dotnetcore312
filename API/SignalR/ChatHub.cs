using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Application.Comments;
using MediatR;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
  public class ChatHub : Hub
  {
    private readonly IMediator _mediator;
    public ChatHub(IMediator mediator)
    {
      this._mediator = mediator;
    }

    public async Task SendComment(Create.Command command)
    {

      // fetch user from Context hub -- not created yet in this commit
      var username = Context.User?.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;

      command.UserName = username;

      // send comment to be saved to database
      var comment = await _mediator.Send(command);

      // Send comment to all connected/listening clients listen to this hub (ui)
      await Clients.All.SendAsync("ReceiveComment", comment);
    }
  }
}