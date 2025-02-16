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
    public class CartController : ControllerBase
    {
        private readonly CartService _cartService;

        public CartController(CartService cartService)
        {
            _cartService = cartService;
        }

        // Método auxiliar para obter o ID do usuário autenticado
        private string GetUserId()
        {
            return User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        }

        // Obter carrinho do usuário autenticado
        [HttpGet]
        public IActionResult GetCart()
        {
            string userId = GetUserId();
            if (string.IsNullOrEmpty(userId))
                return Unauthorized("Usuário não autenticado.");

            var cart = _cartService.GetCartByUserId(userId);
            return Ok(cart);
        }

        // Adicionar um curso ao carrinho (Agora aceita JSON!)
        [HttpPost("add")]
        public IActionResult AddToCart([FromBody] CartRequest request)
        {
            string userId = GetUserId();
            if (string.IsNullOrEmpty(userId))
                return Unauthorized("Usuário não autenticado.");

            bool success = _cartService.AddCourseToCart(userId, request.CourseId);
            return success ? Ok("Curso adicionado ao carrinho.") : BadRequest("Curso já está no carrinho ou não existe.");
        }

        // Remover um curso do carrinho
        [HttpDelete("remove")]
        public IActionResult RemoveFromCart([FromBody] CartRequest request)
        {
            string userId = GetUserId();
            if (string.IsNullOrEmpty(userId))
                return Unauthorized("Usuário não autenticado.");

            bool success = _cartService.RemoveCourseFromCart(userId, request.CourseId);
            return success ? Ok("Curso removido do carrinho.") : NotFound("Curso não encontrado no carrinho.");
        }

        // Esvaziar o carrinho
        [HttpDelete("clear")]
        public IActionResult ClearCart()
        {
            string userId = GetUserId();
            if (string.IsNullOrEmpty(userId))
                return Unauthorized("Usuário não autenticado.");

            _cartService.ClearCart(userId);
            return Ok("Carrinho esvaziado.");
        }

        // Finalizar compra: Move os cursos do carrinho para o histórico de compras
        [HttpPost("checkout")]
        public IActionResult Checkout()
        {
            string userId = GetUserId();
            if (string.IsNullOrEmpty(userId))
                return Unauthorized("Usuário não autenticado.");

            bool success = _cartService.CheckoutCart(userId);
            return success ? Ok("Compra finalizada com sucesso!") : BadRequest("Carrinho vazio.");
        }
    }
}
