import React, { useEffect, useState } from 'react';
import './style/TeacherDetailPage.css';
import TeacherCard from './TeacherCard';
import TeacherClasses from './TeacherClasses';
import TeacherInfo from './TeacherInfo';
import BreadcrumbWithBackButton from '../../UI/BreadCrumb/BreadCrumb';
import TeacherVideo from './TeacherVideo';
import TeacherFeedback from './TeacherFeedback';
import { useParams } from 'react-router-dom';
import { API_URL } from '../../../config';

const TeacherDetailPage = () => {
  const { id } = useParams();
  const [tutor, setTutor] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(`${API_URL}/tutors/GetCustom/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setTutor(data);
      } catch (err) {
        setTutor(null);
      }
    })();
  }, [id]);
  console.log("tutor", tutor)
  if (!tutor) return <></>;
  return (
    <div className='teacher-detail-page container mx-auto p-4'>
      <div className=' mb-8 w-full max-w-[1100px]'>
        <BreadcrumbWithBackButton currentTab={'Teacher Detail'} />
      </div>
      <TeacherCard
        tutorID={tutor.tutorID}
        firstName={`${tutor.lastName}`}
        totalHoursHired={`${tutor.totalHoursHired}`}
        percentSuccess={`${tutor.percentSuccess}`}
        price={tutor.price}
        averageRate={tutor.averageRate}
        cusrating={tutor.averageRate}
        status={`${tutor.status}`}
        login={tutor.userName}
        teach={tutor.teach}
        numberFollow={tutor.numberFollow}
        img={tutor.img}
      />
      <TeacherInfo information={tutor.information} contacts={tutor.contact} />
      <TeacherVideo videoUrl={tutor.videoUrl} />
      <TeacherFeedback ratings={tutor.cusrating} />
    </div>
  );
};

export default TeacherDetailPage;
