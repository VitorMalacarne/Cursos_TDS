import React from "react";

function CourseCard({ course }) {
    return (
        <div className="course-card">
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