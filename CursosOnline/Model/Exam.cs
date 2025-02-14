namespace CursosOnline.Model;
public class Exam
{
  public int ExamID { get; private set; }
  public string Name { get; private set; }
  public List<Question> Questions { get; private set; }

  public Exam(int id, string name)
  {
    ExamID = id;
    Name = name;
    Questions = new List<Question>();
  }

  public void AddQuestion(Question question)
  {
    Questions.Add(question);
  }

  public int GradeExam(List<int> userAnswers)
  {
    int score = 0;
    for (int i = 0; i < Questions.Count; i++)
    {
      if (Questions[i].CheckAnswer(userAnswers[i]))
      {
        score++;
      }
    }
    return score;
  }
}
