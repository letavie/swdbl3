// Components/Pages/SubjectPages/HoaTeacher.js
import React, { useEffect, useState } from 'react';
import SubjectPageTemplate from './SubjectPageTemplate';
import { API_URL } from '../../../config';
import { getToken } from '../../../utils/common';

const ChemistryTeacher = () => {
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    (async () => {
      const response = await fetch(`${API_URL}/tutors/by-subject?subject=chemistry`, {
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

  return <SubjectPageTemplate subject="chemistry" teachers={teachers} />;
};

export default ChemistryTeacher;