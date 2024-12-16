using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class UpdateAnimeAgain : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "33bd4a5b-5cc9-4d70-8660-26396b8916ad");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "41eeefef-0d27-4606-9f1b-b3b65bf2db12");

            migrationBuilder.DropColumn(
                name: "Genres",
                table: "Animes");

            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "Animes",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<DateTime>(
                name: "EndAirDate",
                table: "Animes",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "EnglishTitle",
                table: "Animes",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "EpisodeLength",
                table: "Animes",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "JapaneseTitle",
                table: "Animes",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "JapaneseTitleRomaji",
                table: "Animes",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Rating",
                table: "Animes",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Season",
                table: "Animes",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "StartAirDate",
                table: "Animes",
                type: "datetime2",
                nullable: true);

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "0470ca54-ef5e-4114-ae11-422c340678de", null, "Admin", "ADMIN" },
                    { "8ee56fc4-c834-499a-a6af-ba8641c34e11", null, "User", "USER" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "0470ca54-ef5e-4114-ae11-422c340678de");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "8ee56fc4-c834-499a-a6af-ba8641c34e11");

            migrationBuilder.DropColumn(
                name: "EndAirDate",
                table: "Animes");

            migrationBuilder.DropColumn(
                name: "EnglishTitle",
                table: "Animes");

            migrationBuilder.DropColumn(
                name: "EpisodeLength",
                table: "Animes");

            migrationBuilder.DropColumn(
                name: "JapaneseTitle",
                table: "Animes");

            migrationBuilder.DropColumn(
                name: "JapaneseTitleRomaji",
                table: "Animes");

            migrationBuilder.DropColumn(
                name: "Rating",
                table: "Animes");

            migrationBuilder.DropColumn(
                name: "Season",
                table: "Animes");

            migrationBuilder.DropColumn(
                name: "StartAirDate",
                table: "Animes");

            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "Animes",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Genres",
                table: "Animes",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "33bd4a5b-5cc9-4d70-8660-26396b8916ad", null, "Admin", "ADMIN" },
                    { "41eeefef-0d27-4606-9f1b-b3b65bf2db12", null, "User", "USER" }
                });
        }
    }
}
