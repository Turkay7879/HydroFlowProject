using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HydroFlowProject.Migrations
{
    /// <inheritdoc />
    public partial class updateCreateDate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Basins",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BasinName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    FlowStationNo = table.Column<string>(type: "nvarchar(15)", maxLength: 15, nullable: false),
                    FlowObservationStationLat = table.Column<double>(type: "float", nullable: false),
                    FlowObservationStationLong = table.Column<double>(type: "float", nullable: false),
                    Field = table.Column<int>(type: "int", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Basins__3214EC071999E5DA", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Models",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Title = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    CreateDate = table.Column<DateTime>(type: "datetime2", rowVersion: true, nullable: true),
                    ModelFile = table.Column<byte[]>(type: "varbinary(max)", nullable: false),
                    ModelPermissionId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Models__3214EC077CF5FEB4", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Roles",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RoleDescription = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    RoleValue = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Roles__3214EC0700EF73EB", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Surname = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    CorporationName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Email = table.Column<string>(type: "varchar(75)", unicode: false, maxLength: 75, nullable: false),
                    Password = table.Column<byte[]>(type: "varbinary(256)", maxLength: 256, nullable: false),
                    PasswordSalt = table.Column<byte[]>(type: "varbinary(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Users__3214EC0751F45BF6", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Basin_Permissions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BasinId = table.Column<int>(type: "int", nullable: false),
                    BasinPermissionType = table.Column<bool>(type: "bit", nullable: true, defaultValueSql: "((0))"),
                    BasinSpecPerm = table.Column<bool>(type: "bit", nullable: true, defaultValueSql: "((0))"),
                    UserSpecPerm = table.Column<bool>(type: "bit", nullable: true, defaultValueSql: "((0))")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Basin_Pe__3214EC07AFBC4161", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Basin_Permissions_BasinId",
                        column: x => x.BasinId,
                        principalTable: "Basins",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Basin_Models",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BasinId = table.Column<int>(type: "int", nullable: false),
                    ModelId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Basin_Mo__3214EC076C7802A9", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Basin_Models_BasinId",
                        column: x => x.BasinId,
                        principalTable: "Basins",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Basin_Models_ModelId",
                        column: x => x.ModelId,
                        principalTable: "Models",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Basin_User_Permissions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BasinId = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    PermUserId = table.Column<int>(type: "int", nullable: true),
                    PermLat = table.Column<bool>(type: "bit", nullable: true, defaultValueSql: "((0))"),
                    PermLong = table.Column<bool>(type: "bit", nullable: true, defaultValueSql: "((0))"),
                    PermStationNo = table.Column<bool>(type: "bit", nullable: true, defaultValueSql: "((0))")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Basin_Us__3214EC079001A356", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Basin_User_Permissions_BasinId",
                        column: x => x.BasinId,
                        principalTable: "Basins",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Basin_User_Permissions_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "User_Models",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    ModelId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__User_Mod__3214EC07E1F8B074", x => x.Id);
                    table.ForeignKey(
                        name: "FK_User_Models_ModelId",
                        column: x => x.ModelId,
                        principalTable: "Models",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_User_Models_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "User_Roles",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    RoleId = table.Column<int>(type: "int", nullable: false),
                    UserRoleDate = table.Column<byte[]>(type: "rowversion", rowVersion: true, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__User_Rol__3214EC0729397F40", x => x.Id);
                    table.ForeignKey(
                        name: "FK_User_Roles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "Roles",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_User_Roles_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "User_UserPermission",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ModelId = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    PermittedUserId = table.Column<int>(type: "int", nullable: false),
                    PermData = table.Column<bool>(type: "bit", nullable: true, defaultValueSql: "((0))"),
                    PermDownload = table.Column<bool>(type: "bit", nullable: true, defaultValueSql: "((0))"),
                    PermSimulation = table.Column<bool>(type: "bit", nullable: true, defaultValueSql: "((0))")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__User_Use__3214EC07FB231915", x => x.Id);
                    table.ForeignKey(
                        name: "FK_User_UserPermission_ModelId",
                        column: x => x.ModelId,
                        principalTable: "Models",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_User_UserPermission_PermittedUserId",
                        column: x => x.PermittedUserId,
                        principalTable: "Users",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_User_UserPermission_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Basin_Models_BasinId",
                table: "Basin_Models",
                column: "BasinId");

            migrationBuilder.CreateIndex(
                name: "IX_Basin_Models_ModelId",
                table: "Basin_Models",
                column: "ModelId");

            migrationBuilder.CreateIndex(
                name: "IX_Basin_Permissions_BasinId",
                table: "Basin_Permissions",
                column: "BasinId");

            migrationBuilder.CreateIndex(
                name: "IX_Basin_User_Permissions_BasinId",
                table: "Basin_User_Permissions",
                column: "BasinId");

            migrationBuilder.CreateIndex(
                name: "IX_Basin_User_Permissions_UserId",
                table: "Basin_User_Permissions",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_User_Models_ModelId",
                table: "User_Models",
                column: "ModelId");

            migrationBuilder.CreateIndex(
                name: "IX_User_Models_UserId",
                table: "User_Models",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_User_Roles_RoleId",
                table: "User_Roles",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "IX_User_Roles_UserId",
                table: "User_Roles",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_User_UserPermission_ModelId",
                table: "User_UserPermission",
                column: "ModelId");

            migrationBuilder.CreateIndex(
                name: "IX_User_UserPermission_PermittedUserId",
                table: "User_UserPermission",
                column: "PermittedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_User_UserPermission_UserId",
                table: "User_UserPermission",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Basin_Models");

            migrationBuilder.DropTable(
                name: "Basin_Permissions");

            migrationBuilder.DropTable(
                name: "Basin_User_Permissions");

            migrationBuilder.DropTable(
                name: "User_Models");

            migrationBuilder.DropTable(
                name: "User_Roles");

            migrationBuilder.DropTable(
                name: "User_UserPermission");

            migrationBuilder.DropTable(
                name: "Basins");

            migrationBuilder.DropTable(
                name: "Roles");

            migrationBuilder.DropTable(
                name: "Models");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
