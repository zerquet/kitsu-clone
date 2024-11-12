using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class UpdateAnimeLibraryEntry : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            //Again, same role deletion behavior. Gonna leave it for now, but leaving this link just in case things go left. 
            //https://stackoverflow.com/questions/52517573/why-seeded-roles-are-deleted-on-every-migration-in-asp-net-core-2-1
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "20389b05-0b2b-4ebb-95da-ba6ec269433f");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "e22b6c20-b6c1-4ac7-95dc-2364116c81d9");

            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "AnimeLibraryEntries",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<int>(
                name: "EpisodesSeen",
                table: "AnimeLibraryEntries",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Rating",
                table: "AnimeLibraryEntries",
                type: "int",
                nullable: true);

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "96a0823f-5d0b-4495-a953-f31745318a9c", null, "Admin", "ADMIN" },
                    { "cc2f199c-0165-4903-844c-10a996001894", null, "User", "USER" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "96a0823f-5d0b-4495-a953-f31745318a9c");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "cc2f199c-0165-4903-844c-10a996001894");

            migrationBuilder.DropColumn(
                name: "EpisodesSeen",
                table: "AnimeLibraryEntries");

            migrationBuilder.DropColumn(
                name: "Rating",
                table: "AnimeLibraryEntries");

            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "AnimeLibraryEntries",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "20389b05-0b2b-4ebb-95da-ba6ec269433f", null, "Admin", "ADMIN" },
                    { "e22b6c20-b6c1-4ac7-95dc-2364116c81d9", null, "User", "USER" }
                });
        }
    }
}
