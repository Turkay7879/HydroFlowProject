using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HydroFlowProject.Migrations
{
    /// <inheritdoc />
    public partial class UserRoleDateAutoAdd : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UserRoleDate",
                table: "User_Roles");
            migrationBuilder.AddColumn<DateTime>(
                name: "UserRoleDate",
                table: "User_Roles",
                type: "datetime2",
                rowVersion: true,
                defaultValueSql: "CURRENT_TIMESTAMP");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UserRoleDate",
                table: "User_Roles");
            migrationBuilder.AddColumn<byte[]>(
                name: "UserRoleDate",
                table: "User_Roles",
                type: "rowversion",
                rowVersion: true,
                nullable: false,
                defaultValue: Array.Empty<byte>());
        }
    }
}
