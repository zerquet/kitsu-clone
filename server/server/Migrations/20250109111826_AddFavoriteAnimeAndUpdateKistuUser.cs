using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class AddFavoriteAnimeAndUpdateKistuUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Bio",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateOnly>(
                name: "Birthday",
                table: "AspNetUsers",
                type: "date",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Gender",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Location",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "FavoriteAnime",
                columns: table => new
                {
                    KitsuUserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    AnimeId = table.Column<int>(type: "int", nullable: false),
                    DateAdded = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FavoriteAnime", x => new { x.AnimeId, x.KitsuUserId });
                    table.ForeignKey(
                        name: "FK_FavoriteAnime_Animes_AnimeId",
                        column: x => x.AnimeId,
                        principalTable: "Animes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FavoriteAnime_AspNetUsers_KitsuUserId",
                        column: x => x.KitsuUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_FavoriteAnime_KitsuUserId",
                table: "FavoriteAnime",
                column: "KitsuUserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FavoriteAnime");

            migrationBuilder.DropColumn(
                name: "Bio",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "Birthday",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "Gender",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "Location",
                table: "AspNetUsers");
        }
    }
}
