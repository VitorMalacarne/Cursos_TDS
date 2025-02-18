import "../css/CardLearning.css"
import { useNavigate } from "react-router-dom";

function CardLearning({ instructor, progress, course }) {
  const navigate = useNavigate();

  const handleClick = () => {
    // Navega para a página de detalhes do curso, usando o id do curso
    navigate(`/coursecontent/${course.id}`);
};

  return (
    <div className="learn-course-card" onClick={handleClick}>
      <div className="learn-course-image-container">
        <img 
          src={course.imageUrl || "/placeholder.svg"} 
          alt={`Imagem do curso ${course.name}`} 
          className="learn-course-image" 
        />
      </div>

      <div className="learn-course-content">
        <h3 className="learn-course-title">{course.name}</h3>
        <p className="learn-instructor-name">{instructor}</p>

        <div className="learn-progress-section">
          <div className="learn-progress-bar">
            <div 
              className="learn-progress-fill" 
              style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }} 
            />
          </div>
          <span className="learn-progress-text">{progress}% concluído</span>
        </div>
      </div>
    </div>
  )
}

export default CardLearning;
