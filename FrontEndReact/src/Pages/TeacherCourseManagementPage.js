import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/TeacherCourseManagementPage.css";

function TeacherCourseManagementPage() {
  const [courses, setCourses] = useState([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [editingCourse, setEditingCourse] = useState(null)
  const [showModules, setShowModules] = useState(false)
  const navigate = useNavigate();
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    price: "",
    type: "",
    imageUrl: "",
  })

  const handleCreateCourse = (e) => {
    e.preventDefault()
    if (!newCourse.title || !newCourse.description || !newCourse.price || !newCourse.type || !newCourse.imageUrl) {
      alert("Por favor, preencha todos os campos")
      return
    }
    setCourses([...courses, { ...newCourse, id: Date.now(), modules: [] }])
    setNewCourse({ title: "", description: "", price: "", type: "", imageUrl: "" })
    setShowCreateModal(false)
  }

  const handleDeleteCourse = (course) => {
    setSelectedCourse(course)
    setShowDeleteModal(true)
  }

  const confirmDelete = () => {
    setCourses(courses.filter((course) => course.id !== selectedCourse.id))
    setShowDeleteModal(false)
    setSelectedCourse(null)
  }

  const handleEditCourse = (course) => {
    setEditingCourse({ ...course })
    setShowEditModal(true)
  }

  const handleSaveEdit = () => {
    setCourses(courses.map((course) => (course.id === editingCourse.id ? editingCourse : course)))
    setShowEditModal(false)
    setEditingCourse(null)
  }

  const handleShowModules = (course) => {
    setSelectedCourse(course)
    setShowModules(true)
  }

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
              <tr key={course.id} onClick={() => handleShowModules(course)} className="cm-course-row">
                <td>{course.title}</td>
                <td>{course.description}</td>
                <td>R$ {course.price}</td>
                <td>{course.type}</td>
                <td>
                  <img src={course.imageUrl || "/placeholder.svg"} alt={course.title} className="cm-course-thumbnail" />
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
                      /* Navegação para página de edição */
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
            <p>Tem certeza que deseja excluir o curso "{selectedCourse.title}"? Esta ação não pode ser desfeita.</p>
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
                value={editingCourse.title}
                onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })}
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
              <label>URL da Imagem</label>
              <input
                type="url"
                value={editingCourse.imageUrl}
                onChange={(e) => setEditingCourse({ ...editingCourse, imageUrl: e.target.value })}
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

export default TeacherCourseManagementPage;
