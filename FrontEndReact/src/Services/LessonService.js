import axios from "axios";
import { API_URL } from "../Const";

const getAll = () => {
    return axios.get(`${API_URL}/api/Lesson`);
}

const getLessonById = (id) => {
    return axios.get(`${API_URL}/api/Lesson/${id}`);
}
 
const getLessonByModule = (moduleId) => {
    return axios.get(`${API_URL}/api/Lesson/module/${moduleId}`);
}

const deleteLesson = (lessonId) => {
    const token = localStorage.getItem("authToken");

    if (!token) {
        return Promise.reject("Token não encontrado");
    }

    if (!lessonId || typeof lessonId !== "string" || lessonId.length !== 24) {
        console.error("Erro: courseId inválido!", lessonId);
        return Promise.reject("courseId inválido!");
    }

    return axios.delete(`${API_URL}/api/Lesson/${lessonId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
};

const createLesson = (newLesson) => {
    const token = localStorage.getItem("authToken");

    if (!token) {
        return Promise.reject("Token não encontrado");
    }

    return axios.post(`${API_URL}/api/Lesson`, newLesson, {  // Sem `courseId`
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });
};

const update = (lessonId, updatedLesson) => {
    const token = localStorage.getItem("authToken");

    if (!token) {
        return Promise.reject("Token não encontrado");
    }

    return axios.put(`${API_URL}/api/Lesson/${lessonId}`, updatedLesson, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });
};

export default { getAll, getLessonById, getLessonByModule, deleteLesson, createLesson, update};