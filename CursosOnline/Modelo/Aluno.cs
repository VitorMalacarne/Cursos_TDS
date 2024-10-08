namespace CursosOnline.Modelo;

public class Aluno
{
  private int _id;
  private string _nome;
  private string _telefone;
  private string _email;
  private string _cpf;
  private List<Inscricao> _inscricoes;

  public Aluno() { }

  public Aluno(int id, string nome, string telefone, string email, string cpf)
  {
    _id = id;
    _nome = nome;
    _telefone = telefone;
    _email = email;
    _cpf = cpf;
    _inscricoes = new List<Inscricao>();
  }

  public int Id
  {
    get => _id;
    set => _id = value;
  }

  public string Nome
  {
    get => _nome;
    set => _nome = value;
  }

  public string Telefone
  {
    get => _telefone;
    set => _telefone = value;
  }

  public string Email
  {
    get => _email;
    set => _email = value;
  }

  public string Cpf
  {
    get => _cpf;
    set => _cpf = value;
  }

  public List<Inscricao> Inscricoes
  {
    get => _inscricoes;
    set => _inscricoes = value;
  }
}
