using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HydroFlowProject.Migrations
{
    /// <inheritdoc />
    public partial class SimDateRange : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Simulation_Date_Range",
                table: "Simulation_Details",
                type: "nvarchar(25)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Simulation_Date_Range",
                table: "Simulation_Details");
        }
    }
}
