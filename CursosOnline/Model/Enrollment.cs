using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace CursosOnline.Model;

public class Enrollment
{
    public ObjectId Id { get; set; }
    public User? Student { get; set; }
    public Course? Course { get; set; }
    public DateTime? EnrollmentDate { get; set; }
    public int? Progress { get; set; }

    public Enrollment() { }

    public Enrollment(ObjectId id, User student, Course course, DateTime enrollmentDate, int progress)
    {
        Id = id;
        Student = student;
        Course = course;
        EnrollmentDate = enrollmentDate;
        Progress = progress;
    }

    public override string ToString()
    {
        return $"[{Id}, {Student}, {Course}, {EnrollmentDate}, {Progress}]";
    }

    public override bool Equals(object? obj)
    {
        if (obj is Enrollment other)
        {
            return other.Id == Id;
        }

        return false;
    }

    public override int GetHashCode()
    {
        return Id.GetHashCode();
    }
}
