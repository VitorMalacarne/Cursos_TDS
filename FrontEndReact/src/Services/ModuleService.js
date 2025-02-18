import axios from "axios";
import { API_URL } from "../Const";

const getModulesByCourse = (courseId) => {
    return axios.get(`${API_URL}/api/Module/course/${courseId}`);
};

const getById = (id) => {
    return axios.get(`${API_URL}/api/Module/${id}`);
};

const update = (moduleId, updatedModule) => {
    const token = localStorage.getItem("authToken");

    if (!token) {
        return Promise.reject("Token não encontrado");
    }

    return axios.put(`${API_URL}/api/Module/${moduleId}`, updatedModule, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });
};

const deleteModule = (moduleId) => {
    const token = localStorage.getItem("authToken");

    if (!token) {
        return Promise.reject("Token não encontrado");
    }

    if (!moduleId || typeof moduleId !== "string" || moduleId.length !== 24) {
        console.error("Erro: courseId inválido!", moduleId);
        return Promise.reject("courseId inválido!");
    }

    return axios.delete(`${API_URL}/api/Module/${moduleId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
};

const createModule = (newModule) => {
    const token = localStorage.getItem("authToken");

    if (!token) {
        return Promise.reject("Token não encontrado");
    }

    return axios.post(`${API_URL}/api/Module/${newModule.courseId}`, newModule, {  // Sem `courseId`
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });
};

export default { getModulesByCourse, getById, update, deleteModule, createModule };