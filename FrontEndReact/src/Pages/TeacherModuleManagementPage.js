import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../css/TeacherCourseManagementPage.css";
import CourseService from "../Services/CourseService";
import ModuleService from "../Services/ModuleService";
import UserService from "../Services/UserService";

function TeacherModuleManagementPage() {
  const [modules, setModules] = useState([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedModule, setSelectedModule] = useState(null)
  const [editingModule, setEditingModule] = useState(null)
  const [showModules, setShowModules] = useState(false)
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [newModule, setNewModule] = useState({
    name: "",
    courseId: courseId,
    lessonsIds: "",
    examId: "",
  })

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const moduleResponse = await ModuleService.getModulesByCourse(courseId);
        setModules(moduleResponse.data);
      } catch (error) {
        console.error("Erro ao buscar modulo:", error);
      }
    };

    fetchModules();
  }, []);

  const handleCreateModule = async (e) => {
    e.preventDefault();

    if (
      !newModule.name
    ) {
      alert("Por favor, preencha todos os campos");
      return;
    }

    try {
      const moduleData = {
        name: newModule.name,
        courseId: courseId,
      };

      await ModuleService.createModule(moduleData);
      alert("Módulo criado com sucesso!");

      const updatedCourses = await ModuleService.getModulesByCourse(courseId);
      setModules(updatedCourses.data);

      // Atualiza a lista de modulos no curso
      // const course = await CourseService.getById(courseId);
      // course.modules.add(moduleData);
      // CourseService.updateCourse(courseId, course);

      setShowCreateModal(false);
      setNewModule({ name: "", courseId: courseId, lessonsIds: "", examId: "" });
    } catch (error) {
      console.error("Erro ao criar modulo:", error.response ? error.response.data : error);
      alert("Erro ao criar modulo. Tente novamente.");
    }
  };

  const handleDeleteModule = (module) => {
    setSelectedModule(module)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (!selectedModule) return;

    try {
      await ModuleService.deleteModule(selectedModule.id);
      alert("Módulo excluído com sucesso!");

      // Atualiza a lista de cursos no estado
      const updatedModules = await ModuleService.getModulesByCourse(courseId);
      setModules(updatedModules.data);
    } catch (error) {
      console.error("Erro ao excluir curso:", error.response ? error.response.data : error);
      alert("Erro ao excluir o curso. Tente novamente.");
    }

    setShowDeleteModal(false);
    setSelectedModule(null);
  };


  const handleEditModule = (module) => {
    setEditingModule({ ...module })
    setShowEditModal(true)
  }

  const handleSaveEdit = async () => {
    if (!editingModule) return;

    try {
      await ModuleService.update(editingModule.id, editingModule);
      alert("Curso atualizado com sucesso!");

      // Atualiza a lista de cursos no estado
      const updatedModules = await ModuleService.getModulesByCourse(courseId);
      setModules(updatedModules.data);
    } catch (error) {
      console.error("Erro ao atualizar curso:", error.response ? error.response.data : error);
      alert("Erro ao atualizar o curso. Tente novamente.");
    }

    setShowEditModal(false);
    setEditingModule(null);
  };

  return (
    <div className="cm-container-1">
      <div className="cm-header">
        <h1>Gerenciamento de Módulos</h1>
        <button className="cm-create-button" onClick={() => setShowCreateModal(true)}>
          Criar Novo Módulo
        </button>
      </div>

      {modules.length === 0 ? (
        <div className="cm-empty-state">
          <h2>Você ainda não possui nenhum módulo.</h2>
          <p>Clique no botão "Criar Novo Módulo" para começar.</p>
        </div>
      ) : (
        <table className="cm-courses-table">
          <thead>
            <tr>
              <th>Id</th>
              <th>Nome</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {modules.map((module) => (
              <tr key={module.id} onClick={() => navigate(`/teacherlessonmanagement/${module.id}`)} className="cm-course-row">
                <td>{module.id}</td>
                <td>{module.name}</td>
                <td onClick={(e) => e.stopPropagation()}>
                  <button className="cm-action-button cm-edit" onClick={() => handleEditModule(module)}>
                    ✎
                  </button>
                  <button className="cm-action-button cm-delete" onClick={() => handleDeleteModule(module)}>
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
              <h2>Criar Novo Módulo</h2>
              <button className="cm-close-button" onClick={() => setShowCreateModal(false)}>
                ×
              </button>
            </div>
            <form onSubmit={handleCreateModule}>
              <div className="cm-form-group">
                <label>Nome do Módulo</label>
                <input
                  type="text"
                  value={newModule.name}
                  onChange={(e) => setNewModule({ ...newModule, name: e.target.value })}
                />
              </div>
              <button type="submit" className="cm-create-button">
                Criar Módulo
              </button>
            </form>
          </div>
        </div>
      )}


      {showDeleteModal && (
        <div className="cm-modal-overlay">
          <div className="cm-modal cm-delete-modal">
            <h2>Confirmar exclusão</h2>
            <p>Tem certeza que deseja excluir o módulo "{selectedModule.title}"? Esta ação não pode ser desfeita.</p>
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

      {showEditModal && editingModule && (
        <div className="cm-modal-overlay">
          <div className="cm-modal">
            <div className="cm-modal-header">
              <h2>Editar Módulo</h2>
              <button className="cm-close-button" onClick={() => setShowEditModal(false)}>
                ×
              </button>
            </div>
            <div className="cm-form-group">
              <label>Nome do Módulo</label>
              <input
                type="text"
                value={editingModule.name}
                onChange={(e) => setEditingModule({ ...editingModule, name: e.target.value })}
              />
            </div>
            <div className="cm-modal-actions">
              <button className="cm-cancel-button" onClick={() => setShowEditModal(false)}>
                Cancelar
              </button>
              <button className="cm-save-button" onClick={handleSaveEdit}>
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TeacherModuleManagementPage;