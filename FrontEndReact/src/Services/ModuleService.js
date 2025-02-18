import axios from "axios";
import { API_URL } from "../Const";

const getModulesByCourse = (courseId) => {
    return axios.post(`${API_URL}/api/Module/course/${courseId}`);
};

export default { getModulesByCourse };