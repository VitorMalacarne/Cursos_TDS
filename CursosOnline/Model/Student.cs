namespace CursosOnline.Model;
public class Student
{
    public int StudentID { get; set; }
    public string? Name { get; set; }
    public string? Phone { get; set; }
    public string? Email { get; set; }
    public string? Cpf { get; set; }
    public List<Enrollment>? Enrollments { get; set; }

    public Student() 
    {
        Enrollments = new List<Enrollment>();
    }

    public Student(int id, string name, string phone, string email, string cpf)
    {
        StudentID = id;
        Name = name;
        Phone = phone;
        Email = email;
        Cpf = cpf;
        Enrollments = new List<Enrollment>();
    }

    public override string ToString()
    {
        return $"[{StudentID}, {Name}, {Phone}, {Email}, {Cpf}, EnrollmentsCount: {Enrollments?.Count}]";
    }

    public override bool Equals(object? obj)
    {
        if (obj is Student other)
        {
            return other.StudentID == StudentID;
        }
        return false;
    }

    public override int GetHashCode()
    {
        return StudentID.GetHashCode();
    }
}