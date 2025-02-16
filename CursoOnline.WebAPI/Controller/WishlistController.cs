using Microsoft.AspNetCore.Mvc;
using CursosOnline.Services;
using CursosOnline.Model;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

namespace CursosOnline.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // Exige autenticação para acessar qualquer endpoint
    public class WishlistController : ControllerBase
    {
        private readonly WishlistService _wishlistService;

        public WishlistController(WishlistService wishlistService)
        {
            _wishlistService = wishlistService;
        }

        // Método auxiliar para obter o ID do usuário autenticado
        private string GetUserId()
        {
            return User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        }

        // Obter a lista de desejos do usuário autenticado
        [HttpGet]
        public IActionResult GetWishlist()
        {
            string userId = GetUserId();
            if (string.IsNullOrEmpty(userId))
                return Unauthorized("Usuário não autenticado.");

            var wishlist = _wishlistService.GetWishlistByUserId(userId);
            return Ok(wishlist);
        }

        // Adicionar um curso à lista de desejos (agora recebe JSON!)
        [HttpPost("add")]
        public IActionResult AddToWishlist([FromBody] WishlistRequest request)
        {
            string userId = GetUserId();
            if (string.IsNullOrEmpty(userId))
                return Unauthorized("Usuário não autenticado.");

            bool success = _wishlistService.AddCourseToWishlist(userId, request.CourseId);
            return success ? Ok("Curso adicionado à lista de desejos.") : BadRequest("Curso já está na lista.");
        }

        // Remover um curso da lista de desejos (agora recebe JSON!)
        [HttpDelete("remove")]
        public IActionResult RemoveFromWishlist([FromBody] WishlistRequest request)
        {
            string userId = GetUserId();
            if (string.IsNullOrEmpty(userId))
                return Unauthorized("Usuário não autenticado.");

            bool success = _wishlistService.RemoveCourseFromWishlist(userId, request.CourseId);
            return success ? Ok("Curso removido da lista de desejos.") : NotFound("Curso não encontrado na lista.");
        }

        // Esvaziar a lista de desejos
        [HttpDelete("clear")]
        public IActionResult ClearWishlist()
        {
            string userId = GetUserId();
            if (string.IsNullOrEmpty(userId))
                return Unauthorized("Usuário não autenticado.");

            _wishlistService.ClearWishlist(userId);
            return Ok("Lista de desejos esvaziada.");
        }
    }
}
