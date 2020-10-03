using System.Linq;
using AutoMapper;
using Domain;

namespace Application.Activities
{
  // mapping profile, inherites from Profile (using automapper)
  // - this is where we create our maps.. object to object
  // Note: AutoMapper is convention based...
  //      - Any property it finds within objects that have matching names...
  //        will automatically be mapped over.
  //        - But if properties do not have the same name we must define it here
  //          within our mapping profile.
  public class MappingProfile : Profile
  {
    public MappingProfile()
    {
      // Define from Object & to Object
      // - Activity turns into a ActivityDTO
      //   - Also define the non matching (non convention based) properties that need to be converted within the objects.
      CreateMap<Activity, ActivityDTO>();
      // Add logic for mapping non convention based fields.
      //   - We are fixing the mapping logic when property fields do not match.
      //    - Activity has:
      //      -- public ICollection<UserActivity> UserActivities { get; set; }
      //    - ActivityDTO has:
      //      --  public ICollection<AttendeeDTO> UserActivities { get; set; }
      //    Note: result will be that UserActivities will map to Attendees
      CreateMap<UserActivity, AttendeeDTO>()
        // - we are able to add options to help with mapping or nested AttendeeDTO
        //   as we were unable to correctly map the data we needed across
        //   d = destination, o = options, s = source..
        .ForMember(d => d.Username, o => o.MapFrom(s => s.AppUser.UserName)) // Changed to Username from UserName was this was not storing correct in mobxStore - clientApp
        .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.AppUser.DisplayName))
        .ForMember(d => d.Image, o => o.MapFrom(s => s.AppUser.Photos.FirstOrDefault(x => x.IsMain).Url));
      // Note: IsHost, has matching names and can easily map :D
    }
  }
}