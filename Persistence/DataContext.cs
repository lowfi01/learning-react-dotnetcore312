using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{

  public class DataContext : IdentityDbContext<AppUser> // derive from IdentityDb rather than DbContext
  {
    public DataContext(DbContextOptions options) : base(options)
    {
    }

    // Note: We do not see DbSet<Users>, this is implemented from IdentityDbContext<AppUser>, which we inherit :D
    public DbSet<Value> Values { get; set; } // generates a Values table with migrations

    public DbSet<Activity> Activities { get; set; }

    // Configure our many to many relationship between - Activity, AppUser & userActivity (join)
    public DbSet<UserActivity> UserActivity { get; set; }

    // Generate Seed Data
    // - Overrides method from DbContext
    // - During creation of new migration,
    //   new Values will be inserted to our defined Entity<TableName>
    protected override void OnModelCreating(ModelBuilder builder)
    {
      // Configures the schema needed for identity (required with Identity framework)
      // - this allows us to to give user a primary key of string (during migration)
      base.OnModelCreating(builder);

      builder.Entity<Value>()
        .HasData(
          new Value { Id = 1, Name = "Seeded Value 01" },
          new Value { Id = 2, Name = "Seeded Value 02" },
          new Value { Id = 3, Name = "Seeded Value 03" }
        );

      // Create Primary key
      // - Creates a key that made of AppUserId & ActivityId
      builder.Entity<UserActivity>(x => x.HasKey(ua => new { ua.AppUserId, ua.ActivityId }));

      // Define Many to Many relationship within UserActivity our join.

      builder.Entity<UserActivity>()  // - Users can have many activities
                .HasOne(u => u.AppUser)
                .WithMany(a => a.UserActivities)
                .HasForeignKey(u => u.AppUserId);

      builder.Entity<UserActivity>()  // - Activities can have many Users
                .HasOne(u => u.Activity)
                .WithMany(a => a.UserActivities)
                .HasForeignKey(u => u.ActivityId);
    }

  }
}
