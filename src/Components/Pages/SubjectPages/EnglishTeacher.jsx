// Components/Pages/SubjectPages/AnhTeacher.js
import React, { useEffect, useState } from 'react';
import SubjectPageTemplate from './SubjectPageTemplate';
import { API_URL } from '../../../config';

const EnglishTeacher = () => {
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    (async () => {
      const response = await fetch(`${API_URL}/tutors/by-subject?subject=english`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response && response.ok) {
        const data = await response.json();
        setTeachers(data)
        return
      }
      setTeachers(null)
    })()
  }, []);

  return <SubjectPageTemplate subject="english" teachers={teachers} />;
};

export default EnglishTeacher;