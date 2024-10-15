using CursosOnline.Modelo;
using Microsoft.EntityFrameworkCore;

namespace CursosOnline.EFCore.DataContext;

public class CursosOnlineEFCoreContext : DbContext
{
    public CursosOnlineEFCoreContext(DbContextOptions<CursosOnlineEFCoreContext> options) : base(options)
    //public CursosOnlineEFCoreContext()
    {
        
    }

    public DbSet<Aula> Aulas { get; set; }

    // protected override void OnConfiguring(DbContextOptionsBuilder options)
    //  => options.UseSqlite($"Data Source=../CursosOnline.EFCore/cursosonline.db");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.
        Entity<Aula>(
            eb =>
            {
                eb.HasKey(pk => pk.Id);
            });
    }
}
