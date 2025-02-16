import React from "react";

function CourseCard({ course }) {
    return (
        <div className="course-card">
            <img src="https://s2-techtudo.glbimg.com/L9wb1xt7tjjL-Ocvos-Ju0tVmfc=/0x0:1200x800/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_08fbf48bc0524877943fe86e43087e7a/internal_photos/bs/2023/q/l/TIdfl2SA6J16XZAy56Mw/canvaai.png" alt={course.name} className="course-image" />
            <div className="course-details">
                <h3 className="course-name">{course.name}</h3>
                <p className="course-description">{course.description}</p>
                <span className="course-duration">R$ {course.price}</span>
            </div>
        </div>
    );
}

export default CourseCard;