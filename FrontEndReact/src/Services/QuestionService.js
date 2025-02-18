import axios from "axios";
import { API_URL } from "../Const";

const getQuestionById = (id) => {
  const token = localStorage.getItem("authToken"); // Obtém o token JWT do localStorage

  if (!token) {
    return Promise.reject("Token não encontrado");
  }

  return axios.get(`${API_URL}/api/Question/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`, // Passa o token JWT no cabeçalho Authorization
    },
  });
};

const getQuestionsByExamId = (examId) => {
  const token = localStorage.getItem("authToken"); // Obtém o token JWT do localStorage

  if (!token) {
    return Promise.reject("Token não encontrado");
  }

  return axios.get(`${API_URL}/api/Question/exam/${examId}`, {
    headers: {
      Authorization: `Bearer ${token}`, // Passa o token JWT no cabeçalho Authorization
    },
  });
};

export default { getQuestionById, getQuestionsByExamId };
