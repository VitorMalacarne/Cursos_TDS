namespace CursosOnline.Modelo;

public class Modulo
{
  private int _id;
  private string _nome;
  private List<Aula> _aulas;


  public Modulo() { }

  public Modulo(int id, string nome)
  {
    _id = id;
    _nome = nome;
    _aulas = new List<Aula>();
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

  public List<Aula> Aulas
  {
    get => _aulas;
    set => _aulas = value;
  }
}