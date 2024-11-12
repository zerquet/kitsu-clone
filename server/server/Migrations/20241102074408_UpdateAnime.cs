using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class UpdateAnime : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            //This is deleting the 2 roles Admin and User and then readding them further down (trivially noting, with different IDs). 
            //Not sure, why - it's redundant - but just leaving it for the record if it happens again, in which case 
            //the redundancy should be eliminated after close inspection.
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "31ba25b1-c2c4-4db7-b13e-412a92c61932");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "7ae3087c-dac1-4b6e-9046-6d262f39e4ce");

            migrationBuilder.AddColumn<string>(
                name: "CoverImageId",
                table: "Animes",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Episodes",
                table: "Animes",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MediaType",
                table: "Animes",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Studios",
                table: "Animes",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "[]");

            migrationBuilder.AddColumn<int>(
                name: "Year",
                table: "Animes",
                type: "int",
                nullable: true);

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "20389b05-0b2b-4ebb-95da-ba6ec269433f", null, "Admin", "ADMIN" },
                    { "e22b6c20-b6c1-4ac7-95dc-2364116c81d9", null, "User", "USER" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "20389b05-0b2b-4ebb-95da-ba6ec269433f");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "e22b6c20-b6c1-4ac7-95dc-2364116c81d9");

            migrationBuilder.DropColumn(
                name: "CoverImageId",
                table: "Animes");

            migrationBuilder.DropColumn(
                name: "Episodes",
                table: "Animes");

            migrationBuilder.DropColumn(
                name: "MediaType",
                table: "Animes");

            migrationBuilder.DropColumn(
                name: "Studios",
                table: "Animes");

            migrationBuilder.DropColumn(
                name: "Year",
                table: "Animes");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "31ba25b1-c2c4-4db7-b13e-412a92c61932", null, "User", "USER" },
                    { "7ae3087c-dac1-4b6e-9046-6d262f39e4ce", null, "Admin", "ADMIN" }
                });
        }
    }
}
