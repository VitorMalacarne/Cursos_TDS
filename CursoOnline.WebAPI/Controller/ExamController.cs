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
    public class ExamController : ControllerBase
    {
        private readonly ExamService _examService;

        public ExamController(ExamService examService)
        {
            _examService = examService;
        }

        // 1. Buscar exames de um módulo (aberto para todos)
        [HttpGet("module/{moduleId}")]
        public ActionResult<List<Exam>> GetExamsByModule(string moduleId)
        {
            var exams = _examService.GetExamsByModuleId(moduleId);
            return Ok(exams);
        }

        // 2. Buscar um exame por ID (aberto para todos)
        [HttpGet("{id}")]
        public ActionResult<Exam> GetById(string id)
        {
            var exam = _examService.GetExamById(id);
            if (exam == null)
            {
                return NotFound("Exame não encontrado.");
            }
            return Ok(exam);
        }

        // 3. Criar um exame (somente professores podem criar)
        [HttpPost("{moduleId}")]
        [Authorize]
        public ActionResult CreateExam(string moduleId, [FromBody] Exam exam)
        {
            string teacherId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (teacherId == null)
            {
                return Unauthorized("Token inválido.");
            }

            bool success = _examService.CreateExam(teacherId, moduleId, exam);
            if (!success)
            {
                return BadRequest("Erro ao criar exame. Verifique se você é o professor do curso.");
            }

            return Ok("Exame criado com sucesso!");
        }

        // 4. Adicionar uma pergunta ao exame (somente professores)
        [HttpPost("{examId}/add-question")]
        [Authorize]
        public ActionResult AddQuestion(string examId, [FromBody] Question question)
        {
            string teacherId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (teacherId == null)
            {
                return Unauthorized("Token inválido.");
            }

            bool success = _examService.AddQuestionToExam(teacherId, examId, question);
            if (!success)
            {
                return BadRequest("Erro ao adicionar pergunta ao exame.");
            }

            return Ok("Pergunta adicionada com sucesso!");
        }

        // 5. Atualizar um exame (somente o professor do curso pode modificar)
        [HttpPut("{id}")]
        [Authorize]
        public ActionResult UpdateExam(string id, [FromBody] Exam updatedExam)
        {
            string teacherId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (teacherId == null)
            {
                return Unauthorized("Token inválido.");
            }

            bool success = _examService.UpdateExam(teacherId, id, updatedExam);
            if (!success)
            {
                return BadRequest("Você não tem permissão para atualizar este exame.");
            }

            return Ok("Exame atualizado com sucesso!");
        }

        // 6. Excluir um exame (somente o professor do curso pode excluir)
        [HttpDelete("{id}")]
        [Authorize]
        public ActionResult DeleteExam(string id)
        {
            string teacherId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (teacherId == null)
            {
                return Unauthorized("Token inválido.");
            }

            bool success = _examService.DeleteExam(teacherId, id);
            if (!success)
            {
                return BadRequest("Você não tem permissão para excluir este exame.");
            }

            return Ok("Exame excluído com sucesso.");
        }

        // 7. Submeter respostas a um exame (somente alunos)
        [HttpPost("submit/{examId}")]
        [Authorize]
        public ActionResult SubmitExam(string examId, [FromBody] List<int> userAnswers)
        {
            string studentId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (studentId == null)
            {
                return Unauthorized("Token inválido.");
            }

            int score = _examService.GradeExam(studentId, examId, userAnswers);
            if (score == -1)
            {
                return BadRequest("Erro ao submeter exame. Verifique se o exame existe e contém perguntas.");
            }

            return Ok(new { Score = score });
        }
    }
}
