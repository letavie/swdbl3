import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar/Sidebar";
import "./MainPage.css"; // Import CSS file for MainPage
import image1 from "../../Assets/img_nature_wide.png"; // Import images from the correct relative path
import image2 from "../../Assets/img_snow_wide.png";
import image3 from "../../Assets/img_lights_wide.png";
import { useNavigate } from "react-router-dom";
import TeacherCard from "../../UI/Card/TeacherCard";
import TeacherCardUI from "../../UI/Card/TeacherCard";
import { FilterOutlined } from "@ant-design/icons";
import { API_URL } from "../../../config";
import { getToken } from "../../../utils/common";

function MainPage() {
  const [slideIndex, setSlideIndex] = useState(1);
  const [teacherData, setTeacherData] = useState(null)
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      const token = getToken("token");
      const response = await fetch(`${API_URL}/app-users/GetAllRecommend`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response && response.ok) {
        const data = await response.json();
        setTeacherData(data)
        return
      }
      setTeacherData(null)
    })()
  }, []);

  console.log("teacherData", teacherData)

  const showSlides = (n) => {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    let dots = document.getElementsByClassName("dot");

    if (slides.length === 0) return;

    if (n > slides.length) {
      setSlideIndex(1);
    }
    if (n < 1) {
      setSlideIndex(slides.length);
    }

    for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slideIndex - 1].style.display = "block";
    dots[slideIndex - 1].className += " active";
  };

  const plusSlides = (n) => {
    let newIndex = slideIndex + n;
    if (newIndex > 3) {
      newIndex = 1;
    } else if (newIndex < 1) {
      newIndex = 3;
    }
    setSlideIndex(newIndex);
  };

  const currentSlide = (n) => {
    setSlideIndex(n);
  };

  useEffect(() => {
    showSlides(slideIndex);
  }, [slideIndex]);


  const handleClick = (id) => {
    // navigate(`/teacher-detail/${id}`);
    console.log("id", id)
  };

  const handleSearch = async () => {
    try {
      const token = getToken("token")
      const response = await fetch(`${API_URL}/app-users/SearchTutor/${searchQuery}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response && response.ok) {
        const data = await response.json();
        setTeacherData(data);
        return;
      }
      setTeacherData(null);
    } catch (error) {
      console.error("Failed to fetch search results:", error);
    }
  };


  console.log('teacherData', teacherData);
  return (
    <div className="main-page">
      <Sidebar className="Sidebar" />
      <div className="content">
        <div className="slideshow-container">
          <div className="mySlides fade">
            <div className="numbertext">1 / 3</div>
            <img src={image1} alt="Slide 1" />
          </div>
          <div className="mySlides fade">
            <div className="numbertext">2 / 3</div>
            <img src={image2} alt="Slide 2" />
          </div>
          <div className="mySlides fade">
            <div className="numbertext">3 / 3</div>
            <img src={image3} alt="Slide 3" />
          </div>
          <a className="prev" onClick={() => plusSlides(-1)}>
            &#10094;
          </a>
          <a className="next" onClick={() => plusSlides(1)}>
            &#10095;
          </a>
          <br />
          <div style={{ textAlign: "center" }}>
            <span className="dot" onClick={() => currentSlide(1)}></span>
            <span className="dot" onClick={() => currentSlide(2)}></span>
            <span className="dot" onClick={() => currentSlide(3)}></span>
          </div>
        </div>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search..."
            className="search-bar"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="filter-button" onClick={handleSearch}>
            <FilterOutlined /> Search
          </button>
        </div>
        <h2 className="text-xl font-semibold my-4 uppercase">
          Recommend Teacher
        </h2>
        <div className="four-divs-container">
          {teacherData && teacherData.map((teacher) => (
            <TeacherCardUI
              key={teacher.tutorId}
              tutorID={teacher.tutorId}
              fname={teacher.fname}
              lname={teacher.lname}
              status={teacher.status}
              avatar={teacher.avatar}
              onClick={() => handleClick(teacher.tutorId)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default MainPage;
