import axios from "axios";
import { API_URL } from "../Const";

const getAll = () => {
    return axios.get(`${API_URL}/api/Course`);
}

const getByStudentId = () => {
    const token = localStorage.getItem("authToken"); // Obtém o token JWT do localStorage
    
    if (!token) {
        return Promise.reject("Token não encontrado");
    }

    return axios.get(`${API_URL}/api/Course/my-courses2`, {
        headers: {
            Authorization: `Bearer ${token}` // Passa o token JWT no cabeçalho Authorization
        }
    });
}

const getById = (id) => {
    const token = localStorage.getItem("authToken"); // Obtém o token JWT do localStorage
    
    if (!token) {
        return Promise.reject("Token não encontrado");
    }

    return axios.get(`${API_URL}/api/Course/${id}`, { // Usa o ID corretamente na URL
        headers: {
            Authorization: `Bearer ${token}` // Passa o token JWT no cabeçalho Authorization
        }
    });
}

export default { getAll, getByStudentId, getById };