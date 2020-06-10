using System.Text;
using API.Middleware;
using Application.Activities;
using Application.Interfaces;
using AutoMapper;
using Domain;
using FluentValidation.AspNetCore;
using Infrastructure.Security;
using MediatR;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Authorization;
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
      services.AddControllers(opt =>
      {
        // This will add our new Authorization policy to all requests!! without the need of decorators.
        // - Note: Prior to this we would need to use [Authorize] above our controllers
        var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
        opt.Filters.Add(new AuthorizeFilter(policy));
      })
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

      // Register our Custom Authorization Policy
      services.AddAuthorization(opt =>
      {
        opt.AddPolicy("IsActivityHost", policy =>
        {
          policy.Requirements.Add(new IsHostRequirement());
        });
      });

      // Definition of Transient
      // - Adding a transient service means that each time the service is requested, a new instance is created.
      // We are registering out IsHostRequirement as a Service to be created a new each time it is needed..
      //  - Note: this means as we inject this method to our application a new instance will be madee..
      services.AddTransient<IAuthorizationHandler, IsHostRequirementHandler>(); // inject our custom Authorization policy

      // note we should be hard coding the key, JwtGenerator.cs also has hardcoded vale

      var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["TokenKey"]));

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
          opt.UseLazyLoadingProxies(); // implement lazy loading
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

      // Automapper as a service -- dependency injection
      services.AddAutoMapper(typeof(List.Handler).Assembly); // just needs a location of the project where it can find automapping profiles

      // Inject IJwtGenerator * Generator class into our application.
      // - this will make avaiable out IJwtGenerator & the JwtGenerator class, which implements createtoken(AppUser user) => string;
      // Note: we inject these services, through the contructors of our classes :D  className(inject service); we
      //      have access to them & the methods inside!!!
      // Note: by using the JwtGenerator, we will be using the concreate class is that is avaialable inside our infrustructor project.
      services.AddScoped<IJwtGenerator, JwtGenerator>();


      // Inject UserAccessor as a service!! (Dependency injection)
      // - Allows us to get username from token.
      //   - this uses the HTTP context to check the user object & check list of claims... to find the username within our token.
      // - Note: we should now be able to call IUserAccessor to access UserAccessor methods... thus hiding implementation.
      services.AddScoped<IUserAccessor, UserAccessor>();

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
