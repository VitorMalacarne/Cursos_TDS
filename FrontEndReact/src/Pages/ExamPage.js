import { useState, useEffect } from "react";
import QuestionService from "../Services/QuestionService";

function ExamPage({ exam }) {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    // Limpar as questões e respostas sempre que o exam mudar
    setQuestions([]);
    setAnswers({});

    if (!exam || !exam.questionIds || exam.questionIds.length === 0) return;
    
    const questionIds = exam.questionIds;

    if (questionIds.length === 0) return;

    Promise.all(questionIds.map((id) => QuestionService.getQuestionById(id)))
      .then((responses) => {
        const fetchedQuestions = responses.map((response) => response.data);
        setQuestions(fetchedQuestions);
        console.log(fetchedQuestions);
      })
      .catch((error) => {
        console.error("Erro ao buscar questões do exame", error);
      });
  }, [exam]); // Dependência no 'exam', o que vai disparar esse efeito quando o exame mudar

  const handleMultipleChoice = (questionId, optionId) => {
    setAnswers((prev) => {
      const currentAnswers = prev[questionId] || [];
      const newAnswers = currentAnswers.includes(optionId)
        ? currentAnswers.filter((id) => id !== optionId)
        : [...currentAnswers, optionId];
      return { ...prev, [questionId]: newAnswers };
    });
  };

  const handleSingleChoice = (questionId, optionId) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: [optionId],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Respostas submetidas:", answers);
    // Aqui você pode adicionar a lógica para enviar as respostas para o backend
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="quiz-container">
        <h1 className="exam-title">{exam.name}</h1>
        <div className="quiz-content">
          <form onSubmit={handleSubmit}>
            {questions.map((question, index) => (
              <div key={question.id} className="question-card">
                <div className="question-header">
                  <span className="question-number">Pergunta {index + 1}</span>
                </div>

                <div className="question-text">{question.text}</div>

                <div className="question-options">
                  {question.type === "multiple"
                    ? question.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="option">
                          <input
                            type="checkbox"
                            id={`${question.id}-${optionIndex}`}
                            checked={
                              answers[question.id]?.includes(optionIndex) ||
                              false
                            }
                            onChange={() =>
                              handleMultipleChoice(question.id, optionIndex)
                            }
                          />
                          <label htmlFor={`${question.id}-${optionIndex}`}>
                            {option}
                          </label>
                        </div>
                      ))
                    : question.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="option">
                          <input
                            type="radio"
                            name={`question-${question.id}`}
                            id={`${question.id}-${optionIndex}`}
                            checked={answers[question.id]?.[0] === optionIndex}
                            onChange={() =>
                              handleSingleChoice(question.id, optionIndex)
                            }
                          />
                          <label htmlFor={`${question.id}-${optionIndex}`}>
                            {option}
                          </label>
                        </div>
                      ))}
                </div>
              </div>
            ))}

            <div className="quiz-actions">
              <button type="submit" className="btn-submit">
                Enviar Respostas
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ExamPage;
