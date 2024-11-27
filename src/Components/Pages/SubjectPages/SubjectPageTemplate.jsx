// Components/Pages/SubjectPages/SubjectPageTemplate.js
import React from 'react';
import './SubjectPageTemplate.css';
import TeacherCardUI from '../../UI/Card/TeacherCard';

const SubjectPageTemplate = ({ subject, teachers }) => {

  return (
    <div className="subject-page">
      <h2>Here's the list of our {subject} Teachers</h2>
      <div className="four-divs-container">
        {teachers.map((teacher) => (
          <TeacherCardUI
            key={teacher.tutorID}
            tutorID={teacher.tutorID}
            avatar={teacher.urlImage}
            fname={teacher.firstName}
            lname={teacher.lastName}
            status={teacher.status}
          />
        ))}
      </div>
    </div>
  );
};

export default SubjectPageTemplate;
