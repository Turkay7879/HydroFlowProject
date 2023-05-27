using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HydroFlowProject.Migrations
{
    /// <inheritdoc />
    public partial class OptPercentInSimDetails : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Training_Percentage",
                table: "Models");

            migrationBuilder.AddColumn<int>(
                name: "Optimization_Percentage",
                table: "Simulation_Details",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Optimization_Percentage",
                table: "Simulation_Details");

            migrationBuilder.AddColumn<int>(
                name: "Training_Percentage",
                table: "Models",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
