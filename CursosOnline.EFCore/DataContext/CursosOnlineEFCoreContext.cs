using CursosOnline.Modelo;
using Microsoft.EntityFrameworkCore;

namespace CursosOnline.EFCore.DataContext;

public class CursosOnlineEFCoreContext : DbContext
{
    public CursosOnlineEFCoreContext(DbContextOptions<CursosOnlineEFCoreContext> options) : base(options)
    //public CursosOnlineEFCoreContext()
    {
        
    }

    public DbSet<Lesson> Lessons { get; set; }
    public DbSet<Module> Modules { get; set; }
    

    //   protected override void OnConfiguring(DbContextOptionsBuilder options)
    //    => options.UseSqlite($"Data Source=../CursosOnline.EFCore/cursosonline.db");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.
        Entity<Lesson>(
            eb =>
            {
                eb.HasKey(pk => pk.LessonID);
            });
        modelBuilder.
        Entity<Module>(
            eb =>
            {
                eb.HasKey(pk => pk.ModuleID); 
                eb.HasMany(m => m.Lessons)     
                .WithOne()
                .OnDelete(DeleteBehavior.Cascade); // Caso um módulo seja deletado, as aulas também são
            });
    }
}
