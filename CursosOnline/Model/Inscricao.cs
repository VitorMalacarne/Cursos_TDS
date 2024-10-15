namespace CursosOnline.Modelo;
public class Inscricao
{
  private int _id;
  private Aluno _aluno;
  private Curso _curso;
  private DateTime _dataInscricao;
  private int _progresso;


  public Inscricao() { }

  public Inscricao(int id, Aluno aluno, Curso curso, DateTime dataInscricao, int progresso)
  {
    _id = id;
    _aluno = aluno;
    _curso = curso;
    _dataInscricao = dataInscricao;
    _progresso = progresso;
  }

  public int Id
  {
    get => _id;
    set => _id = value;
  }

  public Aluno Aluno
  {
    get => _aluno;
    set => _aluno = value;
  }

  public Curso Curso
  {
    get => _curso;
    set => _curso = value;
  }

  public DateTime DataInscricao
  {
    get => _dataInscricao;
    set => _dataInscricao = value;
  }

  public int Progresso
  {
    get => _progresso;
    set => _progresso = value;
  }
}