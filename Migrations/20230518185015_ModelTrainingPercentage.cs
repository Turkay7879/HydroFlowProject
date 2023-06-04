using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HydroFlowProject.Migrations
{
    /// <inheritdoc />
    public partial class ModelTrainingPercentage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Training_Percentage",
                table: "Models",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Training_Percentage",
                table: "Models");
        }
    }
}
