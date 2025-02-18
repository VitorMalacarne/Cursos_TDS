import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/TeacherCourseManagementPage.css";
import CourseService from "../Services/CourseService";
import UserService from "../Services/UserService";
import ModuleService from "../Services/ModuleService";

function TeacherCourseManagementPage() {
  const [courses, setCourses] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [editingCourse, setEditingCourse] = useState(null);
  const [showModules, setShowModules] = useState(false);
  const navigate = useNavigate();
  const [newCourse, setNewCourse] = useState({
    name: "",
    description: "",
    price: "",
    type: "",
    imageUrl: "",
  });

  useEffect(() => {
    CourseService.getByInstructorId()
      .then((response) => {
        setCourses(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar cursos", error);
      });
  }, []);

  const handleDeleteCourse = (course) => {
    setSelectedCourse(course);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedCourse) return;

    try {
      await CourseService.deleteCourse(selectedCourse.id);
      alert("Curso excluído com sucesso!");

      const updatedCourses = await CourseService.getByInstructorId();
      setCourses(updatedCourses.data);
    } catch (error) {
      console.error("Erro ao excluir curso:", error.response ? error.response.data : error);
      alert("Erro ao excluir o curso. Tente novamente.");
    }

    setShowDeleteModal(false);
    setSelectedCourse(null);
  };

  const handleEditCourse = (course) => {
    setEditingCourse({
      ...course,
      topics: [...course.topics], // Garantindo que os tópicos sejam copiados corretamente
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    try {
      console.log("cushade");
      await CourseService.updateCourse(editingCourse.id, editingCourse);
      alert("Curso atualizado com sucesso!");
      const updatedCourses = await CourseService.getByInstructorId();
      setCourses(updatedCourses.data);
    } catch (error) {
      console.error("Erro ao atualizar curso:", error);
      alert("Erro ao atualizar o curso. Tente novamente.");
    }

    setShowEditModal(false);
    setEditingCourse(null);
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();

    if (
      !newCourse.title ||
      !newCourse.description ||
      !newCourse.price ||
      !newCourse.type ||
      !newCourse.imageUrl ||
      !newCourse.topic1 ||
      !newCourse.topic2 ||
      !newCourse.topic3
    ) {
      alert("Por favor, preencha todos os campos");
      return;
    }

    try {
      const userResponse = await UserService.getUser();
      const userData = userResponse.data;

      if (!userData || !userData.id) {
        alert("Erro: Não foi possível identificar o usuário.");
        return;
      }

      const courseData = {
        name: newCourse.title,
        description: newCourse.description,
        price: parseFloat(newCourse.price),
        type: newCourse.type,
        instructorId: userData.id,
        topics: [newCourse.topic1, newCourse.topic2, newCourse.topic3],
        imageUrl: newCourse.imageUrl,
      };

      await CourseService.createCourse(courseData);
      alert("Curso criado com sucesso!");

      const updatedCourses = await CourseService.getByInstructorId();
      setCourses(updatedCourses.data);

      setShowCreateModal(false);
      setNewCourse({ title: "", description: "", price: "", type: "", topic1: "", topic2: "", topic3: "", imageUrl: "" });
    } catch (error) {
      console.error("Erro ao criar curso:", error.response ? error.response.data : error);
      alert("Erro ao criar curso. Tente novamente.");
    }
  };

  const handleShowModules = async (course) => {
    try {
      const response = await ModuleService.getModulesByCourse(course.id);
      setSelectedCourse({ ...course, modules: response.data });
      setShowModules(true);
    } catch (error) {
      console.error("Erro ao buscar módulos do curso:", error);
    }
  };

  return (
    <div className="cm-container-1">
      <div className="cm-header">
        <h1>Gerenciamento de Cursos</h1>
        <button className="cm-create-button" onClick={() => setShowCreateModal(true)}>
          Criar Novo Curso
        </button>
      </div>

      {courses.length === 0 ? (
        <div className="cm-empty-state">
          <h2>Você ainda não possui nenhum curso.</h2>
          <p>Clique no botão "Criar Novo Curso" para começar.</p>
        </div>
      ) : (
        <table className="cm-courses-table">
          <thead>
            <tr>
              <th>Id</th>
              <th>Título</th>
              <th>Descrição</th>
              <th>Preço</th>
              <th>Tipo</th>
              <th>Imagem</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id} onClick={() => navigate(`/teachermodulemanagement/${course.id}`)} className="cm-course-row">
                <td>{course.id}</td>
                <td>{course.name}</td>
                <td>{course.description}</td>
                <td>R$ {course.price}</td>
                <td>{course.type}</td>
                <td>
                  <img src={course.imageUrl || "/placeholder.svg"} alt={course.name} className="cm-course-thumbnail" />
                </td>
                <td onClick={(e) => e.stopPropagation()}>
                  <button className="cm-action-button cm-edit" onClick={() => handleEditCourse(course)}>
                    ✎
                  </button>
                  <button className="cm-action-button cm-delete" onClick={() => handleDeleteCourse(course)}>
                    🗑
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showModules && selectedCourse && (
        <div className="cm-modules-section">
          <div className="cm-modules-header">
            <h2>Módulos do Curso: {selectedCourse.title}</h2>
            <button className="cm-close-button" onClick={() => setShowModules(false)}>
              Cancelar
            </button>
          </div>
          <div className="cm-modules-content">
            {selectedCourse.modules && selectedCourse.modules.length > 0 ? (
              <ul className="cm-modules-list">
                {selectedCourse.modules.map((module, index) => (
                  <li
                    key={index}
                    className="cm-module-item"
                    onClick={() => {
                      navigate(`/teachermodulemanagement/${ selectedCourse.id }/${ module.id }`);
                    }}
                  >
                    {module.name}
                  </li>

                ))}
              </ul>
            ) : (
              <p className="cm-no-modules">Nenhum módulo cadastrado</p>
            )}
            <button
              className="cm-add-module-button"
              onClick={() => {
                navigate("/teachermodulemanagement");
              }}
            >
              Adicionar Novo Módulo
            </button>
          </div>
        </div>
      )}

      {showCreateModal && (
        <div className="cm-modal-overlay">
          <div className="cm-modal">
            <div className="cm-modal-header">
              <h2>Criar Novo Curso</h2>
              <button className="cm-close-button" onClick={() => setShowCreateModal(false)}>
                ×
              </button>
            </div>
            <form onSubmit={handleCreateCourse}>
              <div className="cm-form-group">
                <label>Nome do Curso</label>
                <input
                  type="text"
                  value={newCourse.title}
                  onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                />
              </div>
              <div className="cm-form-group">
                <label>Descrição</label>
                <textarea
                  value={newCourse.description}
                  onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                />
              </div>
              <div className="cm-form-group">
                <label>Preço</label>
                <input
                  type="number"
                  step="0.01"
                  value={newCourse.price}
                  onChange={(e) => setNewCourse({ ...newCourse, price: e.target.value })}
                />
              </div>
              <div className="cm-form-group">
                <label>Tipo</label>
                <select value={newCourse.type} onChange={(e) => setNewCourse({ ...newCourse, type: e.target.value })}>
                  <option value="">Selecione o tipo do curso</option>
                  <option value="online">Online</option>
                  <option value="presencial">Presencial</option>
                  <option value="misto">Misto</option>
                </select>
              </div>
              <div className="cm-form-group">
                <label>URL da Imagem</label>
                <input
                  type="url"
                  value={newCourse.imageUrl}
                  onChange={(e) => setNewCourse({ ...newCourse, imageUrl: e.target.value })}
                />
              </div>
              {/* Novos campos para os três tópicos */}
              <div className="cm-form-group">
                <label>Tópico 1</label>
                <input
                  type="text"
                  value={newCourse.topic1}
                  onChange={(e) => setNewCourse({ ...newCourse, topic1: e.target.value })}
                />
              </div>
              <div className="cm-form-group">
                <label>Tópico 2</label>
                <input
                  type="text"
                  value={newCourse.topic2}
                  onChange={(e) => setNewCourse({ ...newCourse, topic2: e.target.value })}
                />
              </div>
              <div className="cm-form-group">
                <label>Tópico 3</label>
                <input
                  type="text"
                  value={newCourse.topic3}
                  onChange={(e) => setNewCourse({ ...newCourse, topic3: e.target.value })}
                />
              </div>
              <button type="submit" className="cm-create-button">
                Criar Curso
              </button>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="cm-modal-overlay">
          <div className="cm-modal cm-delete-modal">
            <h2>Confirmar exclusão</h2>
            <p>Tem certeza que deseja excluir o curso "{selectedCourse.name}"? Esta ação não pode ser desfeita.</p>
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

      {showEditModal && editingCourse && (
        <div className="cm-modal-overlay">
          <div className="cm-modal">
            <div className="cm-modal-header">
              <h2>Editar Curso</h2>
              <button className="cm-close-button" onClick={() => setShowEditModal(false)}>
                ×
              </button>
            </div>
            <div className="cm-form-group">
              <label>Nome do Curso</label>
              <input
                type="text"
                value={editingCourse.name}
                onChange={(e) => setEditingCourse({ ...editingCourse, name: e.target.value })}
              />
            </div>
            <div className="cm-form-group">
              <label>Descrição</label>
              <textarea
                value={editingCourse.description}
                onChange={(e) => setEditingCourse({ ...editingCourse, description: e.target.value })}
              />
            </div>
            <div className="cm-form-group">
              <label>Preço</label>
              <input
                type="number"
                step="0.01"
                value={editingCourse.price}
                onChange={(e) => setEditingCourse({ ...editingCourse, price: e.target.value })}
              />
            </div>
            <div className="cm-form-group">
              <label>Tipo</label>
              <select
                value={editingCourse.type}
                onChange={(e) => setEditingCourse({ ...editingCourse, type: e.target.value })}
              >
                <option value="">Selecione o tipo do curso</option>
                <option value="online">Online</option>
                <option value="presencial">Presencial</option>
                <option value="misto">Misto</option>
              </select>
            </div>
            <div className="cm-form-group">
              <label>Imagem</label>
              <input
                type="url"
                value={editingCourse.imageUrl}
                onChange={(e) => setEditingCourse({ ...editingCourse, imageUrl: e.target.value })}
              />
            </div>

            {/* Campos para editar tópicos */}
            <div className="cm-form-group">
              <label>Tópico 1</label>
              <input
                type="text"
                value={editingCourse.topics[0]}
                onChange={(e) => setEditingCourse({
                  ...editingCourse,
                  topics: [
                    e.target.value,
                    editingCourse.topics[1],
                    editingCourse.topics[2]
                  ]
                })}
              />
            </div>
            <div className="cm-form-group">
              <label>Tópico 2</label>
              <input
                type="text"
                value={editingCourse.topics[1]}
                onChange={(e) => setEditingCourse({
                  ...editingCourse,
                  topics: [
                    editingCourse.topics[0],
                    e.target.value,
                    editingCourse.topics[2]
                  ]
                })}
              />
            </div>
            <div className="cm-form-group">
              <label>Tópico 3</label>
              <input
                type="text"
                value={editingCourse.topics[2]}
                onChange={(e) => setEditingCourse({
                  ...editingCourse,
                  topics: [
                    editingCourse.topics[0],
                    editingCourse.topics[1],
                    e.target.value
                  ]
                })}
              />
            </div>

            <button className="cm-create-button" onClick={handleSaveEdit}>
              Salvar Alterações
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeacherCourseManagementPage;
