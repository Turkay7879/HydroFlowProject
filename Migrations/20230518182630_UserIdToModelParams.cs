using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HydroFlowProject.Migrations
{
    /// <inheritdoc />
    public partial class UserIdToModelParams : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "User_Id",
                table: "ModelParameters",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_ModelParameters_User_Id",
                table: "ModelParameters",
                column: "User_Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ModelParameters_User",
                table: "ModelParameters",
                column: "User_Id",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ModelParameters_User",
                table: "ModelParameters");

            migrationBuilder.DropIndex(
                name: "IX_ModelParameters_User_Id",
                table: "ModelParameters");

            migrationBuilder.DropColumn(
                name: "User_Id",
                table: "ModelParameters");
        }
    }
}
