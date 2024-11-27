import React, { useEffect, useState } from 'react';
import ProfileSideBar from '../ProfileSideBar/ProfileSideBar';
import './UserProfilePage.css';
import classroom_image from '../../../Assets/classroom.png';
import teacher_image from '../../../Assets/teacher.png';
import { MdOutlineEmail } from "react-icons/md";
import { API_URL } from '../../../../config';
import { getToken } from '../../../../utils/common';



function UserProfilePage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const token = getToken("token")
        const response = await fetch(`${API_URL}/app-users/getUserProfile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setUser(data);

      } catch (err) {
        setUser(null);
      }
    })()
  }, []);

  const updateUserProfile = async (updatedData) => {
    try {
      const response = await fetch(`${API_URL}/app-users/updateUserProfile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken("token")}`
        },
        body: JSON.stringify(updatedData)
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Failed to update user profile:', err);
      return null;
    }
  }

  const handleChange = (e, type) => {
    const { value } = e.target;
    setUser({ ...user, [type]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const updatedProfile = await updateUserProfile(user);
      if (updatedProfile) {
        setSuccess('Cập nhật hồ sơ thành công!');
        alert('Cập nhật hồ sơ thành công!')
      }
    } catch (error) {
      setError('Cập nhật hồ sơ thất bại');
      alert('Cập nhật hồ sơ thất bại');
    } finally {
      setLoading(false);
    }
  };
  console.log("user", user)
  if (!user) return <></>

  return (
    <div className="user-profile-container">
      <ProfileSideBar />
      <div className="user-profile-content">
        <div className="row">
          <div className="user-profile">
            <img src={user.imgUrl} alt="Classroom" className="user-profile-image rounded-image" />
          </div>
          <div className='profile-details'>
            <h3>{user.lastName}</h3>
            <p>{user.email}</p>
          </div>
        </div>
        <div className="user-profile-name-row">
          <div className='user-profile-input-bars'>
            <div className='user-profile-fullname-input-bar'>
              <label>Full Name</label>
              <br />
              <input
                type="text"
                placeholder="Full Name"
                value={user.lastName}
                onChange={(e) => handleChange(e, 'lastName')}
              />
            </div>
            <div className='user-profile-firstname-input-bar'>
              <label>Bank</label>
              <br />
              <input
                type="text"
                placeholder={user.bankName}
                value={user.bankName}
                onChange={(e) => handleChange(e, 'bankName')}
              />
            </div>
          </div>
        </div>
        <div className="user-profile-info-row">
          <div className='user-profile-input-bars'>
            <div className='user-profile-country-input-bar'>
              <label>Bank Number</label>
              <br />
              <input
                type="text"
                placeholder="Country"
                value={user.bankNumber}
                onChange={(e) => handleChange(e, 'bankNumber')}
              />
            </div>
            <div className='user-profile-gender-input-bar'>
              <label>Gender</label>
              <br />
              <input
                type="text"
                placeholder="Gender"
                value={user.gender}
                onChange={(e) => handleChange(e, 'gender')}
              />
            </div>
          </div>
        </div>
        <div className="user-profile-email">
          <label>My Email Address: </label>
          <div className='email-details'>
            <MdOutlineEmail />
            <label>{user.email}</label>
          </div>
          <div>
            <button
              onClick={(e) => handleSubmit(e)}
              className="edit-button">EDIT</button>
          </div>
          <p></p>
        </div>
      </div>
    </div>
  );
}

export default UserProfilePage;