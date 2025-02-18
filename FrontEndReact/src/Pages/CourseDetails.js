import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom"; // Adicionar useLocation
import "../css/CourseDetails.css";
import CourseService from "../Services/CourseService";
import UserService from "../Services/UserService";
import EnrollmentService from "../Services/EnrollmentService";
import ModuleService from "../Services/ModuleService";
import CartService from "../Services/CartService";

function CourseDetails() {
  const [course, setCourse] = useState({});
  const [instructor, setInstructor] = useState({});
  const [numStudents, setNumStudentes] = useState(0);
  const [modules, setModules] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); // Captura a URL da página atual
  const authToken = localStorage.getItem('authToken');

  useEffect(() => {
    if (!id) return;

    CourseService.getById(id)
      .then((response) => {
        const fetchedCourse = response.data;
        setCourse(fetchedCourse);
      })
      .catch((error) => {
        console.error("Erro ao buscar curso", error);
      });
  }, [id]);

  useEffect(() => {
    if (!course?.instructorId) return;

    UserService.getById(course.instructorId)
      .then((response) => {
        setInstructor(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar instrutor", error);
      });

    EnrollmentService.getNumStudentsByCourse(course.id)
      .then((response) => {
        setNumStudentes(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar número de alunos", error);
      });

    ModuleService.getModulesByCourse(course.id)
      .then((response) => {
        setModules(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar módulos", error);
      });
  }, [course]);

  const formatToReal = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getTotalLessons = () => {
    return modules.reduce((total, module) => total + (module.lessonsIds ? module.lessonsIds.length : 0), 0);
  };

  const handleAddToCart = () => {
    if (!authToken) {
      // Armazenar a URL atual para redirecionar após o login
      localStorage.setItem('redirectAfterLogin', location.pathname);
      navigate("/login"); // Redireciona para a página de login
      return;
    }
  
    CartService.add(course.id);
  
    // Exemplo de um alerta mais estilizado com texto
    alert(`🎉 ${course.name} foi adicionado ao seu carrinho! 🚀`);
  };
  

  return (
    <div className="cd-course-details">
      <main className="cd-course-content">
        <section className="cd-course-hero">
          <div className="cd-hero-content">
            <h1>{course.name}</h1>
            <p className="cd-course-tagline">{course.description}</p>
            <div className="cd-course-meta">
              <span className="cd-instructor">Criado por {instructor.name} • {numStudents} alunos</span>
            </div>
          </div>
        </section>

        <div className="cd-course-details-grid">
          <section className="cd-course-main">
            <div className="cd-what-you-will-learn">
              <h2>O que você aprenderá</h2>
              <ul>
                {course.topics && course.topics.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="cd-course-content-section">
              <h2>Conteúdo do curso</h2>
              <ul className="cd-content-list">
                {modules.map((module, index) => (
                  <li key={index} className="cd-content-item">
                    <div className="cd-content-header">
                      <h3>{module.name}</h3>
                      <span className="cd-content-meta">
                        {module.lessonsIds?.length} aulas
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <aside className="cd-course-sidebar">
            <div className="cd-course-card">
              <img src={course.imageUrl} alt={course.name} className="cd-course-image" />
              <div className="cd-card-content">
                <div className="cd-price">{formatToReal(course.price)}</div>
                <button className="cd-btn-primary" onClick={handleAddToCart}>Adicionar ao carrinho</button>
                <div className="cd-course-includes">
                  <h3>Este curso inclui:</h3>
                  <ul>
                    <li>{modules.length} módulos</li>
                    <li>{getTotalLessons()} aulas</li>
                    <li>{modules.length} exames</li>
                    <li>Acesso vitalício</li>
                    <li>Certificado de conclusão</li>
                  </ul>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default CourseDetails;
