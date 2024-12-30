namespace CursosOnline.Model;

public class Course
{
    public int CourseID { get; set; }
    public string? Name { get; set; }
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public string? Type { get; set; }

    // Relacionamentos
    public int? InstructorID { get; set; }
    public User? Instructor { get; set; } // Instrutor do curso
    public ICollection<User> Students { get; set; } = new List<User>(); // Alunos matriculados

    public List<Module>? Modules { get; set; } // Lista de módulos do curso
    public List<Enrollment>? Enrollments { get; set; } // Lista de matrículas

    // Construtor padrão
    public Course() { }

    // Construtor com parâmetros essenciais
    public Course(int courseID, string name, decimal price)
    {
        CourseID = courseID;
        Name = name;
        Price = price;
    }

    // Construtor completo
    public Course(int courseID, string name, string description, decimal price, string type, int? instructorID)
    {
        CourseID = courseID;
        Name = name;
        Description = description;
        Price = price;
        Type = type;
        InstructorID = instructorID;
    }

    // ToString para exibição
    public override string ToString()
    {
        return $"CourseID: {CourseID}, Name: {Name}, Price: {Price}, Type: {Type}";
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
