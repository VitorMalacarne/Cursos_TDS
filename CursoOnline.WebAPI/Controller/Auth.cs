using CursosOnline.Model;
using Microsoft.AspNetCore.Mvc;
using MongoDbConnection;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly MongoDbService _mongoDbService;
    private readonly JwtService _jwtService;

    public AuthController(MongoDbService mongoDbService, JwtService jwtService)
    {
        _mongoDbService = mongoDbService;
        _jwtService = jwtService;
    }

    [HttpPost]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        // Busca o usuário no banco de dados usando o método genérico FindAsync
        var users = await _mongoDbService.FindAsync<User>("Users", u => u.Email == request.Email);

        // Verifica se o usuário foi encontrado
        var user = users.FirstOrDefault();
        if (user == null)
        {
            return Unauthorized("Credenciais inválidas.");
        }

        // Verifica se a senha fornecida corresponde à senha armazenada (sem hash)
        if (user.Password != request.Password)
        {
            return Unauthorized("Credenciais inválidas.");
        }

        // Gera o token JWT
        var token = _jwtService.GenerateToken(user.Id.ToString(), user.Email);
        return Ok(new { Token = token });
    }
}

public class LoginRequest
{
    public string Email { get; set; }
    public string Password { get; set; }
}