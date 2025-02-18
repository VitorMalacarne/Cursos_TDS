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
    public class LessonController : ControllerBase
    {
        private readonly LessonService _lessonService;

        public LessonController(LessonService lessonService)
        {
            _lessonService = lessonService;
        }

        [HttpGet]
        public ActionResult<List<Lesson>> GetAllLessons()
        {
            var courses = _lessonService.GetAllLessons();
            return Ok(courses);
        }

        // 1. Buscar todas as lições de um módulo (aberto para todos)
        [HttpGet("module/{moduleId}")]
        public ActionResult<List<Lesson>> GetLessonsByModule(string moduleId)
        {
            var lessons = _lessonService.GetLessonsByModuleId(moduleId);
            return Ok(lessons);
        }

        // 2. Buscar uma lição por ID (aberto para todos)
        [HttpGet("{id}")]
        public ActionResult<Lesson> GetById(string id)
        {
            var lesson = _lessonService.GetLessonById(id);
            if (lesson == null)
            {
                return NotFound("Lição não encontrada.");
            }
            return Ok(lesson);
        }

        // 3. Criar uma lição (somente professores podem criar)
        [HttpPost("{moduleId}")]
        [Authorize] // Apenas usuários autenticados podem criar lições
        public ActionResult CreateLesson(string moduleId, [FromBody] Lesson lesson)
        {
            string teacherId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (teacherId == null)
            {
                return Unauthorized("Token inválido.");
            }

            bool success = _lessonService.CreateLesson(teacherId, moduleId, lesson);
            if (!success)
            {
                return BadRequest("Erro ao criar lição. Verifique se você é o professor do curso.");
            }

            return Ok("Lição criada com sucesso!");
        }

        // 4. Atualizar uma lição (somente o professor do curso pode modificar)
        [HttpPut("{id}")]
        [Authorize]
        public ActionResult UpdateLesson(string id, [FromBody] Lesson updatedLesson)
        {
            string teacherId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (teacherId == null)
            {
                return Unauthorized("Token inválido.");
            }

            bool success = _lessonService.UpdateLesson(teacherId, id, updatedLesson);
            if (!success)
            {
                return BadRequest("Você não tem permissão para atualizar esta lição.");
            }

            return Ok("Lição atualizada com sucesso!");
        }

        // 5. Excluir uma lição (somente o professor do curso pode excluir)
        [HttpDelete("{id}")]
        [Authorize]
        public ActionResult DeleteLesson(string id)
        {
            string teacherId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (teacherId == null)
            {
                return Unauthorized("Token inválido.");
            }

            bool success = _lessonService.DeleteLesson(teacherId, id);
            if (!success)
            {
                return BadRequest("Você não tem permissão para excluir esta lição.");
            }

            return Ok("Lição excluída com sucesso.");
        }
    }
}
