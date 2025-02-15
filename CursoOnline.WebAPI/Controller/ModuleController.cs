using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CursosOnline.Services;
using CursosOnline.Model;
using System.Security.Claims;
using System.Collections.Generic;

namespace CursosOnline.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ModuleController : ControllerBase
    {
        private readonly ModuleService _moduleService;

        public ModuleController(ModuleService moduleService)
        {
            _moduleService = moduleService;
        }

        // 1. Buscar todos os módulos de um curso (aberto para todos)
        [HttpGet("course/{courseId}")]
        public ActionResult<List<Module>> GetModulesByCourse(string courseId)
        {
            var modules = _moduleService.GetModulesByCourseId(courseId);
            return Ok(modules);
        }

        // 2. Buscar módulo por ID (aberto para todos)
        [HttpGet("{id}")]
        public ActionResult<Module> GetById(string id)
        {
            var module = _moduleService.GetModuleById(id);
            if (module == null)
            {
                return NotFound("Módulo não encontrado.");
            }
            return Ok(module);
        }

        // 3. Criar um módulo (somente professores podem criar)
        [HttpPost("{courseId}")]
        [Authorize] // Apenas usuários autenticados podem criar módulos
        public ActionResult CreateModule(string courseId, [FromBody] Module module)
        {
            string teacherId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (teacherId == null)
            {
                return Unauthorized("Token inválido.");
            }

            bool success = _moduleService.CreateModule(teacherId, courseId, module);
            if (!success)
            {
                return BadRequest("Erro ao criar módulo. Verifique se você é o professor do curso e se as lições e exame são válidos.");
            }

            return Ok("Módulo criado com sucesso!");
        }

        // 4. Atualizar um módulo (somente o professor do curso pode modificar)
        [HttpPut("{id}")]
        [Authorize]
        public ActionResult UpdateModule(string id, [FromBody] Module updatedModule)
        {
            string teacherId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (teacherId == null)
            {
                return Unauthorized("Token inválido.");
            }

            bool success = _moduleService.UpdateModule(teacherId, id, updatedModule);
            if (!success)
            {
                return BadRequest("Você não tem permissão para atualizar este módulo.");
            }

            return Ok("Módulo atualizado com sucesso!");
        }

        // 5. Excluir um módulo (somente o professor do curso pode excluir)
        [HttpDelete("{id}")]
        [Authorize]
        public ActionResult DeleteModule(string id)
        {
            string teacherId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (teacherId == null)
            {
                return Unauthorized("Token inválido.");
            }

            bool success = _moduleService.DeleteModule(teacherId, id);
            if (!success)
            {
                return BadRequest("Você não tem permissão para excluir este módulo.");
            }

            return Ok("Módulo excluído com sucesso.");
        }
    }
}
