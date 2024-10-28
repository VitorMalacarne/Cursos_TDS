namespace CursosOnline.Model;

public class Enrollment
{
    public int EnrollmentID { get; set; }
    public Student? Student { get; set; }
    public Course? Course { get; set; }
    public DateTime? EnrollmentDate { get; set; }
    public int? Progress { get; set; }

    public Enrollment() { }

    public Enrollment(int id, Student student, Course course, DateTime enrollmentDate, int progress)
    {
        EnrollmentID = id;
        Student = student;
        Course = course;
        EnrollmentDate = enrollmentDate;
        Progress = progress;
    }

    public override string ToString()
    {
        return $"[{EnrollmentID}, {Student}, {Course}, {EnrollmentDate}, {Progress}]";
    }

    public override bool Equals(object? obj)
    {
        if (obj is Enrollment other)
        {
            return other.EnrollmentID == EnrollmentID;
        }

        return false;
    }

    public override int GetHashCode()
    {
        return EnrollmentID.GetHashCode();
    }
}
