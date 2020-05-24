using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Persistence;

namespace API
{
  public class Program
  {
    public static void Main(string[] args)
    {
      var host = CreateHostBuilder(args).Build();

      // Implement method to auto implement migrations on app start
      using (var scope = host.Services.CreateScope())
      {
        var services = scope.ServiceProvider;
        var logger = services.GetRequiredService<ILogger<Program>>();

        try
        {
          logger.LogTrace("Attempting to migrate database if required");
          var context = services.GetRequiredService<DataContext>();
          var userManger = services.GetRequiredService<UserManager<AppUser>>();
          context.Database.Migrate();
          // initialize seeding of database
          // - seeds list of acitivites, using the Data context - (setup in startup.cs)
          // - seeds Users, using the UserManager - (setup in startup.cs)
          Seed.SeedData(context, userManger).Wait(); // force async task to wait! as SeedData is a async / await
        }
        catch (Exception ex)
        {
          logger.LogError(ex, " An error occured during migration");
        }
      }

      // run application
      host.Run();

      // CreateHostBuilder(args).Build().Run();
    }

    public static IHostBuilder CreateHostBuilder(string[] args) =>
        Host.CreateDefaultBuilder(args)
            .ConfigureWebHostDefaults(webBuilder =>
            {
              webBuilder.UseStartup<Startup>();
            });
  }
}
