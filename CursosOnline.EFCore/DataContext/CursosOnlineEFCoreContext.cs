using CursosOnline.Model;
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
    public DbSet<Enrollment> Enrollments { get; set; }
    public DbSet<Course> Courses { get; set; }
    public DbSet<Student> Students { get; set; }


    // protected override void OnConfiguring(DbContextOptionsBuilder options)
    //  => options.UseSqlite($"Data Source=../CursosOnline.EFCore/cursosonline.db");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Lesson>(eb =>
        {
            eb.HasKey(pk => pk.LessonID);
        });

        modelBuilder.Entity<Module>(eb =>
        {
            eb.HasKey(pk => pk.ModuleID);
            eb.HasMany(m => m.Lessons)
                .WithOne()
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Course>(eb =>
        {
            eb.HasKey(pk => pk.CourseID);
            eb.HasMany(c => c.Modules)
                .WithOne()
                .OnDelete(DeleteBehavior.Cascade); 
            eb.HasMany(c => c.Enrollments)
                .WithOne(e => e.Course)
                .OnDelete(DeleteBehavior.Cascade); 
        });

        modelBuilder.Entity<Student>(eb =>
        {
            eb.HasKey(pk => pk.StudentID); 
            eb.HasMany(s => s.Enrollments)
                .WithOne(e => e.Student)
                .OnDelete(DeleteBehavior.Cascade); 
        });

        modelBuilder.Entity<Enrollment>(eb =>
        {
            eb.HasKey(pk => pk.EnrollmentID); 
            eb.HasOne(e => e.Student)
                .WithMany(s => s.Enrollments)
                .HasForeignKey("StudentID") 
                .OnDelete(DeleteBehavior.Cascade); 
            eb.HasOne(e => e.Course)
                .WithMany(c => c.Enrollments)
                .HasForeignKey("CourseID") 
                .OnDelete(DeleteBehavior.Cascade); 
        });
    }
}
