import axios from "axios";
import { API_URL } from "../Const";

const post = (email, password) => {
    return axios.post(`${API_URL}/api/Auth/login`, {
        Email: email, // Corrigido para 'Email' com inicial maiúscula
        Password: password, // Certifique-se de que 'Password' também está correto
    });
};

export default { post };