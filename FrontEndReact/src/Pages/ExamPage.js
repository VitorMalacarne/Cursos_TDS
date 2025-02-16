"use client";

import { useState, useEffect } from "react";
import ExamService from "../Services/ExamService";
import QuestionService from "../Services/QuestionService";

function ExamPage() {
  const [examTitle, setExamTitle] = useState("");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Função para buscar as questões e o título do exame do banco de dados
    const fetchExamData = async () => {
      try {
        setIsLoading(true);
        const examId = "67b0f7cae33d02b52253ede2"; // Substitua pelo ID do exame real
        const response = await ExamService.getExamById(examId);
        setExamTitle(response.data.name);
        console.log(response.data);

        // Buscar as questões de acordo com o ID do exame
        const questionsResponse = await QuestionService.getQuestionsByExamId(
          examId
        );
        console.log(questionsResponse.data);
        setQuestions(questionsResponse.data);

        setIsLoading(false);
      } catch (error) {
        console.error("Erro ao buscar dados do exame:", error);
        setError(
          "Falha ao carregar o exame. Por favor, tente novamente mais tarde."
        );
        setIsLoading(false);
      }
    };

    fetchExamData();
  }, []);

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

  if (isLoading) {
    return <div className="loading">Carregando exame...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="quiz-container">
        <h1 className="exam-title">{examTitle}</h1>
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
