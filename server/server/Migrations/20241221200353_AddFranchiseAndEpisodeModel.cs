using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class AddFranchiseAndEpisodeModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "0470ca54-ef5e-4114-ae11-422c340678de");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "8ee56fc4-c834-499a-a6af-ba8641c34e11");

            migrationBuilder.AddColumn<int>(
                name: "FranchiseId",
                table: "Animes",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Episode",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AnimeId = table.Column<int>(type: "int", nullable: false),
                    Number = table.Column<int>(type: "int", nullable: true),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AirDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    JapaneseTitle = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Episode", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Episode_Animes_AnimeId",
                        column: x => x.AnimeId,
                        principalTable: "Animes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Franchise",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Franchise", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "1f11b69d-1324-4233-88b3-a9330c84bd53", null, "Admin", "ADMIN" },
                    { "4f9737cd-d171-48f5-8636-a9bac5ca2271", null, "User", "USER" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Animes_FranchiseId",
                table: "Animes",
                column: "FranchiseId");

            migrationBuilder.CreateIndex(
                name: "IX_Episode_AnimeId",
                table: "Episode",
                column: "AnimeId");

            migrationBuilder.AddForeignKey(
                name: "FK_Animes_Franchise_FranchiseId",
                table: "Animes",
                column: "FranchiseId",
                principalTable: "Franchise",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Animes_Franchise_FranchiseId",
                table: "Animes");

            migrationBuilder.DropTable(
                name: "Episode");

            migrationBuilder.DropTable(
                name: "Franchise");

            migrationBuilder.DropIndex(
                name: "IX_Animes_FranchiseId",
                table: "Animes");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "1f11b69d-1324-4233-88b3-a9330c84bd53");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "4f9737cd-d171-48f5-8636-a9bac5ca2271");

            migrationBuilder.DropColumn(
                name: "FranchiseId",
                table: "Animes");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "0470ca54-ef5e-4114-ae11-422c340678de", null, "Admin", "ADMIN" },
                    { "8ee56fc4-c834-499a-a6af-ba8641c34e11", null, "User", "USER" }
                });
        }
    }
}
