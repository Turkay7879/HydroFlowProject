using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HydroFlowProject.Migrations
{
    /// <inheritdoc />
    public partial class ModelDateHasDefaultVar : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreateDate",
                table: "Models");
            migrationBuilder.AddColumn<DateTime>(
                name: "CreateDate",
                table: "Models",
                type: "datetime2",
                rowVersion: true,
                defaultValueSql: "CURRENT_TIMESTAMP");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreateDate",
                table: "Models");
            migrationBuilder.AddColumn<byte[]>(
                name: "CreateDate",
                table: "Models",
                type: "rowversion",
                rowVersion: true,
                nullable: false,
                defaultValue: new byte[0]);
        }
    }
}
