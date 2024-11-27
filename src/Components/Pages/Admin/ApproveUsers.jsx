import React, { useEffect, useState } from 'react';
import { Table, Button, Modal } from 'antd';
import { getPendingUsers, approveUser, rejectUser } from '../../../api'; // Correct path to api.js
import { API_URL } from '../../../config';
import { getToken } from '../../Navbar/Navbar';

const ApproveUsers = () => {
  const [confirmData, setConfirmData] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/app-users/GetAllConfirming`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setConfirmData(data.map(user => ({ ...user, status: 'Pending' }))); // Thêm thuộc tính status
      }
    } catch (error) {
      console.error('Failed to fetch pending users:', error);
    }
  };

  const handleApprove = async (userId) => {
    const token = getToken("token");
    try {
      const response = await fetch(`${API_URL}/app-users/${userId}/ConFirmTutor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      if (response.ok) {
        setConfirmData(prevData => prevData.map(user =>
          user.appUserid === userId ? { ...user, status: 'OKE' } : user
        ));
      } else {
        throw new Error('Failed to confirm user.');
      }
    } catch (error) {
      console.error('Failed to confirm user:', error);
      alert('Failed to confirm user.');
    }
  };

  const handleReject = async (userId) => {
    const token = getToken("token");
    try {
      const response = await fetch(`${API_URL}/app-users/${userId}/RejectTutor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      if (response.ok) {
        setConfirmData(prevData => prevData.map(user =>
          user.appUserid === userId ? { ...user, status: 'Rejected' } : user
        ));
      } else {
        throw new Error('Failed to reject user.');
      }
    } catch (error) {
      console.error('Failed to reject user:', error);
      alert('Failed to reject user.');
    }
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    setSelectedUser(null);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedUser(null);
  };

  const columns = [
    { title: 'ID', dataIndex: 'appUserid', key: 'appUserid' },
    { title: 'Name', dataIndex: 'login', key: 'login' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text) => (
        <span>{text}</span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <>
          <Button
            type="primary"
            onClick={() => handleApprove(record.appUserid)}
            disabled={record.status !== 'Pending'}
          >
            Confirm
          </Button>
          <Button
            type="danger"
            onClick={() => handleReject(record.appUserid)}
            disabled={record.status !== 'Pending'}
          >
            Reject
          </Button>
          <Button onClick={() => handleViewDetails(record)}>
            View Details
          </Button>
        </>
      ),
    },
  ];

  return (
    <>
      <Table dataSource={confirmData} columns={columns} rowKey="appUserid" />
      {selectedUser && (
        <Modal
          title="Tutor Details"
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <p>Name: {selectedUser.login}</p>
          <p>Email: {selectedUser.email}</p>
          <p>University Graduate: {selectedUser.universityGraduate}</p>
          <p>Class: {selectedUser.class}</p>
          <p>Student ID: {selectedUser.studentId}</p>
          <p>Graduation Year: {selectedUser.graduationYear}</p>
          <p>Major: {selectedUser.major}</p>
          <p>Academic Rank: {selectedUser.academicRank}</p>
          <p>Identity Card: {selectedUser.identityCard}</p>
          <p>University Degree Certificate: {selectedUser.universityDegreeCertificate}</p>
          <p>Master Degree Certificate: {selectedUser.masterDegreeCertificate}</p>
          <p>Secondary Degree Certificate: {selectedUser.secondaryDegreeCertificate}</p>
        </Modal>
      )}
    </>
  );
};

export default ApproveUsers;