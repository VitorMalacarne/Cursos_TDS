import { useEffect, useState } from "react";
import Carousel from "../components/Carousel";
import DropdownMenu from "../components/DropdownMenu";
import UserService from "../Services/UserService";
import CourseService from "../Services/CourseService";
import CourseCard from "../components/CourseCard";
import LessonCard from "../components/LessonCard";
import LessonService from "../Services/LessonService";

function HomePage() {
    const [userName, setUserName] = useState("");
    const [courses, setCourses] = useState([]); // Estado para armazenar os cursos
    const [lessons, setLessons] = useState([]);

    const jwtToken = localStorage.getItem("authToken");

    useEffect(() => {
        if (jwtToken) {
            UserService.getUser()  // Certifique-se de que o método getUser() está implementado corretamente no seu UserService
                .then((response) => {
                    const user = response.data; // O objeto de resposta geralmente está em `data`
                    console.log(user.name);
                    setUserName(user.name); // Atualiza o estado com o nome do usuário
                })
                .catch((error) => {
                    console.error("Erro ao buscar dados do usuário", error);
                });
        }

        CourseService.getAll() // Chame o método getAll() do CourseService
            .then((response) => {
                const fetchedCourses = response.data; // Presume-se que os cursos estão em `data`
                setCourses(fetchedCourses); // Atualiza o estado com a lista de cursos
            })
            .catch((error) => {
                console.error("Erro ao buscar cursos", error);
            });

            console.log("cursin: " + courses.length);

        LessonService.getAll() // Chame o método getAll() do CourseService
            .then((response) => {
                const fetchedLessons = response.data; // Presume-se que os cursos estão em `data`
                setLessons(fetchedLessons); // Atualiza o estado com a lista de cursos
            })
            .catch((error) => {
                console.error("Erro ao buscar cursos", error);
            });

            console.log(lessons.length);
    }, [jwtToken]);

    return (
        <div className="flex justify-center items-center h-screen">
            <h1 className="title-1">{"Bem-vindo(a) de volta, " + userName}</h1>
            <h2 className="title-2">Continue a aprender</h2>
            <Carousel>
                {lessons.length > 0 ? (
                    lessons.map((lesson) => (
                        <LessonCard key={lesson.id} lesson={lesson} />
                    ))
                ) : (
                    <p>Carregando cursos...</p>
                )}</Carousel>
            <h2 className="title-2">Sugestões para você</h2>
            <Carousel>{courses.length > 0 ? (
                courses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                ))
            ) : (
                <p>Carregando cursos...</p>
            )}</Carousel>
            <h2 className="title-2">Cursos populares</h2>
            <Carousel>{courses.length > 0 ? (
                courses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                ))
            ) : (
                <p>Carregando cursos...</p>
            )}</Carousel>
        </div>
    );
}

export default HomePage;