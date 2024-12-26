using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class UpdateNamesAndProperties : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "1f11b69d-1324-4233-88b3-a9330c84bd53");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "4f9737cd-d171-48f5-8636-a9bac5ca2271");

            migrationBuilder.RenameColumn(
                name: "Status",
                table: "Animes",
                newName: "ReleaseStatus");

            migrationBuilder.RenameColumn(
                name: "Rating",
                table: "Animes",
                newName: "TvRating");

            migrationBuilder.RenameColumn(
                name: "Episodes",
                table: "Animes",
                newName: "EpisodeCount");

            migrationBuilder.AlterColumn<DateOnly>(
                name: "AirDate",
                table: "Episode",
                type: "date",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateOnly>(
                name: "StartAirDate",
                table: "Animes",
                type: "date",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateOnly>(
                name: "EndAirDate",
                table: "Animes",
                type: "date",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.RenameColumn(
                name: "Status", 
                table: "AnimeLibraryEntries",
                newName: "WatchStatus");

            migrationBuilder.RenameColumn(
                name: "EpisodesSeen",
                table: "AnimeLibraryEntries",
                newName: "EpisodesWatched");

            migrationBuilder.RenameColumn(
                name: "Rating",
                table: "AnimeLibraryEntries",
                newName: "UserRating");

            migrationBuilder.DropForeignKey(
                name: "FK_AnimeLibraryEntries_Animes_AnimeId",
                table: "AnimeLibraryEntries");

            migrationBuilder.DropForeignKey(
                name: "FK_AnimeLibraryEntries_AspNetUsers_KitsuUserId",
                table: "AnimeLibraryEntries");

            migrationBuilder.DropPrimaryKey(
                name: "PK_AnimeLibraryEntries",
                table: "AnimeLibraryEntries");

            migrationBuilder.DropIndex(
                name: "IX_AnimeLibraryEntries_AnimeId",
                table: "AnimeLibraryEntries");

            migrationBuilder.DropIndex(
                name: "IX_AnimeLibraryEntries_KitsuUserId",
                table: "AnimeLibraryEntries");

            migrationBuilder.AddPrimaryKey(
                name: "PK_LibraryEntries",
                table: "AnimeLibraryEntries",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_LibraryEntries_Animes_AnimeId",
                table: "AnimeLibraryEntries",
                column: "AnimeId",
                principalTable: "Animes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_LibraryEntries_AspNetUsers_KitsuUserId",
                table: "AnimeLibraryEntries",
                column: "KitsuUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.CreateIndex(
                name: "IX_LibraryEntries_AnimeId",
                table: "AnimeLibraryEntries",
                column: "AnimeId");

            migrationBuilder.CreateIndex(
                name: "IX_LibraryEntries_KitsuUserId",
                table: "AnimeLibraryEntries",
                column: "KitsuUserId");

            migrationBuilder.RenameTable("AnimeLibraryEntries", newName: "LibraryEntries");


            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "a7895c7b-84f2-4d71-87d9-1fd0466cbfe5", null, "Admin", "ADMIN" },
                    { "f01825bf-c061-4b58-ac68-5da685bcb6b5", null, "User", "USER" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameTable(
                name: "LibraryEntries",
                newName: "AnimeLibraryEntries");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "a7895c7b-84f2-4d71-87d9-1fd0466cbfe5");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "f01825bf-c061-4b58-ac68-5da685bcb6b5");

            migrationBuilder.RenameColumn(
                name: "TvRating",
                table: "Animes",
                newName: "Rating");

            migrationBuilder.RenameColumn(
                name: "ReleaseStatus",
                table: "Animes",
                newName: "Status");

            migrationBuilder.RenameColumn(
                name: "EpisodeCount",
                table: "Animes",
                newName: "Episodes");

            migrationBuilder.AlterColumn<DateTime>(
                name: "AirDate",
                table: "Episode",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateOnly),
                oldType: "date",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "StartAirDate",
                table: "Animes",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateOnly),
                oldType: "date",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "EndAirDate",
                table: "Animes",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateOnly),
                oldType: "date",
                oldNullable: true);


            migrationBuilder.RenameColumn(
                name: "WatchStatus",
                table: "AnimeLibraryEntries",
                newName: "Status");

            migrationBuilder.RenameColumn(
                name: "EpisodesWatched",
                table: "AnimeLibraryEntries",
                newName: "EpisodesSeen");

            migrationBuilder.RenameColumn(
                name: "UserRating",
                table: "AnimeLibraryEntries",
                newName: "Rating");

            migrationBuilder.DropForeignKey(
                name: "FK_LibraryEntries_Animes_AnimeId",
                table: "AnimeLibraryEntries");

            migrationBuilder.DropForeignKey(
                name: "FK_LibraryEntries_AspNetUsers_KitsuUserId",
                table: "AnimeLibraryEntries");

            migrationBuilder.DropPrimaryKey(
                name: "PK_LibraryEntries",
                table: "AnimeLibraryEntries");

            migrationBuilder.DropIndex(
                name: "IX_LibraryEntries_AnimeId",
                table: "AnimeLibraryEntries");

            migrationBuilder.DropIndex(
                name: "IX_LibraryEntries_KitsuUserId",
                table: "AnimeLibraryEntries");

            migrationBuilder.AddPrimaryKey(
                name: "PK_AnimeLibraryEntries",
                table: "AnimeLibraryEntries",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_AnimeLibraryEntries_Animes_AnimeId",
                table: "AnimeLibraryEntries",
                column: "AnimeId",
                principalTable: "Animes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_AnimeLibraryEntries_AspNetUsers_KitsuUserId",
                table: "AnimeLibraryEntries",
                column: "KitsuUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.CreateIndex(
                name: "IX_AnimeLibraryEntries_AnimeId",
                table: "AnimeLibraryEntries",
                column: "AnimeId");

            migrationBuilder.CreateIndex(
                name: "IX_AnimeLibraryEntries_KitsuUserId",
                table: "AnimeLibraryEntries",
                column: "KitsuUserId");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "1f11b69d-1324-4233-88b3-a9330c84bd53", null, "Admin", "ADMIN" },
                    { "4f9737cd-d171-48f5-8636-a9bac5ca2271", null, "User", "USER" }
                });
        }
    }
}
