using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application.Profiles
{
  public class Details
  {
    public class Query : IRequest<Profile>
    {
      // Query will contain UserName to help fetch user profiles
      public string UserName { get; set; }
    }

    public class Handler : IRequestHandler<Query, Profile>
    {
      private readonly DataContext _context;
      private readonly ILogger<Details> _logger;

      public Handler(DataContext context, ILogger<Details> logger)
      {
        this._logger = logger;
        this._context = context;
      }

      public async Task<Profile> Handle(Query request, CancellationToken cancellationToken)
      {

        var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == request.UserName);
        // var user = await _context.Users.FirstOrDefaultAsync(x => x.UserName == request.UserName);
        // var user = await _context.Users.Where(x => x.UserName == request.UserName).FirstOrDefaultAsync();

        return new Profile
        {
          DisplayName = user.DisplayName,
          UserName = user.UserName,
          Image = user.Photos.FirstOrDefault(x => x.IsMain)?.Url,
          Bio = user.Bio,
          Photo = user.Photos
        };
      }
    }
  }
}