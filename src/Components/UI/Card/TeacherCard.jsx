// TeacherCard.js
import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const TeacherCardUI = ({ tutorID, avatar, fname, lname, status, onClick }) => {

  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/teacher-detail/${tutorID}`);
  };

  return (
    <StyledCard onClick={handleCardClick}>
      <img src={avatar} alt={`${lname}`} className="teacher-image" />
      <h5 className="teacher-name">{`${lname}`}</h5>
      <p className="teacher-description" style={{ color: status === 'READY' ? 'green' : 'red' }}>{status}</p>
    </StyledCard>
  );
};

const StyledCard = styled.div`
  width: 250px;
  height: auto;
  margin: 10px;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  //   text-align: center;
  transition: transform 0.2s;
  cursor: pointer;
  &:hover {
    transform: scale(1.05);
  }
  .teacher-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 10px;
  }
  .teacher-name {
    margin-top: 15px;
    font-size: 18px;
    font-weight: bold;
  }
  .teacher-description {
    color: gray;
    font-size: 14px;
  }
`;

export default TeacherCardUI;
