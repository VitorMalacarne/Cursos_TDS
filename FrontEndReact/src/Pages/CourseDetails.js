import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../css/CourseDetails.css"
import CourseService from "../Services/CourseService";
import UserService from "../Services/UserService";
import EnrollmentService from "../Services/EnrollmentService";
import ModuleService from "../Services/ModuleService";

const courseData = {
  title: "Masterclass de Programação Fullstack",
  instructor: "João Silva",
  rating: 4.8,
  students: 2345,
  lastUpdated: "Maio 2023",
  description:
    "Aprenda a desenvolver aplicações web completas, do backend ao frontend, utilizando as tecnologias mais modernas do mercado.",
  whatYouWillLearn: [
    "Desenvolver APIs RESTful com Node.js e Express",
    "Criar interfaces responsivas com React e Styled Components",
    "Trabalhar com bancos de dados SQL e NoSQL",
    "Implementar autenticação e autorização em aplicações web",
    "Utilizar ferramentas de controle de versão e deploy contínuo",
  ],
  courseContent: [
    {
      title: "Introdução ao Desenvolvimento Fullstack",
      lectures: 5,
      duration: "1h 30min",
    },
    {
      title: "Backend com Node.js e Express",
      lectures: 10,
      duration: "4h 15min",
    },
    {
      title: "Frontend com React e Styled Components",
      lectures: 8,
      duration: "3h 45min",
    },
    {
      title: "Integração de Backend e Frontend",
      lectures: 6,
      duration: "2h 30min",
    },
    {
      title: "Autenticação e Autorização",
      lectures: 4,
      duration: "1h 45min",
    },
    {
      title: "Deploy e Considerações Finais",
      lectures: 3,
      duration: "1h 15min",
    },
  ],
}

function CourseDetails() {
  const [course, setCourse] = useState({});
  const [instructor, setInstructor] = useState({});
  const [numStudents, setNumStudentes] = useState(0);
  const [modules, setModules] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    if (!id) return; // Evita chamar o serviço se o id não estiver definido

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
    if (!course?.instructorId) return; // Só busca o instrutor se o course já estiver carregado

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
        console.error("Erro ao buscar número de alunos", error);
      });
  }, [course]); // Roda sempre que o course for atualizado

  const formatToReal = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  }

  const getTotalLessons = () => {
    return modules.reduce((total, module) => total + (module.lessonsIds ? module.lessonsIds.length : 0), 0);
  }

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
                {courseData.whatYouWillLearn.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="cd-course-content-section">
              <h2>Conteúdo do curso</h2>
              <ul className="cd-content-list">
                {courseData.courseContent.map((section, index) => (
                  <li key={index} className="cd-content-item">
                    <div className="cd-content-header">
                      <h3>{section.title}</h3>
                      <span className="cd-content-meta">
                        {section.lectures} aulas • {section.duration}
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
                <button className="cd-btn-primary">Adicionar ao carrinho</button>
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
  )
}

export default CourseDetails;