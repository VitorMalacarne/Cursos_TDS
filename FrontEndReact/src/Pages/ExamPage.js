"use client";

import { useState, useEffect } from "react";
import axios from "axios";

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
        const response = await axios.get("/api/exam/data"); // Ajuste a URL conforme necessário
        setExamTitle(response.data.title);
        setQuestions(response.data.questions);
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
            {questions.map((question) => (
              <div key={question.id} className="question-card">
                <div className="question-header">
                  <span className="question-number">
                    Pergunta {question.id}
                  </span>
                  <span className="question-points">
                    Nota: {question.points.toFixed(2)}
                  </span>
                </div>

                <div className="question-text">{question.text}</div>

                {question.image && (
                  <div className="question-image">
                    <img
                      src={question.image || "/placeholder.svg"}
                      alt="Diagrama da questão"
                    />
                  </div>
                )}

                <div className="question-options">
                  {question.type === "multiple"
                    ? question.options.map((option) => (
                        <div key={option.id} className="option">
                          <input
                            type="checkbox"
                            id={`${question.id}-${option.id}`}
                            checked={
                              answers[question.id]?.includes(option.id) || false
                            }
                            onChange={() =>
                              handleMultipleChoice(question.id, option.id)
                            }
                          />
                          <label htmlFor={`${question.id}-${option.id}`}>
                            {option.text}
                          </label>
                        </div>
                      ))
                    : question.options.map((option) => (
                        <div key={option.id} className="option">
                          <input
                            type="radio"
                            name={`question-${question.id}`}
                            id={`${question.id}-${option.id}`}
                            checked={answers[question.id]?.[0] === option.id}
                            onChange={() =>
                              handleSingleChoice(question.id, option.id)
                            }
                          />
                          <label htmlFor={`${question.id}-${option.id}`}>
                            {option.text}
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
