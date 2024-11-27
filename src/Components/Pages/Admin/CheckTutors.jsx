import React, { useEffect, useState } from 'react';
import { Table, Button } from 'antd';
import { getTutors, deleteTutor } from '../../../api'; // Correct path to api.js

const CheckTutors = () => {
  const [tutors, setTutors] = useState([]);

  useEffect(() => {
    fetchTutors();
  }, []);

  const fetchTutors = async () => {
    const data = await getTutors();
    setTutors(data);
  };

  const handleDelete = (tutorId) => {
    deleteTutor(tutorId).then(() => fetchTutors());
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <Button onClick={() => handleDelete(record.id)}>Delete</Button>
      ),
    },
  ];

  return (
    <Table dataSource={tutors} columns={columns} />
  );
};

export default CheckTutors;
