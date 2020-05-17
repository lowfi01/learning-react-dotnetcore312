using Application.Activities;
using FluentValidation.AspNetCore;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
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


      //

    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
      if (env.IsDevelopment())
      {
        app.UseDeveloperExceptionPage();
      }

      // app.UseHttpsRedirection(); // remove during developement

      app.UseRouting();

      app.UseAuthorization();

      // Add cors as middleware
      app.UseCors("CorsPolicy");

      app.UseEndpoints(endpoints =>
      {
        endpoints.MapControllers();
      });
    }
  }
}
