import "../css/CardLearning.css"

function CardLearning({ title, instructor, progress, imageUrl }) {

  return (
    <div className="learn-course-card">
      <div className="learn-course-image-container">
        <img 
          src={imageUrl || "/placeholder.svg"} 
          alt={`Imagem do curso ${title}`} 
          className="learn-course-image" 
        />
      </div>

      <div className="learn-course-content">
        <h3 className="learn-course-title">{title}</h3>
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
