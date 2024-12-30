using CursosOnline.Model;
using Microsoft.EntityFrameworkCore;

namespace CursosOnline.EFCore.DataContext;

public class CursosOnlineEFCoreContext : DbContext
{
    //public CursosOnlineEFCoreContext(DbContextOptions<CursosOnlineEFCoreContext> options) : base(options)
    public CursosOnlineEFCoreContext()
    {

    }

    public DbSet<Course> Courses { get; set; }
    public DbSet<User> Users { get; set; }


    protected override void OnConfiguring(DbContextOptionsBuilder options)
     => options.UseSqlite($"Data Source=../CursosOnline.EFCore/cursosonline.db");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Curso-Instrutor (1:N)
        modelBuilder.Entity<Course>()
            .HasOne(c => c.Instructor)
            .WithMany(u => u.CursosComoInstrutor)
            .HasForeignKey(c => c.InstructorID)
            .OnDelete(DeleteBehavior.Restrict);

        // Curso-Alunos (N:N)
        modelBuilder.Entity<Course>()
            .HasMany(c => c.Students)
            .WithMany(u => u.CursosComprados)
            .UsingEntity<Dictionary<string, object>>(
                "CursoUsuario",
                j => j.HasOne<User>().WithMany().HasForeignKey("UsuarioId"),
                j => j.HasOne<Course>().WithMany().HasForeignKey("CursoId"));
    }
}