using CursosOnline.Services;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserService _userService;

    public AuthController(UserService userService)
    {
        _userService = userService;
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest request)//usa hash para autenticar usuário
    {
        string? token = _userService.AuthenticateUser(request.Email, request.Password);
        if (token == null)
        {
            return Unauthorized("Credenciais inválidas.");
        }
        return Ok(new { Token = token });
    }
}

public class LoginRequest
{
    public string Email { get; set; }
    public string Password { get; set; }
}
