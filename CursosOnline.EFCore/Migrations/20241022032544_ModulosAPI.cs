using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CursosOnline.EFCore.Migrations
{
    /// <inheritdoc />
    public partial class ModulosAPI : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ModuloID",
                table: "Aulas",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Modulos",
                columns: table => new
                {
                    ModuloID = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Nome = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Modulos", x => x.ModuloID);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Aulas_ModuloID",
                table: "Aulas",
                column: "ModuloID");

            migrationBuilder.AddForeignKey(
                name: "FK_Aulas_Modulos_ModuloID",
                table: "Aulas",
                column: "ModuloID",
                principalTable: "Modulos",
                principalColumn: "ModuloID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Aulas_Modulos_ModuloID",
                table: "Aulas");

            migrationBuilder.DropTable(
                name: "Modulos");

            migrationBuilder.DropIndex(
                name: "IX_Aulas_ModuloID",
                table: "Aulas");

            migrationBuilder.DropColumn(
                name: "ModuloID",
                table: "Aulas");
        }
    }
}
