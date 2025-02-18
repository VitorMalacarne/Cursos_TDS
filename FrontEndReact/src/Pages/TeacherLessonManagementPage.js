import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../css/TeacherCourseManagementPage.css";
import LessonService from "../Services/LessonService";

function TeacherLessonManagementPage() {
  const { moduleId } = useParams();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [editingLesson, setEditingLesson] = useState(null);
  const [showModules, setShowModules] = useState(false);
  const [lessons, setLessons] = useState([])
  const navigate = useNavigate();
  const [newLesson, setNewLesson] = useState({
    title: "",
    content: "",
    moduleId: moduleId,
    duration: "",
  });

  useEffect(() => {
    LessonService.getLessonByModule(moduleId)
      .then((response) => {
        setLessons(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar cursos", error);
      });
  }, []);

  const handleDeleteLesson = (course) => {
    setSelectedLesson(course);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedLesson) return;

    try {
      await LessonService.deleteLesson(selectedLesson.id);
      alert("Curso excluído com sucesso!");

      const updatedLessons = await LessonService.getLessonByModule(moduleId);
      setLessons(updatedLessons.data);
    } catch (error) {
      console.error("Erro ao excluir curso:", error.response ? error.response.data : error);
      alert("Erro ao excluir o curso. Tente novamente.");
    }

    setShowDeleteModal(false);
    setSelectedLesson(null);
  };

  const handleEditLesson = (lesson) => {
    setEditingLesson({ ...lesson });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    try {
      console.log("cushade");
      await LessonService.update(editingLesson.id, editingLesson);
      alert("Curso atualizado com sucesso!");
      const updatedLessons = await LessonService.getByModuleId(moduleId);
      setLessons(updatedLessons.data);
    } catch (error) {
      console.error("Erro ao atualizar curso:", error);
      alert("Erro ao atualizar o curso. Tente novamente.");
    }

    setShowEditModal(false);
    setEditingLesson(null);
  };

  const handleCreateLesson = async (e) => {
    e.preventDefault();

    if (
      !newLesson.title ||
      !newLesson.content ||
      !newLesson.moduleId ||
      !newLesson.duration
    ) {
      alert("Por favor, preencha todos os campos");
      return;
    }

    try {
      const lessonData = {
        title: newLesson.title,
        content: newLesson.content,
        moduleId: newLesson.moduleId,
        duration: newLesson.duration,
      };

      await LessonService.createLesson(lessonData);
      alert("Curso criado com sucesso!");

      const updatedLessons = await LessonService.getByModuleId(moduleId);
      setLessons(updatedLessons.data);

      setShowCreateModal(false);
      setNewLesson({ title: "", content: "", moduleId: moduleId, duration: "" });
    } catch (error) {
      console.error("Erro ao criar curso:", error.response ? error.response.data : error);
      alert("Erro ao criar curso. Tente novamente.");
    }
  };

  return (
    <div className="cm-container-1">
      <div className="cm-header">
        <h1>Gerenciamento de Aulas</h1>
        <button className="cm-create-button" onClick={() => setShowCreateModal(true)}>
          Criar Nova Aula
        </button>
      </div>

      {lessons.length === 0 ? (
        <div className="cm-empty-state">
          <h2>Você ainda não possui nenhuma aula.</h2>
          <p>Clique no botão "Criar Nova Aula" para começar.</p>
        </div>
      ) : (
        <table className="cm-courses-table">
          <thead>
            <tr>
              <th>Título</th>
              <th>Contéudo</th>
              <th>Duração</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {lessons.map((lesson) => (
              <tr key={lesson.id} onClick={() => navigate(`/`)} className="cm-course-row">
                <td>{lesson.title}</td>
                <td>{lesson.content}</td>
                <td>{lesson.duration}</td>
                <td onClick={(e) => e.stopPropagation()}>
                  <button className="cm-action-button cm-edit" onClick={() => handleEditLesson(lesson)}>
                    ✎
                  </button>
                  <button className="cm-action-button cm-delete" onClick={() => handleDeleteLesson(lesson)}>
                    🗑
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showCreateModal && (
        <div className="cm-modal-overlay">
          <div className="cm-modal">
            <div className="cm-modal-header">
              <h2>Criar Novo Aula</h2>
              <button className="cm-close-button" onClick={() => setShowCreateModal(false)}>
                ×
              </button>
            </div>
            <form onSubmit={handleCreateLesson}>
              <div className="cm-form-group">
                <label>Nome do Aula</label>
                <input
                  type="text"
                  value={newLesson.title}
                  onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
                />
              </div>
              <div className="cm-form-group">
                <label>Descrição</label>
                <textarea
                  value={newLesson.content}
                  onChange={(e) => setNewLesson({ ...newLesson, content: e.target.value })}
                />
              </div>
              <div className="cm-form-group">
                <label>Duração</label>
                <input
                  type="number"
                  step="0.01"
                  value={newLesson.duration}
                  onChange={(e) => setNewLesson({ ...newLesson, duration: e.target.value })}
                />
              </div>
              <button type="submit" className="cm-create-button">
                Criar Aula
              </button>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="cm-modal-overlay">
          <div className="cm-modal cm-delete-modal">
            <h2>Confirmar exclusão</h2>
            <p>Tem certeza que deseja excluir a aula "{selectedLesson.name}"? Esta ação não pode ser desfeita.</p>
            <div className="cm-modal-actions">
              <button className="cm-cancel-button" onClick={() => setShowDeleteModal(false)}>
                Cancelar
              </button>
              <button className="cm-delete-button" onClick={confirmDelete}>
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && editingLesson && (
        <div className="cm-modal-overlay">
          <div className="cm-modal">
            <div className="cm-modal-header">
              <h2>Editar Aula</h2>
              <button className="cm-close-button" onClick={() => setShowEditModal(false)}>
                ×
              </button>
            </div>
            <div className="cm-form-group">
              <label>Nome do Aula</label>
              <div className="cm-form-group">
                <label>Nome do Aula</label>
                <input
                  type="text"
                  value={editingLesson.title}
                  onChange={(e) => setNewLesson({ ...editingLesson, title: e.target.value })}
                />
              </div>
              <div className="cm-form-group">
                <label>Descrição</label>
                <textarea
                  value={editingLesson.content}
                  onChange={(e) => setNewLesson({ ...editingLesson, content: e.target.value })}
                />
              </div>
              <div className="cm-form-group">
                <label>Duração</label>
                <input
                  type="number"
                  step="0.01"
                  value={editingLesson.duration}
                  onChange={(e) => setNewLesson({ ...editingLesson, duration: e.target.value })}
                />
              </div>
              <button className="cm-create-button" onClick={handleSaveEdit}>
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeacherLessonManagementPage;
