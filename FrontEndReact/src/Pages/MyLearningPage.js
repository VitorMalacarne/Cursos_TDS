import { useEffect, useState } from "react";
import CourseService from "../Services/CourseService";
import CourseCard from "../components/CourseCard";

function MyLearningPage() {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        CourseService.getByStudentId() // Chame o método getAll() do CourseService
            .then((response) => {
                const fetchedCourses = response.data; // Presume-se que os cursos estão em `data`
                setCourses(fetchedCourses); // Atualiza o estado com a lista de cursos
            })
            .catch((error) => {
                console.error("Erro ao buscar cursos", error);
            });
    }, []);

    return (
        <div className="flex justify-center items-center h-screen">
            <h1 className="title-1">Meu aprendizado</h1>
            <div className="mylearning-container">
                {courses.length > 0 ? (
                    courses.map((course) => (
                        <CourseCard key={course.id} course={course} />
                    ))
                ) : (
                    <p>Você ainda não está em nenhum curso!</p>
                )}
            </div>
        </div>
    );
}

export default MyLearningPage;