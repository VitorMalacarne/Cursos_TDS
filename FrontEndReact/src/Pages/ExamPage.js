import { useState, useEffect } from "react";
import QuestionService from "../Services/QuestionService";
import ExamService from "../Services/ExamService";

function ExamPage({ exam }) {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);

  useEffect(() => {
    setQuestions([]);
    setAnswers({});
    setScore(exam.grade || 0); // Garante que exam.grade seja um número válido

    if (!exam || !exam.questionIds || exam.questionIds.length === 0) return;

    Promise.all(exam.questionIds.map((id) => QuestionService.getQuestionById(id)))
      .then((responses) => {
        const fetchedQuestions = responses.map((response) => response.data);
        setQuestions(fetchedQuestions);
      })
      .catch((error) => console.error("Erro ao buscar questões do exame", error));
  }, [exam]);

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
    let userScore = 0;

    console.log("Respostas no Submit:", answers);

    questions.forEach((question) => {
      const userAnswer = answers[question.id];
      console.log("Resposta do usuário:", userAnswer);

      // Verifica se a resposta está correta
      if (userAnswer && userAnswer[0] === question.correctAnswerIndex) {
        userScore++;
      }
    });

    const percentageScore = (userScore / questions.length) * 100;

    // Enviar pontuação para o backend
    ExamService.updateExam({ id: exam.id, grade: percentageScore })
      .then(() => console.log("Nota enviada com sucesso!"))
      .catch((error) => console.error("Erro ao atualizar nota", error));

    setScore(percentageScore);
    console.log("Pontuação final em %:", percentageScore);
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
                            checked={answers[question.id]?.includes(optionIndex) || false}
                            onChange={() => handleMultipleChoice(question.id, optionIndex)}
                          />
                          <label htmlFor={`${question.id}-${optionIndex}`}>{option}</label>
                        </div>
                      ))
                    : question.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="option">
                          <input
                            type="radio"
                            name={`question-${question.id}`}
                            id={`${question.id}-${optionIndex}`}
                            checked={answers[question.id]?.[0] === optionIndex}
                            onChange={() => handleSingleChoice(question.id, optionIndex)}
                          />
                          <label htmlFor={`${question.id}-${optionIndex}`}>{option}</label>
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

          {score >= 0 && (
            <div className="score-display">
              <h3>Sua pontuação: {score.toFixed(2)}% </h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ExamPage;
