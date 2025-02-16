using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CursosOnline.Services;
using CursosOnline.Model;
using System.Security.Claims;

namespace CursosOnline.Controllers;

[Route("api/[controller]")]
[ApiController]
public class EnrollmentController : ControllerBase
{
    private readonly EnrollmentService _enrollmentService;

    public EnrollmentController(EnrollmentService enrollmentService)
    {
        _enrollmentService = enrollmentService;
    }

    // 1. Matricular um aluno em um curso
    [HttpPost("enroll")]
    [Authorize] // Apenas usuários autenticados podem se matricular
    public ActionResult EnrollStudent([FromBody] EnrollRequest request)
    {
        string userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
        {
            return Unauthorized("Token inválido.");
        }

        bool success = _enrollmentService.EnrollStudent(userId, request.CourseId);
        if (!success)
        {
            return BadRequest("Matrícula inválida. Verifique se o curso existe e se você já está matriculado.");
        }

        return Ok("Matrícula realizada com sucesso!");
    }

    // 2. Buscar todas as matrículas do próprio usuário autenticado
    [HttpGet("my-courses")]
    [Authorize] // Apenas usuários autenticados podem acessar
    public ActionResult<List<Enrollment>> GetMyEnrollments()
    {
        string userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
        {
            return Unauthorized("Token inválido.");
        }

        var enrollments = _enrollmentService.GetEnrollmentsByUserId(userId);
        return Ok(enrollments);
    }

    // 3. Buscar alunos matriculados em um curso (apenas professores)
    [HttpGet("course/{courseId}/students")]
    [Authorize] // Apenas usuários autenticados podem acessar
    public ActionResult<List<Enrollment>> GetEnrollmentsByCourse(string courseId)
    {
        string userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
        {
            return Unauthorized("Token inválido.");
        }

        // Apenas professores podem ver alunos matriculados nos cursos que criaram
        var course = _enrollmentService.GetEnrollmentsByCourseId(courseId);
        if (course == null || course.Count == 0)
        {
            return NotFound("Nenhum aluno encontrado para este curso.");
        }

        return Ok(course);
    }

    // 4. Atualizar progresso do aluno
    [HttpPut("update-progress/{enrollmentId}")]
    [Authorize] // Apenas usuários autenticados podem atualizar progresso
    public ActionResult UpdateProgress(string enrollmentId, [FromBody] UpdateProgressRequest request)
    {
        string userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
        {
            return Unauthorized("Token inválido.");
        }

        var enrollment = _enrollmentService.GetEnrollmentById(enrollmentId);
        if (enrollment == null || enrollment.StudentId != userId)
        {
            return Forbid("Você só pode atualizar seu próprio progresso.");
        }

        bool success = _enrollmentService.UpdateProgress(enrollmentId, request.Progress);
        if (!success)
        {
            return BadRequest("Erro ao atualizar progresso. Verifique se o valor está entre 0 e 100.");
        }

        return Ok("Progresso atualizado com sucesso!");
    }

    // 5. Cancelar matrícula
    [HttpDelete("cancel/{enrollmentId}")]
    [Authorize] // Apenas usuários autenticados podem cancelar matrícula
    public ActionResult CancelEnrollment(string enrollmentId)
    {
        string userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
        {
            return Unauthorized("Token inválido.");
        }

        var enrollment = _enrollmentService.GetEnrollmentById(enrollmentId);
        if (enrollment == null || enrollment.StudentId != userId)
        {
            return Forbid("Você só pode cancelar suas próprias matrículas.");
        }

        bool success = _enrollmentService.CancelEnrollment(enrollmentId);
        if (!success)
        {
            return BadRequest("Erro ao cancelar matrícula.");
        }

        return Ok("Matrícula cancelada com sucesso.");
    }
}

// Classe auxiliar para matrícula
public class EnrollRequest
{
    public string CourseId { get; set; }
}

// Classe auxiliar para atualização de progresso
public class UpdateProgressRequest
{
    public int Progress { get; set; }
}
