import axios from "axios";
import { API_URL } from "../Const";

const getAllEnrollments = () => {
    const token = localStorage.getItem("authToken"); // Obtém o token JWT do localStorage
    
    if (!token) {
        return Promise.reject("Token não encontrado");
    }

    return axios.get(`${API_URL}/api/Enrollment/my-courses`, {
        headers: {
            Authorization: `Bearer ${token}` // Passa o token JWT no cabeçalho Authorization
        }
    });
}


export default { getAllEnrollments };