import axios from "axios";
import { API_URL } from "../Const";

const getAll = () => {
    return axios.get(`${API_URL}/api/Lesson`);
}

const getLessonById = (id) => {
    return axios.get(`${API_URL}/api/Lesson/${id}`);
}
 

export default { getAll, getLessonById };