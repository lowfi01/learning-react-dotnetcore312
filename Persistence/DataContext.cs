using System;
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

    public DbSet<Value> Values { get; set; } // generates a Values table with migrations

    public DbSet<Activity> Activities { get; set; }

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
    }

  }
}
