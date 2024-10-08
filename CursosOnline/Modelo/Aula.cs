namespace CursosOnline.Modelo;

public class Aula
{
  private int _id;
  private string _titulo;
  private string _conteudo;
  private TimeSpan _duracao;


  public Aula() { }


  public Aula(int id, string titulo, string conteudo, TimeSpan duracao)
  {
    _id = id;
    _titulo = titulo;
    _conteudo = conteudo;
    _duracao = duracao;
  }

  public int Id
  {
    get => _id;
    set => _id = value;
  }

  public string Titulo
  {
    get => _titulo;
    set => _titulo = value;
  }

  public string Conteudo
  {
    get => _conteudo;
    set => _conteudo = value;
  }

  public TimeSpan Duracao
  {
    get => _duracao;
    set => _duracao = value;
  }
}