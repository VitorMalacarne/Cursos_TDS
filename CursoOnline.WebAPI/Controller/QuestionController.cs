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
    public class QuestionController : ControllerBase
    {
        private readonly QuestionService _questionService;

        public QuestionController(QuestionService questionService)
        {
            _questionService = questionService;
        }

        // GET: api/Question/exam/{examId}
        [HttpGet("exam/{examId}")]
        public ActionResult<List<Question>> GetQuestionsByExamId(string examId)
        {
            var questions = _questionService.GetQuestionsByExamId(examId);
            return Ok(questions);
        }

        // GET: api/Question/{id}
        [HttpGet("{id}")]
        public ActionResult<Question> GetQuestionById(string id)
        {
            var question = _questionService.GetQuestionById(id);
            if (question == null)
            {
                return NotFound();
            }
            return Ok(question);
        }

        // 3. Criar uma pergunta (somente professores podem criar)
        [HttpPost("{examId}")]
        [Authorize]
        public ActionResult CreateQuestion(string examId, [FromBody] Question question)
        {
            string teacherId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (teacherId == null)
            {
                return Unauthorized("Token inválido.");
            }

            bool success = _questionService.CreateQuestion(teacherId, examId, question);
            if (!success)
            {
                return BadRequest("Erro ao criar pergunta. Verifique se você é o professor do curso.");
            }

            return Ok("Pergunta criada com sucesso!");
        }

        // 📌 4. Atualizar uma pergunta (somente o professor do curso pode modificar)
        [HttpPut("{id}")]
        [Authorize]
        public ActionResult UpdateQuestion(string id, [FromBody] Question updatedQuestion)
        {
            string teacherId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (teacherId == null)
            {
                return Unauthorized("Token inválido.");
            }

            bool success = _questionService.UpdateQuestion(teacherId, id, updatedQuestion);
            if (!success)
            {
                return BadRequest("Você não tem permissão para atualizar esta pergunta.");
            }

            return Ok("Pergunta atualizada com sucesso!");
        }

        // 📌 5. Excluir uma pergunta (somente o professor do curso pode excluir)
        [HttpDelete("{id}")]
        [Authorize]
        public ActionResult DeleteQuestion(string id)
        {
            string teacherId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (teacherId == null)
            {
                return Unauthorized("Token inválido.");
            }

            bool success = _questionService.DeleteQuestion(teacherId, id);
            if (!success)
            {
                return BadRequest("Você não tem permissão para excluir esta pergunta.");
            }

            return Ok("Pergunta excluída com sucesso.");
        }
    }
}
