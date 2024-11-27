import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Button, Rate, Modal, Select, Input } from 'antd';
import TeacherClasses from './TeacherClasses';
import { formatCurrency, getToken } from '../../../utils/common';
import { API_URL } from '../../../config';
import ChatBox from '../../Pages/DetailPage/ChatBox'; // Updated import path
import { useNavigate } from 'react-router-dom';
import { useHistory } from 'react-router-dom'; // Import useHistory hook

const CardContainer = styled.div`
  display: flex;
  background-color: white;
  border: 1px solid #eaeaea;
  padding: 16px;
  border-radius: 8px;
  width: 100%;
  max-width: 1100px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const TeacherImage = styled.img`
  width: 250px;
  height: 300px;
  border-radius: 10px;
  object-fit: cover;
  margin-right: 16px;
`;

const TeacherInfo = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  margin-right: 20px;
  margin-left: 20px;
`;

const TeacherName = styled.h2`
  display: flex;
  justify-content: space-between;
  font-size: 2rem;
  font-weight: 670;
  margin-bottom: 30px;
  width: 90%;
`;

const Info = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  align-items: flex-start;
  margin-bottom: 8px;
`;

const InfoItem = styled.div`
  margin-right: 16px;
  font-size: 1rem;
  color: #555;
  text-align: center;
  flex: 1 0 21%; /* Adjust as needed */
`;

const Price = styled.div`
  font-size: 2rem;
  color: #ff4d4f;
  font-weight: 600;
  margin-bottom: 8px;
`;

const ActionButtons = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 30px;
`;

const HireButton = styled(Button)`
  height: 40px;
  font-weight: 600;
  font-size: 1.25rem;
  width: 90%;
  background-color: #ff4d4f;
  color: white;
  margin-bottom: 10px;
  &:hover {
    background-color: #ff7875;
    color: white;
  }
`;

const FollowButton = styled(Button)`
  height: 40px;
  font-weight: 600;
  font-size: 1.25rem;
  width: 90%;
  background-color: #ffa500;
  color: white;
  &:hover {
    background-color: #ffcc00;
    color: white;
  }
`;

const PaymentOption = styled.div`
  display: flex;
  align-items: center;
  margin-top: 20px;
  cursor: pointer;
  &:hover {
    background-color: #f5f5f5;
  }
  padding: 10px;
  border-radius: 8px;
`;

const PaymentImage = styled.img`
  width: 40px;
  height: 40px;
  margin-right: 10px;
`;

const CancelButton = styled(Button)`
  height: 40px;
  font-weight: 600;
  font-size: 1.25rem;
  width: 90%;
  background-color: #ff4d4f;
  color: white;
  margin-top: 10px;
  &:hover {
    background-color: #ff7875;
    color: white;
  }
`;

const TeacherClassesContainer = styled.div`
  max-height: 200px; /* Giới hạn chiều cao */
  overflow-y: auto; /* Thêm thanh cuộn dọc */
  padding: 10px;
`;

const token = getToken('token');

const TeacherCard = ({
  tutorID,
  firstName,
  lastName,
  userName,
  totalHoursHired,
  percentSuccess,
  price,
  averageRate,
  teach,
  status,
  contact,
  videoUrl,
  cusrating,
  information,
  login,
  numberFollow: initialNumberFollow,
  email,
  img
}) => {
  const [isHireModalVisible, setIsHireModalVisible] = useState(false);
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const [isChatModalVisible, setIsChatModalVisible] = useState(false);
  const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
  const [hireDuration, setHireDuration] = useState(1);
  const [message, setMessage] = useState('');
  const [profileData, setProfileData] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false); // Thêm trạng thái theo dõi
  const [numberFollow, setNumberFollow] = useState(initialNumberFollow);
  const [countdownTime, setCountdownTime] = useState(null); // Thời gian đếm ngược
  const [hireId, setHireId] = useState(null); // Add state to store hire ID
  const [isRatingModalVisible, setIsRatingModalVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      const response = await fetch(`${API_URL}/app-users/GetCurrentAppUser`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (response && response.ok) {
        const data = await response.json();
        setProfileData(data);
        return;
      }
      setProfileData(null);
    })();
  }, []);


  useEffect(() => {
    const storedHireId = localStorage.getItem('hireId');
    if (storedHireId) {
      setHireId(storedHireId);
    }

    // Check if rating modal should be visible
    const showRatingModal = localStorage.getItem('showRatingModal');
    if (showRatingModal) {
      setIsRatingModalVisible(true);
      localStorage.removeItem('showRatingModal'); // Clear the flag
    }
  }, []);

  const hireCost = useMemo(() => {
    return price * hireDuration;
  }, [hireDuration, price]);

  const showHireModal = () => {
    if (!token) {
      navigate('/login');
    } else {
      setIsHireModalVisible(true);
    }
  };

  const handleHireOk = async () => {
    if (!profileData || !profileData.id) {
      navigate('/login');
      return;
    }
    setIsHireModalVisible(false);

    const values = {
      timeHire: hireDuration,
      totalPrice: hireCost,
      appUser: {
        id: profileData.id,
      },
      tutor: {
        id: tutorID,
      },
    };
    if (profileData.wallet.amount < hireCost)
      return setIsPaymentModalVisible(true);
    try {
      const response = await fetch(`${API_URL}/hire-tutors/hireTutor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(values),
      });
      if (response && response.ok) {
        const data = await response.json();
        const newHireId = data.id; // Assuming response contains the new hire ID
        setHireId(newHireId);
        localStorage.setItem('hireId', newHireId); // Store hire ID in localStorage
      }
      window.location.reload();
    } catch (error) {
      console.error("Error:", error);
      return;
    }
  };
  useEffect(() => {
    const storedHireId = localStorage.getItem('hireId');
    if (storedHireId) {
      setHireId(storedHireId);
    }
  }, []);
  console.log("hireId", hireId)
  const startCountdown = () => {
    const interval = setInterval(() => {
      setCountdownTime(prev => prev - 1000);
    }, 1000);

    // Clear interval when countdownTime reaches 0
    setTimeout(() => {
      clearInterval(interval);
      setCountdownTime(null);
    }, countdownTime);
  };
  useEffect(() => {
    (async () => {
      const response = await fetch(`${API_URL}/follows/getAllFollowedTutor`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (response && response.ok) {
        const followedTutors = await response.json();
        setIsFollowing(followedTutors.some(tutor => tutor.tutorId === tutorID));
      }
    })();
  }, [tutorID]);

  const handleHireCancel = () => {
    setIsHireModalVisible(false);
  };

  const handlePaymentOk = () => {
    setIsPaymentModalVisible(false);
    // Handle payment confirmation
  };

  const handleFollow = async () => {
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const response = await fetch(`${API_URL}/follows/FollowAndUnFollow/${tutorID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        setIsFollowing(!isFollowing); // Cập nhật trạng thái theo dõi
        setNumberFollow(prev => isFollowing ? prev - 1 : prev + 1); // Cập nhật số người theo dõi
      } else {
        console.error('Failed to follow/unfollow tutor');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const showChatModal = () => {
    if (!token) {
      navigate('/login');
    } else {
      setIsChatModalVisible(true);
    }
  };

  const showCancelModal = () => {
    setIsCancelModalVisible(true);
  };

  const handleCancelOk = async () => {
    setIsCancelModalVisible(false);
    try {
      const response = await fetch(`${API_URL}/hire-tutors/${hireId}/updateStatusCancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        localStorage.removeItem('hireId'); // Clear hire ID from localStorage
        localStorage.setItem('showRatingModal', 'true'); // Set flag to show rating modal
        window.location.reload();
      } else {
        console.error('Failed to cancel hire');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleCancelCancel = () => {
    setIsCancelModalVisible(false);
  };

  const handleRatingOk = async () => {
    const ratingData = {
      rating: rating,
      comment: comment,
      hours: hireDuration,
      date: new Date().toISOString().split('T')[0], // current date in YYYY-MM-DD format
      tutor: {
        id: tutorID
      },
      appUser: {
        id: profileData.id
      }
    };

    try {
      const response = await fetch(`${API_URL}/ratings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(ratingData),
      });

      if (response.ok) {
        // Handle success
        setIsRatingModalVisible(false);
        window.location.reload();
      } else {
        console.error('Failed to submit rating');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const handleRatingCancel = () => {
    setIsRatingModalVisible(false);
  };

  const handleChatClose = () => {
    setIsChatModalVisible(false);
  };
  const handlePaymentCancel = () => {
    setIsPaymentModalVisible(false);
  };


  return (
    <CardContainer>
      <div>
        <TeacherImage
          src={img}
          alt='Teacher'
        />
        <p
          className={`font-semibold text-center my-2 ${status === 'BUSY' ? 'text-red-500' : 'text-green-500'
            }`}
        >
          {status}
        </p>
      </div>
      <TeacherInfo>
        <TeacherName>
          <p className=''>{firstName}</p>
        </TeacherName>
        <Info>
          <InfoItem>
            <p className='text-lg font-bold my-2 text-gray-500'>
              Already rented
            </p>
            <p className='text-red-500'>{totalHoursHired} Hours</p>
          </InfoItem>
          <InfoItem>
            <p className='text-lg font-bold my-2 text-gray-500'>
              Completion rate
            </p>
            <p className='text-red-500'>{percentSuccess}%</p>
          </InfoItem>
          <InfoItem>
            <p className='text-lg font-bold my-2 text-gray-500'>Followers</p>
            <p className='text-red-500'>{numberFollow}</p>
          </InfoItem>
          <InfoItem>
            <p className='text-lg font-bold my-2 text-gray-500'>
              Device status
            </p>
            <p role='img' aria-label='microphone' className='text-red-500'>
              🎤
            </p>
          </InfoItem>
        </Info>
        <div className='mt-6 w-full max-w-[800px] border rounded-md'>
          <TeacherClassesContainer>
            <TeacherClasses teach={teach} />
          </TeacherClassesContainer>
        </div>
      </TeacherInfo>
      <div className='w-[300px]'>
        <Price>{price} đ/h</Price>
        <div className='flex'>
          <Rate disabled defaultValue={cusrating} />
          <p className='text-gray-400 ml-4'>{averageRate} Ratings</p>
        </div>
        <ActionButtons>
          <HireButton onClick={showHireModal}>Hire</HireButton>
          <FollowButton onClick={handleFollow}>
            {isFollowing ? 'Unfollow' : 'Follow'}
          </FollowButton>
          <CancelButton onClick={showCancelModal}>Cancel</CancelButton>
          <Button onClick={showChatModal}>Chat</Button>
        </ActionButtons>
      </div>
      <Modal
        title='Hire Tutor'
        visible={isHireModalVisible}
        onOk={handleHireOk}
        onCancel={handleHireCancel}
        footer={[
          <Button key='back' onClick={handleHireCancel}>
            Close
          </Button>,
          <Button key='submit' type='primary' onClick={handleHireOk}>
            Hire
          </Button>,
        ]}
      >
        <div>
          <p>Tutor Name: {firstName}</p>
          <div>
            <label>Time to Hire: </label>
            <Select
              value={`${hireDuration} hours`}
              onChange={(value) => setHireDuration(parseInt(value))}
            >
              <Select.Option value='1'>1 hour</Select.Option>
              <Select.Option value='2'>2 hours</Select.Option>
              <Select.Option value='3'>3 hours</Select.Option>
              <Select.Option value='4'>4 hours</Select.Option>
              <Select.Option value='5'>5 hours</Select.Option>
            </Select>
          </div>
          <p>Cost: {formatCurrency(hireCost)}</p>
          {profileData && profileData.wallet && (
            <div>
              <span>
                Current balance:{' '}
                {formatCurrency(profileData.wallet.amount || 0)}
              </span>
            </div>
          )}
          <Input.TextArea
            className='mt-4'
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder='Type a message...'
          />
        </div>
      </Modal>
      <Modal
        title="Payment Required"
        visible={isPaymentModalVisible}
        onOk={handlePaymentOk}
        onCancel={handlePaymentCancel}
        footer={[
          <Button key="back" onClick={handlePaymentCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handlePaymentOk}>
            Confirm Payment
          </Button>,
        ]}
      >
        <div>
          <p>Your wallet does not have enough balance to hire this tutor.</p>
          <p>Please make a payment to continue.</p>
          <PaymentOption>
            <PaymentImage src="https://static.mservice.io/img/logo-momo.png" alt="Payment Option" />
            <div>MoMo</div>
          </PaymentOption>
          <PaymentOption>
            <PaymentImage src="" alt="Payment Option" />
            <div>MASTER CARD</div>
          </PaymentOption>
        </div>
      </Modal>
      <Modal
        title="Rate Tutor"
        visible={isRatingModalVisible}
        onOk={handleRatingOk}
        onCancel={handleRatingCancel}
        footer={[
          <Button key="back" onClick={handleRatingCancel}>
            Close
          </Button>,
          <Button key="submit" type="primary" onClick={handleRatingOk}>
            Submit
          </Button>,
        ]}
      >
        <div>
          <p>Tutor Name: {firstName}</p>
          <div>
            <label>Rating: </label>
            <Rate value={rating} onChange={(value) => setRating(value)} />
          </div>
          <div>
            <label>Comment: </label>
            <Input.TextArea
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Type your comment..."
            />
          </div>
        </div>
      </Modal>
      <ChatBox
        visible={isChatModalVisible}
        onClose={handleChatClose}
        receiver={login}
      />
      <Modal
        title='Are you sure?'
        visible={isCancelModalVisible}
        onOk={handleCancelOk}
        onCancel={handleCancelCancel}
        footer={[
          <Button key='back' onClick={handleCancelCancel}>Close</Button>,
          <Button key='submit' type='primary' onClick={handleCancelOk}>Cancel</Button>,
        ]}
      >
        <p>Do you really want to cancel the hire?</p>
      </Modal>
    </CardContainer>
  );
};

export default TeacherCard;
