import axios from "axios";
import { API_URL } from "../Const";

const getById = (id) => {
    return axios.get(`${API_URL}/api/User/${id}`)
}

// Função para obter todos os animais
const getAll = () => {
    return axios.get(`${API_URL}/api/User`);
};

// Função para salvar um novo animal
const save = (animal) => {
    return axios.post(`${API_URL}/api/User`, animal);
};

// Função para excluir um animal pelo ID
const delete_ = (id) => {
    return axios.delete(`${API_URL}/api/User/${id}`);
};

// Função para atualizar um animal pelo ID
const update = (id, animal) => {
    return axios.put(`${API_URL}/api/User/${id}`, animal);
};

export default { getAll, save, delete_, update, getById };