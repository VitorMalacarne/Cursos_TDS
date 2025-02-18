import axios from "axios";
import { API_URL } from "../Const";

const add = (course) => {
    const token = localStorage.getItem("authToken");
    
    if (!token) {
        return Promise.reject("Token não encontrado");
    }

    return axios.post(`${API_URL}/api/Wishlist/add`, {
        courseId: course, // ou qualquer outro dado necessário
    }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

const getWishlist = () => {
    const token = localStorage.getItem("authToken");
    
    if (!token) {
        return Promise.reject("Token não encontrado");
    }

    return axios.get(`${API_URL}/api/Wishlist`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }); 
}

const remove = (course) => {
    const token = localStorage.getItem("authToken");
    
    if (!token) {
        return Promise.reject("Token não encontrado");
    }

    return axios.delete(`${API_URL}/api/Wishlist/remove`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        data: {
            courseId: course, // Enviando o JSON com o courseId
        },
    });
}


export default { add, getWishlist, remove };