import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../css/CourseContentPage.css";
import ModuleService from "../Services/ModuleService";
import LessonService from "../Services/LessonService"; // Serviço para buscar as aulas
import ExamService from "../Services/ExamService"; // Serviço para buscar o exame
import ExamPage from "./ExamPage"; // Componente para exibir o exame

export default function CourseContentPage() {
  const [openModules, setOpenModules] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [modules, setModules] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null); // Estado para controlar o exame selecionado
  const { id } = useParams();
  const navigate = useNavigate();

  // Primeiro useEffect: buscar os módulos do curso
  useEffect(() => {
    if (!id) return;

    ModuleService.getModulesByCourse(id)
      .then((response) => {
        const fetchedModules = response.data;
        setModules(fetchedModules);
        //console.log("Módulos carregados:", fetchedModules);
        // Abrir todos os módulos por padrão para visualização
        setOpenModules(fetchedModules.map((module) => module.id));
      })
      .catch((error) => {
        console.error("Erro ao buscar módulos", error);
      });
  }, [id]);

  // Segundo useEffect: buscar as lições e os exames para cada módulo sempre que os módulos forem atualizados
  useEffect(() => {
    if (!modules.length) return;

    modules.forEach((module) => {
      // Buscar as lições, se module.lessonsIds for um array
      if (Array.isArray(module.lessonsIds)) {
        Promise.all(
          module.lessonsIds.map((lessonId) =>
            LessonService.getLessonById(lessonId)
          )
        )
          .then((lessonResponses) => {
            const lessonsData = lessonResponses.map(
              (response) => response.data
            );
            //console.log(`Aulas do módulo ${module.id} carregadas:`, lessonsData);

            // Prevenir duplicação de lições
            setLessons((prevLessons) => {
              const newLessons = lessonsData.filter(
                (lesson) =>
                  !prevLessons.some((prevLesson) => prevLesson.id === lesson.id)
              );
              return [...prevLessons, ...newLessons];
            });
          })
          .catch((error) => {
            console.error(`Erro ao buscar aulas do módulo ${module.id}`, error);
          });
      } else {
        console.warn(
          `module.lessonsIds não é um array para o módulo ${module.id}`
        );
      }

      // Buscar o exame para o módulo, se examId estiver definido
      if (module.examId) {
        ExamService.getExamById(module.examId)
          .then((examResponse) => {
            // console.log(
            //   `Exame do módulo ${module.id} carregado:`,
            //   examResponse.data
            // );
            setExams((prevExams) => {
              // Evita duplicação: se já existir um exame para este módulo, retorna o estado atual
              if (prevExams.some((exam) => exam.moduleId === module.id)) {
                return prevExams;
              }
              return [
                ...prevExams,
                { moduleId: module.id, exam: examResponse.data },
              ];
            });
          })
          .catch((error) => {
            console.error(`Erro ao buscar exame do módulo ${module.id}`, error);
          });
      }
    });
  }, [modules]);

  const toggleModule = (moduleId) => {
    setOpenModules((prevOpenModules) =>
      prevOpenModules.includes(moduleId)
        ? prevOpenModules.filter((id) => id !== moduleId)
        : [...prevOpenModules, moduleId]
    );
  };

  // Implementação do toggle lesson completion
  const toggleLessonCompletion = (moduleId, lessonId) => {
    const lesson = lessons.find((l) => l.id === lessonId);
    if (!lesson) return;

    const action = lesson.completed ? "desmarcar" : "marcar";
    const confirmed = window.confirm(
      `Deseja ${action} a lição "${lesson.title}" como concluída?`
    );

    if (confirmed) {
      setLessons((prevLessons) =>
        prevLessons.map((l) =>
          l.id === lessonId ? { ...l, completed: !l.completed } : l
        )
      );
      console.log(
        `Lição ${lessonId} foi ${!lesson.completed ? "marcada" : "desmarcada"} como concluída.`
      );
    }
  };

  const totalLessons = lessons.length;
  const completedLessons = lessons.filter((lesson) => lesson.completed).length;
  const progress = totalLessons ? (completedLessons / totalLessons) * 100 : 0;

  return (
    <div className="cct-course-content">
      <main className="cct-content-wrapper">
        <aside className="cct-course-sidebar">
          <div className="cct-course-progress">
            <h2>Progresso do Curso</h2>
            <div className="cct-progress-bar">
              <div
                className="cct-progress-fill"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p>
              {completedLessons} de {totalLessons} aulas concluídas (
              {progress.toFixed(0)}%)
            </p>
          </div>
          <div className="cct-module-list">
            {modules.map((module) => (
              <div key={module.id} className="cct-module">
                <button
                  className={`cct-module-header ${
                    openModules.includes(module.id) ? "cct-open" : ""
                  }`}
                  onClick={() => toggleModule(module.id)}
                >
                  <h3>{module.name}</h3>
                  <span className="cct-module-toggle">
                    {openModules.includes(module.id) ? "−" : "+"}
                  </span>
                </button>
                {openModules.includes(module.id) && (
                  <ul className="cct-lesson-list">
                    {lessons
                      .filter((lesson) =>
                        (module.lessonsIds || []).includes(lesson.id)
                      )
                      .map((lesson) => (
                        <li
                          key={lesson.id}
                          className={`cct-lesson ${
                            selectedLesson?.id === lesson.id ? "cct-selected" : ""
                          }`}
                          onClick={() => {
                            setSelectedLesson(lesson);
                            setSelectedExam(null); // Limpa o exame selecionado quando uma lição é clicada
                          }}
                        >
                          <div className="cct-lesson-info">
                            <span className="cct-lesson-title">
                              {lesson.title}
                            </span>
                            <span className="cct-lesson-duration">
                              {lesson.duration}
                            </span>
                          </div>
                          <button
                            className={`cct-completion-toggle ${
                              lesson.completed ? "cct-completed" : ""
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleLessonCompletion(module.id, lesson.id);
                            }}
                          >
                            {lesson.completed ? "✓" : ""}
                          </button>
                        </li>
                      ))}

                    {/* Exibir o exame no mesmo modelo das lições */}
                    {exams
                      .filter((exam) => exam.moduleId === module.id)
                      .map((exam) => (
                        <li
                          key={`exam-${module.id}`}
                          className="cct-lesson cct-exam"
                          onClick={() => {
                            setSelectedExam(exam.exam); // Atualiza o exame selecionado
                            setSelectedLesson(null); // Limpa a lição selecionada
                          }}
                        >
                          <div className="cct-lesson-info">
                            <span className="cct-lesson-title">
                              Exame: {exam.exam.name}
                            </span>
                            <span className="cct-lesson-duration">
                              {exam.exam.description}
                            </span>
                          </div>
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </aside>
        <section className="cct-lesson-content">
          {selectedLesson ? (
            <div className="cct-video-player">
              <h2>{selectedLesson.title}</h2>
              <div className="cct-video-container">
                {selectedLesson.content.includes("youtube.com") ||
                selectedLesson.content.includes("youtu.be") ? (
                  <iframe
                    width="100%"
                    height="100%"
                    src={selectedLesson.content.replace("watch?v=", "embed/")}
                    title={selectedLesson.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <video key={selectedLesson.content} width="100%" controls>
                    <source
                      src={selectedLesson.content}
                      type="video/mp4"
                    />
                    Seu navegador não suporta vídeos HTML5.
                  </video>
                )}
              </div>
            </div>
          ) : selectedExam ? (
            <ExamPage exam={selectedExam} /> // Exibe o componente ExamPage quando um exame é selecionado
          ) : (
            <div className="cct-no-lesson-selected">
              <h2>Bem-vindo ao curso!</h2>
              <p>Selecione uma aula ou um exame para começar.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
