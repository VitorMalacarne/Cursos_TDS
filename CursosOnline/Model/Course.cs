namespace CursosOnline.Model;
public class Course
{
    public int CourseID { get; set; }
    public string? Name { get; set; }
    public List<Module>? Modules { get; set; }
    public List<Enrollment>? Enrollments { get; set; }
    public double? Price { get; set; }
    public string? Type { get; set; }

    public Course() 
    {
        Modules = new List<Module>();
        Enrollments = new List<Enrollment>();
    }

    public Course(int id, string name, double price, string type)
    {
        CourseID = id;
        Name = name;
        Price = price;
        Type = type;
        Modules = new List<Module>();
        Enrollments = new List<Enrollment>();
    }

    public override string ToString()
    {
        return $"[{CourseID}, {Name}, {Price:C}, {Type}, ModulesCount: {Modules?.Count}, EnrollmentsCount: {Enrollments?.Count}]";
    }

    public override bool Equals(object? obj)
    {
        if (obj is Course other)
        {
            return other.CourseID == CourseID;
        }
        return false;
    }

    public override int GetHashCode()
    {
        return CourseID.GetHashCode();
    }
}