import React, { useState } from 'react';
import { Table, Button, Modal, Popover, Tag } from 'antd';

const initialData = [
  {
    key: '1',
    tutorName: 'John Doe',
    numberOfReports: 5,
    reporters: ['Alice', 'Bob', 'Charlie'],
    status: 'Active',
  },
  {
    key: '2',
    tutorName: 'Jane Smith',
    numberOfReports: 3,
    reporters: ['Dave', 'Eve', 'Frank'],
    status: 'Inactive',
  },
  // Add more tutor data as needed
];

const CheckTutors = () => {
  const [data, setData] = useState(initialData);

  const handleBan = tutor => {
    Modal.confirm({
      title: `Do you want to ban ${tutor.tutorName}?`,
      onOk() {
        const newData = data.map(item =>
          item.key === tutor.key ? { ...item, status: 'Inactive' } : item
        );
        setData(newData);
        console.log(`Banned ${tutor.tutorName}`);
      },
    });
  };

  const handleUnban = tutor => {
    Modal.confirm({
      title: `Do you want to unban ${tutor.tutorName}?`,
      onOk() {
        const newData = data.map(item =>
          item.key === tutor.key ? { ...item, status: 'Active' } : item
        );
        setData(newData);
        console.log(`Unbanned ${tutor.tutorName}`);
      },
    });
  };

  const handleSendMail = tutor => {
    console.log(`Sent mail to ${tutor.tutorName}`);
    // Implement send mail functionality here
  };

  const columns = [
    {
      title: 'Tutor Name',
      dataIndex: 'tutorName',
      key: 'tutorName',
    },
    {
      title: 'Number of Reports',
      dataIndex: 'numberOfReports',
      key: 'numberOfReports',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: status => (
        <Tag color={status === 'Active' ? 'green' : 'red'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <>
          <Popover
            content={
              <ul>
                {record.reporters.map(reporter => (
                  <li key={reporter}>{reporter}</li>
                ))}
              </ul>
            }
            title="Reporters"
          >
            <Button>View Reports</Button>
          </Popover>
          <Button onClick={() => handleSendMail(record)} style={{ marginLeft: 10 }}>Send Mail</Button>
          {record.status === 'Active' ? (
            <Button
              onClick={() => handleBan(record)}
              style={{ marginLeft: 10, backgroundColor: 'red', color: 'white' }}
              size="large"
            >
              Ban
            </Button>
          ) : (
            <Button onClick={() => handleUnban(record)} style={{ marginLeft: 10 }}>
              Unban
            </Button>
          )}
        </>
      ),
    },
  ];

  return <Table columns={columns} dataSource={data} />;
};

export default CheckTutors;
