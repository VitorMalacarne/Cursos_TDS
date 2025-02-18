import axios from "axios";
import { API_URL } from "../Const";

const getAll = () => {
    return axios.get(`${API_URL}/api/Course`);
}

const getByInstructorId = () => {
    const token = localStorage.getItem("authToken"); // Obtém o token JWT do localStorage
    
    if (!token) {
        return Promise.reject("Token não encontrado");
    }

    return axios.get(`${API_URL}/api/Course/my-courses`, {
        headers: {
            Authorization: `Bearer ${token}` // Passa o token JWT no cabeçalho Authorization
        }
    });
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
    // const token = localStorage.getItem("authToken"); // Obtém o token JWT do localStorage
    
    // if (!token) {
    //     return Promise.reject("Token não encontrado");
    // }
    return axios.get(`${API_URL}/api/Course/${id}`);
    // return axios.get(`${API_URL}/api/Course/${id}`, { // Usa o ID corretamente na URL
    //     headers: {
    //         Authorization: `Bearer ${token}` // Passa o token JWT no cabeçalho Authorization
    //     }
    // });
}

const createCourse = (newCourse) => {
    const token = localStorage.getItem("authToken");

    if (!token) {
        return Promise.reject("Token não encontrado");
    }

    return axios.post(`${API_URL}/api/Course`, newCourse, {  // Sem `courseId`
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });
};


const deleteCourse = (courseId) => {
    const token = localStorage.getItem("authToken");

    if (!token) {
        return Promise.reject("Token não encontrado");
    }

    if (!courseId || typeof courseId !== "string" || courseId.length !== 24) {
        console.error("Erro: courseId inválido!", courseId);
        return Promise.reject("courseId inválido!");
    }

    return axios.delete(`${API_URL}/api/Course/${courseId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
};

const updateCourse = (courseId, updatedCourse) => {
    const token = localStorage.getItem("authToken");

    if (!token) {
        return Promise.reject("Token não encontrado");
    }

    return axios.put(`${API_URL}/api/Course/${courseId}`, updatedCourse, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });
};

export default { getAll, getByStudentId, getById, getByInstructorId, updateCourse, deleteCourse, createCourse };