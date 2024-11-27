import React, { useEffect, useState } from 'react';
import ProfileSideBar from '../ProfileSideBar/ProfileSideBar';
import './TutorProfilePage.css';
import teacher_image from '../../../Assets/teacher.png';
import { getToken } from '../../../../utils/common';
import { API_URL } from '../../../../config';

function TutorProfilePage() {
    const [tutorProfile, setTutorProfile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        (async () => {
            try {
                const token = getToken("token");
                console.log('token', token);
                const response = await fetch(`${API_URL}/app-users/getAllCertifycate`, {
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
                setTutorProfile(data);
            } catch (err) {
                setTutorProfile(null);
            }
        })();
    }, []);

    const confirmTutorStatus = async () => {
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const token = getToken("token");
            const response = await fetch(`${API_URL}/tutors/${tutorProfile.id}/status/Confirming`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: 'Confirming' }) // Adjust payload as per your API requirement
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            setSuccess('Tutor status confirmed successfully!');
            console.log('Tutor status confirmed:', data);
        } catch (error) {
            setError('Failed to confirm tutor status');
            console.error('Failed to confirm tutor status:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateTutorProfile = async (updatedTutor) => {
        try {
            const response = await fetch(`${API_URL}/app-users/update-certificate`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken("token")}`
                },
                body: JSON.stringify(updatedTutor)
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (err) {
            console.error('Failed to update tutor profile:', err);
            return null;
        }
    }

    const handleChange = (e, type) => {
        const { value } = e.target;
        setTutorProfile({ ...tutorProfile, [type]: value });
    };

    const handleImageChange = (e, rank) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const updatedImages = tutorProfile.rankwithImage.map((item) =>
                    item.rank === rank ? { ...item, url: reader.result } : item
                );
                setTutorProfile({ ...tutorProfile, rankwithImage: updatedImages });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const updatedTutor = await updateTutorProfile(tutorProfile);
            if (updatedTutor) {
                setSuccess('Cập nhật hồ sơ thành công!');
                alert('Cập nhật hồ sơ thành công!');
            }
        } catch (error) {
            setError('Cập nhật hồ sơ thất bại');
            alert('Cập nhật hồ sơ thất bại');
        } finally {
            setLoading(false);
        }
    };

    console.log("tutorProfile", tutorProfile);
    if (!tutorProfile) return <></>;

    return (
        <div className="tutor-profile-container">
            <ProfileSideBar />
            <div className="tutor-profile-content">
                <div className="tutor-profile-header">
                    <div className="tutor-profile">
                        <img src={teacher_image} alt="Classroom" className="tutor-profile-image rounded-image" />
                        <div className="tutor-profile-details">
                            <h3>{tutorProfile.lname}</h3>
                            <p>{tutorProfile.email}</p>
                        </div>
                    </div>
                    <div className="profile-buttons">
                        <button
                            onClick={(e) => handleSubmit(e)}
                            className="edit-button">EDIT</button>
                        <button
                            onClick={confirmTutorStatus}
                            className="send-button"
                            disabled={loading}>
                            SENT
                        </button>
                    </div>
                </div>
                <div className='tutor-profile-input-row'>
                    <div className='tutor-profile-input-bars'>
                        <div className='tutor-profile-university-graduate-input-bar'>
                            <label>University Graduate</label>
                            <br />
                            <input
                                type='text'
                                placeholder='University Graduate'
                                value={tutorProfile.school}
                                onChange={(e) => handleChange(e, 'school')} />
                        </div>
                        <div className='tutor-profile-major-input-bar'>
                            <label>Major</label>
                            <br />
                            <input
                                type='text'
                                placeholder='Major'
                                value={tutorProfile.major}
                                onChange={(e) => handleChange(e, 'major')} />
                        </div>
                    </div>
                </div>
                <div className='tutor-profile-input-row'>
                    <div className='tutor-profile-input-bars'>
                        <div className='tutor-profile-student-id-input-bar'>
                            <label>Student ID</label>
                            <br />
                            <input
                                type='text'
                                placeholder='Student ID'
                                value={tutorProfile.studentID}
                                onChange={(e) => handleChange(e, 'studentID')} />
                        </div>
                        <div className='tutor-profile-graduation-year-input-bar'>
                            <label>Graduation Year</label>
                            <br />
                            <input
                                type='text'
                                placeholder='Graduation Year'
                                value={tutorProfile.year}
                                onChange={(e) => handleChange(e, 'year')} />
                        </div>
                    </div>
                </div>
                <div className='tutor-additional-info'>
                    {tutorProfile.rankwithImage.map((item) => (
                        <div className='add-image' key={item.rank}>
                            <label>{item.rank} Degree Certificate</label>
                            <br />
                            <img src={item.url} alt={`${item.rank} Degree`} className='degree-image' />
                            <br />
                            <input type='file' onChange={(e) => handleImageChange(e, item.rank)} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default TutorProfilePage;
