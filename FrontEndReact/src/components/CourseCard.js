import React from "react";
import { useNavigate } from "react-router-dom";

function CourseCard({ course }) {
    const navigate = useNavigate();

    const handleClick = () => {
        // Navega para a página de detalhes do curso, usando o id do curso
        navigate(`/coursepage/${course.id}`);
    };

    return (
        <div className="course-card" onClick={handleClick}>
            <img src={course.imageUrl} alt={course.name} className="course-image" />
            <div className="course-details">
                <h3 className="course-name">{course.name}</h3>
                <p className="course-description">{course.description}</p>
                <span className="course-duration">R$ {course.price}</span>
            </div>
        </div>
    );
}

export default CourseCard;