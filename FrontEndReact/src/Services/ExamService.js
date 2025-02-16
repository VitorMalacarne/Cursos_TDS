import axios from "axios";
import { API_URL } from "../Const";

const getExamById = (id) => {
  return axios.get(`${API_URL}/api/Exam/${id}`);
};

const getAllExams = () => {
  return axios.get(`${API_URL}/api/Exam`);
};

const createExam = (exam) => {
  const token = localStorage.getItem("authToken"); // Obtém o token JWT do localStorage

  if (!token) {
    return Promise.reject("Token não encontrado");
  }

  return axios.post(`${API_URL}/api/Exam`, exam, {
    headers: {
      Authorization: `Bearer ${token}`, // Passa o token JWT no cabeçalho Authorization
    },
  });
};

const updateExam = (id, exam) => {
  const token = localStorage.getItem("authToken"); // Obtém o token JWT

  if (!token) {
    return Promise.reject("Token não encontrado");
  }

  return axios.put(`${API_URL}/api/Exam/${id}`, exam, {
    headers: {
      Authorization: `Bearer ${token}`, // Adiciona o token no cabeçalho
    },
  });
};

const deleteExam = (id) => {
  const token = localStorage.getItem("authToken"); // Obtém o token JWT

  if (!token) {
    return Promise.reject("Token não encontrado");
  }

  return axios.delete(`${API_URL}/api/Exam/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`, // Adiciona o token no cabeçalho
    },
  });
};

export default { getExamById, getAllExams, createExam, updateExam, deleteExam };
