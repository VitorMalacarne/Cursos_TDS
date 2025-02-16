using Microsoft.AspNetCore.Mvc;
using CursosOnline.Services;
using System.Security.Claims;

namespace CursosOnline.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PurchaseHistoryController : ControllerBase
    {
        private readonly PurchaseHistoryService _purchaseHistoryService;

        public PurchaseHistoryController(PurchaseHistoryService purchaseHistoryService)
        {
            _purchaseHistoryService = purchaseHistoryService;
        }

        // Obter o histórico de compras do usuário autenticado
        [HttpGet]
        public IActionResult GetPurchaseHistory()
        {
            string userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized("Usuário não autenticado.");

            var history = _purchaseHistoryService.GetPurchaseHistoryByUserId(userId);
            return Ok(history);
        }

        // Adicionar uma compra ao histórico
        [HttpPost("add/{courseId}")]
        public IActionResult AddPurchase(string courseId)
        {
            string userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized("Usuário não autenticado.");

            bool success = _purchaseHistoryService.AddPurchase(userId, courseId);
            return success ? Ok("Curso adicionado ao histórico de compras.") : BadRequest("Curso já foi comprado.");
        }

        // Verificar se o usuário já comprou um curso
        [HttpGet("haspurchased/{courseId}")]
        public IActionResult HasPurchasedCourse(string courseId)
        {
            string userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized("Usuário não autenticado.");

            bool hasPurchased = _purchaseHistoryService.HasPurchasedCourse(userId, courseId);
            return Ok(new { hasPurchased });
        }
    }
}
