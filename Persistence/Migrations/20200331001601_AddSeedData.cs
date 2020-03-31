using Microsoft.EntityFrameworkCore.Migrations;

namespace Persistence.Migrations
{
  public partial class AddSeedData : Migration
  {
    protected override void Up(MigrationBuilder migrationBuilder)
    {
      migrationBuilder.InsertData(
          table: "Values",
          columns: new[] { "Id", "Name" },
          values: new object[] { 1, "Seeded Value 01" });

      migrationBuilder.InsertData(
          table: "Values",
          columns: new[] { "Id", "Name" },
          values: new object[] { 2, "Seeded Value 02" });

      migrationBuilder.InsertData(
          table: "Values",
          columns: new[] { "Id", "Name" },
          values: new object[] { 3, "Seeded Value 03" });
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
      migrationBuilder.DeleteData(
          table: "Values",
          keyColumn: "Id",
          keyValue: 1);

      migrationBuilder.DeleteData(
          table: "Values",
          keyColumn: "Id",
          keyValue: 2);

      migrationBuilder.DeleteData(
          table: "Values",
          keyColumn: "Id",
          keyValue: 3);
    }
  }
}
