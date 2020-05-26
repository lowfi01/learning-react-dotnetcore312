using System.Text;
using API.Middleware;
using Application.Activities;
using Application.Interfaces;
using Domain;
using FluentValidation.AspNetCore;
using Infrastructure.Security;
using MediatR;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Persistence;

namespace API
{
  public class Startup
  {
    public Startup(IConfiguration configuration)
    {
      Configuration = configuration;
    }

    public IConfiguration Configuration { get; }

    // This method gets called by the runtime. Use this method to add services to the container.
    public void ConfigureServices(IServiceCollection services)
    {
      // Data injection
      services.AddControllers()
        // add fluent validation as a service
        .AddFluentValidation(cfg =>
        {
          // FlientValidation Setup
          // - Find which assemblies contain our validators.
          // - Validator will register the entire assembly that contains the Application.Create class.
          //   - so it will register the Application assembly :D
          cfg.RegisterValidatorsFromAssemblyContaining<Create>();
        });

      // Add Asp.netCore Identity
      // - services.AddIdentity,
      //   - used with mvc where serving our pages from the server using razor libary (cookie authentication method)
      //   - has roles & users
      // - services.AddIdentityCore,
      //   - used to specifiy user types but no roles by default.
      var builder = services.AddIdentityCore<AppUser>(); // register service
      var identityBuilder = new IdentityBuilder(builder.UserType, builder.Services); // create new instance of identity type
      identityBuilder.AddEntityFrameworkStores<DataContext>(); // register the store, which is our data context
      identityBuilder.AddSignInManager<SignInManager<AppUser>>(); // register the Sign in manager & user type


      // note we should be hard coding the key, JwtGenerator.cs also has hardcoded vale
      var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("super secret key that will sign all tokens"));

      // this will provide us with the ability to authenticate users before they have access to our API
      // - Note: once we add this to our configure method, with out other auto run on startup methods... eg middleware
      //         we should have the ability to use [Authorize] attributes within our controllers
      services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        .AddJwtBearer(opt =>
        {
          opt.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
          {
            // tell api what we should be validating when recieving a token
            ValidateIssuerSigningKey = true, // validate sign in key is valid
            IssuerSigningKey = key, // check token key is valid (last part of the token)
            ValidateAudience = false, // note - we could use the url of the request
            ValidateIssuer = false
          };
        });

      // End CORS - cross origin request blocked
      services.AddCors(options =>
      {
        options.AddPolicy("CorsPolicy", policy =>
        {
          policy.AllowAnyHeader().AllowAnyMethod().WithOrigins("http://localhost:3000");
        });
      });

      // Dependecy injection.
      // -- we inject what we need as a service.
      // -- Requirement is AddControllers()

      // Pass our data context, which is defined in PERSISTENCE as a service -- dependency injection
      // -- IServiceCollection has extension method that defines dbContext
      services.AddDbContext<DataContext>(opt =>
        {
          opt.UseSqlite(Configuration.GetConnectionString("DefaultConnection")); // sqlite takes a connection string
        }
      );

      // Pass MediatR as a service -- dependency injection
      // -- requires use to pass assemblys which are our handlers
      // Note - clearly AddMediatR requires a list of handlers, then why only pass one?
      //      Answer -
      //      -- this is because it is smart enough to understand that it can find all
      //      -- the other handlers within that project passed
      services.AddMediatR(typeof(List.Handler).Assembly);

      // Inject IJwtGenerator * Generator class into our application.
      // - this will make avaiable out IJwtGenerator & the JwtGenerator class, which implements createtoken(AppUser user) => string;
      // Note: we inject these services, through the contructors of our classes :D  className(inject service); we
      //      have access to them & the methods inside!!!
      // Note: by using the JwtGenerator, we will be using the concreate class is that is avaialable inside our infrustructor project.
      services.AddScoped<IJwtGenerator, JwtGenerator>();

    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
      // NOTE: Order of methods is very important here.
      // - reference documentation for details "Migrate Startup.Configure" https://docs.microsoft.com/en-us/aspnet/core/migration/22-to-30?view=aspnetcore-3.1&tabs=visual-studio#migrate-startupconfigure
      // - UserMiddleware Error handling is first, because we want to catch errors early!!


      // Implement middleware..
      //  - Note: this needs to be at the top so as to catch exceptions early in the pipeline.
      //  - Use our ErrorHandlingMiddleware class.
      app.UseMiddleware<ErrorHandlingMiddleware>();

      if (env.IsDevelopment())
      {
        // app.UseDeveloperExceptionPage();

      }

      // app.UseHttpsRedirection(); // remove during developement

      app.UseRouting();
      // Add cors as middleware
      app.UseCors("CorsPolicy");

      // This will give us the ability to use [Authrize attribute within our controllers]
      app.UseAuthentication(); // Note we define the rules for this in ConfigureServices() as a service!!
      app.UseAuthorization();



      app.UseEndpoints(endpoints =>
      {
        endpoints.MapControllers();
      });
    }
  }
}
