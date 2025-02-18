import { useState } from "react"
import "../css/TeacherModuleManagementPage.css"

const TeacherModuleManagementPage = () => {
  const [module, setModule] = useState({
    name: "Novo Módulo",
    courseName: "Nome do Curso",
    lessons: [],
    exam: null,
  })
  const [isEditingName, setIsEditingName] = useState(false)
  const [tempModuleName, setTempModuleName] = useState(module.name)
  const [showExamForm, setShowExamForm] = useState(false)
  const [examQuestions, setExamQuestions] = useState([])
  const [showLessonForm, setShowLessonForm] = useState(false)
  const [lessons, setLessons] = useState([])
  const [showConfirmation, setShowConfirmation] = useState(false)

  const handleModuleNameChange = (e) => {
    setTempModuleName(e.target.value)
    setIsEditingName(true)
  }

  const saveModuleName = () => {
    setModule({ ...module, name: tempModuleName })
    setIsEditingName(false)
  }

  const cancelModuleNameEdit = () => {
    setTempModuleName(module.name)
    setIsEditingName(false)
  }

  const addQuestion = () => {
    setExamQuestions([...examQuestions, { question: "", answers: ["", "", "", "", ""], correctAnswer: null }])
  }

  const removeQuestion = (index) => {
    if (examQuestions.length > 1) {
      const updatedQuestions = [...examQuestions]
      updatedQuestions.splice(index, 1)
      setExamQuestions(updatedQuestions)
    }
  }

  const updateQuestion = (index, field, value) => {
    const updatedQuestions = [...examQuestions]
    if (field === "question") {
      updatedQuestions[index].question = value
    } else {
      updatedQuestions[index].answers[field] = value
    }
    setExamQuestions(updatedQuestions)
  }

  const updateCorrectAnswer = (questionIndex, answerIndex) => {
    const updatedQuestions = [...examQuestions]
    updatedQuestions[questionIndex].correctAnswer = answerIndex
    setExamQuestions(updatedQuestions)
  }

  const isExamValid = () => {
    return (
      examQuestions.length > 0 &&
      examQuestions.every(
        (q) => q.question.trim() !== "" && q.answers.every((a) => a.trim() !== "") && q.correctAnswer !== null,
      )
    )
  }

  const saveExam = () => {
    if (isExamValid()) {
      setModule({ ...module, exam: { questions: examQuestions } })
      setShowExamForm(false)
    } else {
      alert(
        "Por favor, adicione pelo menos uma pergunta, preencha todas as perguntas e respostas, e selecione uma resposta correta para cada pergunta.",
      )
    }
  }

  const editExam = () => {
    setExamQuestions([...module.exam.questions])
    setShowExamForm(true)
  }

  const cancelEditExam = () => {
    setShowExamForm(false)
    setExamQuestions([])
  }

  const addLesson = () => {
    setLessons([...lessons, { name: "", content: "" }])
  }

  const removeLesson = (index) => {
    if (lessons.length > 1) {
      const updatedLessons = [...lessons]
      updatedLessons.splice(index, 1)
      setLessons(updatedLessons)
    }
  }

  const updateLesson = (index, field, value) => {
    const updatedLessons = [...lessons]
    updatedLessons[index][field] = value
    setLessons(updatedLessons)
  }

  const saveLessons = () => {
    setModule({ ...module, lessons: lessons })
    setShowLessonForm(false)
  }

  const cancelEditLessons = () => {
    setShowLessonForm(false)
    setLessons([...module.lessons])
  }

  return (
    <div className="mm-module-creation-page">
      <div className="mm-top-bar">
        <button className="mm-back-button">{"<"}</button>
        <h1>Criação de Módulo</h1>
      </div>
      <div className="mm-module-info">
        <div className="mm-module-name-container">
          <input type="text" value={tempModuleName} onChange={handleModuleNameChange} className="mm-module-name-input" />
          {isEditingName && (
            <div className="mm-module-name-actions">
              <button onClick={saveModuleName} className="mm-icon-button mm-save">
                ✓
              </button>
              <button onClick={cancelModuleNameEdit} className="mm-icon-button mm-cancel">
                ✗
              </button>
            </div>
          )}
        </div>
        <p className="mm-course-name">Curso: {module.courseName}</p>
      </div>

      <div className="mm-lessons-section">
        <h2>Aulas</h2>
        {showLessonForm ? (
          <div className="mm-lesson-form">
            {lessons.map((lesson, index) => (
              <div key={index} className="mm-lesson">
                <div className="mm-lesson-header">
                  <input
                    type="text"
                    value={lesson.name}
                    onChange={(e) => updateLesson(index, "name", e.target.value)}
                    placeholder="Nome da Aula"
                    className="mm-lesson-name-input"
                  />
                  {lessons.length > 1 && (
                    <button onClick={() => removeLesson(index)} className="mm-remove-lesson-btn">
                      ✕
                    </button>
                  )}
                </div>
                <textarea
                  value={lesson.content}
                  onChange={(e) => updateLesson(index, "content", e.target.value)}
                  placeholder="Conteúdo da Aula"
                  className="mm-lesson-content-input"
                />
              </div>
            ))}
            <button onClick={addLesson} className="mm-add-lesson-btn">
              Adicionar Aula
            </button>
            <div className="mm-lesson-form-actions">
              <button onClick={saveLessons} className="mm-save-lessons-btn">
                Salvar Aulas
              </button>
              <button onClick={cancelEditLessons} className="mm-cancel-lessons-btn">
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <>
            {module.lessons.length === 0 ? (
              <p>Não há aulas neste módulo.</p>
            ) : (
              <ul>
                {module.lessons.map((lesson, index) => (
                  <li key={index}>{lesson.name}</li>
                ))}
              </ul>
            )}
            <button className="mm-add-lesson-btn" onClick={() => setShowLessonForm(true)}>
              Adicionar Aula
            </button>
          </>
        )}
      </div>

      <div className="mm-exam-section">
        <h2>Exame/Prova</h2>
        {module.exam && !showExamForm ? (
          <div className="mm-exam-summary" onClick={editExam}>
            <h3>Prova criada</h3>
            <p>Total de perguntas: {module.exam.questions.length}</p>
            <p className="mm-edit-exam-hint">Clique para editar a prova</p>
          </div>
        ) : showExamForm ? (
          <div className="mm-exam-form">
            <h3>Editar Prova</h3>
            {examQuestions.map((q, qIndex) => (
              <div key={qIndex} className="mm-question">
                <div className="mm-question-header">
                  <input
                    type="text"
                    value={q.question}
                    onChange={(e) => updateQuestion(qIndex, "question", e.target.value)}
                    placeholder="Pergunta"
                    className="mm-question-input"
                  />
                  {examQuestions.length > 1 && (
                    <button onClick={() => removeQuestion(qIndex)} className="mm-remove-question-btn">
                      ✕
                    </button>
                  )}
                </div>
                {q.answers.map((a, aIndex) => (
                  <div key={aIndex} className="mm-answer-container">
                    <input
                      type="radio"
                      checked={q.correctAnswer === aIndex}
                      onChange={() => updateCorrectAnswer(qIndex, aIndex)}
                      className="mm-answer-radio"
                      name={`question-${qIndex}`}
                    />
                    <input
                      type="text"
                      value={a}
                      onChange={(e) => updateQuestion(qIndex, aIndex, e.target.value)}
                      placeholder={`Alternativa ${aIndex + 1}`}
                      className="mm-answer-input"
                    />
                  </div>
                ))}
              </div>
            ))}
            <button onClick={addQuestion} className="mm-add-question-btn">
              Adicionar Pergunta
            </button>
            <div className="mm-exam-form-actions">
              <button onClick={saveExam} className="mm-save-exam-btn" disabled={!isExamValid()}>
                Salvar Prova
              </button>
              <button onClick={cancelEditExam} className="mm-cancel-exam-btn">
                Voltar
              </button>
            </div>
          </div>
        ) : (
          <button className="mm-add-exam-btn" onClick={() => setShowExamForm(true)}>
            Adicionar Prova
          </button>
        )}
      </div>

      <button className="mm-save-changes-btn" onClick={() => setShowConfirmation(true)}>
        Salvar Alterações
      </button>

      {showConfirmation && (
        <div className="mm-confirmation-popup">
          <p>Deseja realmente salvar as alterações?</p>
          <div className="mm-confirmation-actions">
            <button onClick={() => setShowConfirmation(false)} className="mm-confirm-btn">
              Sim
            </button>
            <button onClick={() => setShowConfirmation(false)} className="mm-cancel-btn">
              Não
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default TeacherModuleManagementPage
