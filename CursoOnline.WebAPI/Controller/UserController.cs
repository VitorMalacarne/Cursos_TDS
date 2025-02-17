using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CursosOnline.Services;
using CursosOnline.Model;
using System.Security.Claims;

namespace CursosOnline.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserService _userService;

        public UserController(UserService userService)
        {
            _userService = userService;
        }

        // 📌 1. Buscar informações do próprio usuário autenticado
        [HttpGet("me")]
        [Authorize] // Qualquer usuário autenticado pode acessar
        public ActionResult<User> GetMyProfile()
        {
            string userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                return Unauthorized("Token inválido.");
            }

            var user = _userService.GetUserById(userId);
            if (user == null)
            {
                return NotFound("Usuário não encontrado.");
            }

            return Ok(user);
        }

        [HttpGet("{id}")]
        public ActionResult<Course> GetById(string id)
        {
            var user = _userService.GetUserById(id);
            if (user == null)
            {
                return NotFound("Usuário não encontrado.");
            }
            return Ok(user);
        }

        // 📌 2. Cadastrar novo usuário (Aluno ou Professor)
        [HttpPost("register")]
        public ActionResult Register([FromBody] User user)
        {
            if (user.Role != "Student" && user.Role != "Teacher")
            {
                return BadRequest("O papel do usuário deve ser 'Student' ou 'Teacher'.");
            }

            bool success = _userService.RegisterUser(user);
            if (!success)
            {
                return BadRequest("E-mail já cadastrado.");
            }
            return Ok("Usuário cadastrado com sucesso!");
        }

        // 📌 3. Atualizar informações do próprio usuário
        [HttpPut("update")]
        [Authorize] // Apenas usuários autenticados podem alterar seus dados
        public ActionResult UpdateUser([FromBody] User updatedUser)
        {
            string userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                return Unauthorized("Token inválido.");
            }

            bool success = _userService.UpdateUser(userId, updatedUser);
            if (!success)
            {
                return NotFound("Usuário não encontrado.");
            }
            return Ok("Usuário atualizado com sucesso.");
        }

        // 📌 4. Alterar senha do usuário autenticado
        [HttpPut("update-password")]
        [Authorize] // Apenas usuários autenticados podem alterar sua senha
        public ActionResult UpdatePassword([FromBody] UpdatePasswordRequest request)
        {
            string userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                return Unauthorized("Token inválido.");
            }

            var user = _userService.GetUserById(userId);
            if (user == null || !_userService.VerifyPassword(request.OldPassword, user.PasswordHash))
            {
                return BadRequest("Senha antiga incorreta.");
            }

            user.PasswordHash = _userService.HashPassword(request.NewPassword);
            _userService.UpdateUser(userId, user);

            return Ok("Senha alterada com sucesso.");
        }
    }

    // 📌 Classe auxiliar para alterar senha
    public class UpdatePasswordRequest
    {
        public string OldPassword { get; set; }
        public string NewPassword { get; set; }
    }
}
