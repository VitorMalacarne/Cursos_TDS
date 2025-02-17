import axios from "axios";
import { API_URL } from "../Const";

// Função para obter todos os animais
const getUser = () => {
    const token = localStorage.getItem("authToken"); // Obtém o token JWT do localStorage
    
    if (!token) {
        return Promise.reject("Token não encontrado");
    }

    return axios.get(`${API_URL}/api/User/me`, {
        headers: {
            Authorization: `Bearer ${token}` // Passa o token JWT no cabeçalho Authorization
        }
    });
};

const getById = (id) => {
    const token = localStorage.getItem("authToken"); // Obtém o token JWT do localStorage
    
    if (!token) {
        return Promise.reject("Token não encontrado");
    }

    return axios.get(`${API_URL}/api/User/${id}`, { // Usa o ID corretamente na URL
        headers: {
            Authorization: `Bearer ${token}` // Passa o token JWT no cabeçalho Authorization
        }
    });
}

const update = (user) => {
    const token = localStorage.getItem("authToken"); // Obtém o token JWT
    
    if (!token) {
        return Promise.reject("Token não encontrado");
    }

    return axios.put(`${API_URL}/api/User/update`, user, {
        headers: {
            Authorization: `Bearer ${token}` // Adiciona o token no cabeçalho
        }
    });
};

// Função para salvar um novo animal
const save = (animal) => {
    return axios.post(`${API_URL}/api/User`, animal);
};

// Função para excluir um animal pelo ID
const delete_ = (id) => {
    return axios.delete(`${API_URL}/api/User/${id}`);
};

export default { getUser, save, delete_, update, getById };