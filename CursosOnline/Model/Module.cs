namespace CursosOnline.Model;
public class Module
{
    public int ModuleID { get; set; }
    public string? Name { get; set; }
    public List<Lesson>? Lessons { get; set; }
    public Exam? Exam { get; set; } // Adicionando o atributo Exam

    public Module()
    {
        Lessons = new List<Lesson>();
    }

    public Module(int id, string name)
    {
        ModuleID = id;
        Name = name;
        Lessons = new List<Lesson>();
    }

    public override string ToString()
    {
        return $"[ModuleID: {ModuleID}, Name: {Name}, Lessons: {Lessons?.Count}, Exam: {Exam?.Name}]";
    }

    public override bool Equals(object? obj)
    {
        if (obj is Module other)
        {
            return other.ModuleID == ModuleID;
        }
        return false;
    }

    public override int GetHashCode()
    {
        return ModuleID.GetHashCode();
    }
}
