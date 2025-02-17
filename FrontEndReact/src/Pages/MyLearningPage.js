import { useEffect, useState } from "react";
import CourseService from "../Services/CourseService";
import CardLearning from "../components/CardLearning";
import EnrollmentService from "../Services/EnrollmentService";
import UserService from "../Services/UserService"; // Importando o UserService

function MyLearningPage() {
    const [enrollments, setEnrollments] = useState([]);
    const [courses, setCourses] = useState([]);
    const [instructors, setInstructors] = useState([]); // Estado para armazenar os instrutores

    useEffect(() => {
        EnrollmentService.getAllEnrollments()
            .then((response) => {
                const fetchedEnrollments = response.data; // Supondo que os dados das inscrições estejam em `data`
                setEnrollments(fetchedEnrollments);

                // Criar um array de promessas para buscar os cursos e instrutores correspondentes
                const coursePromises = fetchedEnrollments.map((enrollment) => {
                    // Primeira promessa para buscar o curso
                    const coursePromise = CourseService.getById(enrollment.courseId)
                        .then((courseResponse) => courseResponse.data)
                        .catch((error) => {
                            console.error(`Erro ao buscar curso com ID ${enrollment.courseId}`, error);
                            return null; // Retorna null se houver erro para evitar quebra
                        });

                    // Segunda promessa para buscar o instrutor usando o instructorId do curso
                    const instructorPromise = coursePromise.then((course) => {
                        if (course) {
                            return UserService.getById(course.instructorId) // Usando instructorId do curso
                                .then((instructorResponse) => instructorResponse.data)
                                .catch((error) => {
                                    console.error(`Erro ao buscar instrutor com ID ${course.instructorId}`, error);
                                    return null; // Retorna null se houver erro para evitar quebra
                                });
                        }
                        return null;
                    });

                    return Promise.all([coursePromise, instructorPromise])
                        .then(([course, instructor]) => ({
                            course,
                            instructor
                        }));
                });

                // Resolver todas as promessas e atualizar o estado
                Promise.all(coursePromises).then((fetchedData) => {
                    // Filtrar e separar cursos e instrutores que não falharam
                    const validData = fetchedData.filter(({ course, instructor }) => course && instructor);
                    setCourses(validData.map((data) => data.course)); // Atualiza os cursos
                    setInstructors(validData.map((data) => data.instructor)); // Atualiza os instrutores
                });
            })
            .catch((error) => {
                console.error("Erro ao buscar inscrições", error);
            });
    }, []);

    return (
        <div className="flex justify-center items-center h-screen">
            <h1 className="title-1">Meu aprendizado</h1>
            <div className="mylearning-container">
                {enrollments.length > 0 ? (
                    enrollments.map((enrollment) => {
                        // Encontrar o curso correspondente ao enrollment
                        const course = courses.find((course) => course.id === enrollment.courseId);
                        // Encontrar o instrutor correspondente ao course
                        const instructor = instructors.find((instructor) => instructor.id === course?.instructorId);

                        return course && instructor ? (
                            <CardLearning
                                key={course.id} // Usar course.id para a chave
                                title={course.name}
                                instructor={instructor.name} // Usando o nome do instrutor
                                progress={enrollment.progress} // Agora o progresso vem do enrollment
                                imageUrl={course.imageUrl}
                            />
                        ) : null; // Caso o curso ou instrutor não sejam encontrados
                    })
                ) : (
                    <p>Você ainda não está em nenhum curso!</p>
                )}
            </div>
        </div>
    );
}

export default MyLearningPage;
