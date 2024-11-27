import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import './../ScheduleProfile/ScheduleProfile.css';
import ProfileSideBar from '../ProfileSideBar/ProfileSideBar';
import { getToken } from '../../../Navbar/Navbar';
import { API_URL } from '../../../../config';

const subjects = [
    { value: 'MATH_10', label: 'Math 10' },
    { value: 'MATH_11', label: 'Math 11' },
    { value: 'MATH_12', label: 'Math 12' },
    { value: 'PHYSIC_10', label: 'Physic 10' },
    { value: 'PHYSIC_11', label: 'Physic 11' },
    { value: 'PHYSIC_12', label: 'Physic 12' },
    { value: 'ENGLISH_10', label: 'English 10' },
    { value: 'ENGLISH_11', label: 'English 11' },
    { value: 'ENGLISH_12', label: 'English 12' },
    { value: 'CHEMISTRY_10', label: 'Chemistry 10' },
    { value: 'CHEMISTRY_11', label: 'Chemistry 11' },
    { value: 'CHEMISTRY_12', label: 'Chemistry 12' },
];
const platformTypes = ['DISCORD', 'ZOOM', 'MEET'];

function ScheduleProfile() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [tutorDetails, setTutorDetails] = useState(null);
    const [selectedSubjects, setSelectedSubjects] = useState([]);
    const [beTutor, setBeTutor] = useState(false);
    const [platformURLs, setPlatformURLs] = useState({
        DISCORD: '',
        ZOOM: '',
        MEET: ''
    });

    useEffect(() => {
        (async () => {
            try {
                const token = getToken("token");
                const response = await fetch(`${API_URL}/app-users/getTutorProfile`, {
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
                setTutorDetails(data);
                setBeTutor(data.beTutor);
                setSelectedSubjects(data.teachs.map(t => subjects.find(s => s.value === t.subject)));
                const urls = data.contacts.reduce((acc, contact) => {
                    acc[contact.type] = contact.urlContact;
                    return acc;
                }, {});
                setPlatformURLs(urls);
            } catch (err) {
                setTutorDetails(null);
            }
        })();
    }, []);

    const updateTutorDetails = async (updatedDetails) => {
        try {
            const response = await fetch(`${API_URL}/app-users/updateTutorProfile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken("token")}`
                },
                body: JSON.stringify(updatedDetails)
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
    };


    const handleChange = (e, type) => {
        const { value } = e.target;
        setTutorDetails({ ...tutorDetails, [type]: value });
    };

    const handleSubjectChange = (selectedOptions) => {
        setSelectedSubjects(selectedOptions);
    };

    const handlePlatformChange = (e, type) => {
        setPlatformURLs({ ...platformURLs, [type]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        const updatedDetails = {
            ...tutorDetails,
            teachs: selectedSubjects.map(subject => ({ subject: subject.value })),
            beTutor: beTutor,
            contacts: platformTypes.map(type => ({
                type,
                urlContact: platformURLs[type]
            }))
        };

        try {
            const updatedProfile = await updateTutorDetails(updatedDetails);
            if (updatedProfile) {
                setSuccess('Cập nhật hồ sơ thành công!');
                alert('Cập nhật hồ sơ thành công!');
                window.location.reload(); // Tải lại trang sau khi cập nhật thành công
            }
        } catch (error) {
            setError('Cập nhật hồ sơ thất bại');
            alert('Cập nhật hồ sơ thất bại');
        } finally {
            setLoading(false);
        }
    };

    if (!tutorDetails) return <></>;

    return (
        <div className="tutor-profile-container">
            <ProfileSideBar />
            <div className="tutor-profile-content">
                <div className="tutor-row">
                    <div className="tutor-profile">
                        <img src={tutorDetails.image} alt="Classroom" className="tutor-profile-image rounded-image" />
                    </div>
                    <div className="tutor-profile-details">
                        <h3>{tutorDetails.lname}</h3>
                        <p>{tutorDetails.email}</p>
                    </div>
                </div>
                <div className="tutor-toggle-container">
                    <div className="tutor-toggle">
                        <label className="toggle-label">Be a Tutor</label>
                        <label className="switch">
                            <input
                                type="checkbox"
                                checked={beTutor}
                                onChange={() => setBeTutor(!beTutor)}
                            />
                            <span className="slider"></span>
                        </label>
                    </div>
                </div>
                <div className="subject-select-container">
                    <Select
                        isMulti
                        value={selectedSubjects}
                        options={subjects}
                        onChange={handleSubjectChange}
                        placeholder="Select subjects"
                    />
                </div>
                <div className="introduce-yourself-container">
                    <textarea
                        value={tutorDetails.introduce}
                        onChange={(e) => handleChange(e, 'introduce')}
                        placeholder="Introduce yourself"
                    />
                </div>
                <div className="additional-info-container">
                    <div className="info-row">
                        <label>Rental Cost (VND)</label>
                        <input
                            type="number"
                            className="info-button"
                            value={tutorDetails.price}
                            onChange={(e) => handleChange(e, 'price')}
                            min="0"
                        />
                    </div>
                    {platformTypes.map((type) => (
                        <div className="info-row" key={type}>
                            <label>{type} URL</label>
                            <input
                                className="info-button"
                                type="text"
                                value={platformURLs[type]}
                                onChange={(e) => handlePlatformChange(e, type)}
                            />
                        </div>
                    ))}
                </div>
                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}
                <div className="save-button-container">
                    <button
                        className="edit-button"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ScheduleProfile;
