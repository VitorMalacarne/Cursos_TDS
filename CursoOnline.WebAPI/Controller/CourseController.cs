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
    public class CourseController : ControllerBase
    {
        private readonly CourseService _courseService;

        public CourseController(CourseService courseService)
        {
            _courseService = courseService;
        }

        // 📌 1. Buscar todos os cursos disponíveis (aberto para todos)
        [HttpGet]
        public ActionResult<List<Course>> GetAllCourses()
        {
            var courses = _courseService.GetAllCourses();
            return Ok(courses);
        }

        // 📌 2. Buscar curso por ID (aberto para todos)
        [HttpGet("{id}")]
        public ActionResult<Course> GetById(string id)
        {
            var course = _courseService.GetCourseById(id);
            if (course == null)
            {
                return NotFound("Curso não encontrado.");
            }
            return Ok(course);
        }

        // 📌 3. Criar um curso (somente professores podem criar)
        [HttpPost]
        [Authorize] // Apenas usuários autenticados podem criar cursos
        public ActionResult CreateCourse([FromBody] Course course)
        {
            string teacherId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (teacherId == null)
            {
                return Unauthorized("Token inválido.");
            }

            bool success = _courseService.CreateCourse(teacherId, course);
            if (!success)
            {
                return BadRequest("Apenas professores podem criar cursos.");
            }

            return Ok("Curso criado com sucesso!");
        }

        // 📌 4. Atualizar um curso (somente o professor criador pode modificar)
        [HttpPut("{id}")]
        [Authorize]
        public ActionResult UpdateCourse(string id, [FromBody] Course updatedCourse)
        {
            string teacherId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (teacherId == null)
            {
                return Unauthorized("Token inválido.");
            }

            bool success = _courseService.UpdateCourse(teacherId, id, updatedCourse);
            if (!success)
            {
                return BadRequest("Você não tem permissão para atualizar este curso.");
            }

            return Ok("Curso atualizado com sucesso!");
        }

        // 📌 5. Excluir um curso (somente o professor criador pode excluir)
        [HttpDelete("{id}")]
        [Authorize]
        public ActionResult DeleteCourse(string id)
        {
            string teacherId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (teacherId == null)
            {
                return Unauthorized("Token inválido.");
            }

            bool success = _courseService.DeleteCourse(teacherId, id);
            if (!success)
            {
                return BadRequest("Você não tem permissão para excluir este curso.");
            }

            return Ok("Curso excluído com sucesso.");
        }

        // 📌 6. Buscar cursos criados pelo professor autenticado
        [HttpGet("my-courses")]
        [Authorize]
        public ActionResult<List<Course>> GetMyCourses()
        {
            string teacherId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (teacherId == null)
            {
                return Unauthorized("Token inválido.");
            }

            var courses = _courseService.GetCoursesByTeacherId(teacherId);
            return Ok(courses);
        }
    }
}
