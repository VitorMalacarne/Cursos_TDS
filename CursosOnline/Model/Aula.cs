namespace CursosOnline.Modelo;

public class Lesson
{
    public int LessonID { get; set; }
    public string? Title { get; set; }
    public string? Content { get; set; }
    public TimeSpan? Duration { get; set; }

    public Lesson() { }

    public Lesson(int id, string title, string content, TimeSpan duration)
    {
        LessonID = id;
        Title = title;
        Content = content;
        Duration = duration;
    }

    public override string ToString()
    {
        return $"[{LessonID}, {Title}, {Content}, {Duration}]";
    }

    public override bool Equals(object? obj)
    {
        if (obj is Lesson other)
        {
            return other.LessonID == LessonID;
        }

        return false;
    }

    public override int GetHashCode()
    {
        return LessonID.GetHashCode();
    }
}