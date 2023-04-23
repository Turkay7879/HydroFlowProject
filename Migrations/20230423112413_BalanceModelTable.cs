using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HydroFlowProject.Migrations
{
    /// <inheritdoc />
    public partial class BalanceModelTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "BalanceModelTypes",
                columns: table => new
                {
                    ModelType_Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ModelType_Definition = table.Column<string>(type: "nvarchar(25)", maxLength: 25, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__BalanceModelTypes", x => x.ModelType_Id);
                });

            migrationBuilder.CreateTable(
                name: "ModelParameters",
                columns: table => new
                {
                    Parameter_Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Model_Id = table.Column<int>(type: "int", nullable: false),
                    Model_Param = table.Column<float>(type: "real", nullable: false),
                    Model_Param_Name = table.Column<string>(type: "nvarchar(25)", maxLength: 25, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Model_Parameter", x => x.Parameter_Id);
                    table.ForeignKey(
                        name: "FK_ModelParameters_Model",
                        column: x => x.Model_Id,
                        principalTable: "Models",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ModelModelTypes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Model_Id = table.Column<int>(type: "int", nullable: false),
                    Model_Type_Id = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Model__ModelTypes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ModelModelType_BalanceModelType",
                        column: x => x.Model_Type_Id,
                        principalTable: "BalanceModelTypes",
                        principalColumn: "ModelType_Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ModelModelType_Model",
                        column: x => x.Model_Id,
                        principalTable: "Models",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ModelModelTypes_Model_Id",
                table: "ModelModelTypes",
                column: "Model_Id");

            migrationBuilder.CreateIndex(
                name: "IX_ModelModelTypes_Model_Type_Id",
                table: "ModelModelTypes",
                column: "Model_Type_Id");

            migrationBuilder.CreateIndex(
                name: "IX_ModelParameters_Model_Id",
                table: "ModelParameters",
                column: "Model_Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ModelModelTypes");

            migrationBuilder.DropTable(
                name: "ModelParameters");

            migrationBuilder.DropTable(
                name: "BalanceModelTypes");
        }
    }
}
