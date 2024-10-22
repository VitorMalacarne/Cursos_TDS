namespace CursosOnline.Modelo;
public class Curso
{
  private int _id;
  private string _nome;
  private List<Module> _modulos;
  private List<Inscricao> _inscricoes;
  private decimal _preco;
  private string _tipo;

  public Curso() { }

  public Curso(int id, string nome, decimal preco, string tipo)
  {
    _id = id;
    _nome = nome;
    _preco = preco;
    _tipo = tipo;
    _modulos = new List<Module>();
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

  public List<Module> Modulos
  {
    get => _modulos;
    set => _modulos = value;
  }

  public List<Inscricao> Inscricoes
  {
    get => _inscricoes;
    set => _inscricoes = value;
  }

  public decimal Preco
  {
    get => _preco;
    set => _preco = value;
  }

  public string Tipo
  {
    get => _tipo;
    set => _tipo = value;
  }
}
