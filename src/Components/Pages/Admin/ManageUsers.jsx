import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Select } from 'antd';
import { getUsers, addUser, editUser, deleteUser } from '../../../api'; // Đường dẫn đúng tới api.js

const { Option } = Select;

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const data = await getUsers();
    setUsers(data);
  };

  const handleAdd = () => {
    setIsModalVisible(true);
  };

  const handleEdit = (userId) => {
    // Logic để mở modal edit và set giá trị vào form
    const userToEdit = users.find(user => user.appUserID === userId);
    form.setFieldsValue(userToEdit);
    setIsModalVisible(true);
  };

  const handleDelete = (userId) => {
    // Logic để xử lý xóa user
    deleteUser(userId).then(() => fetchUsers());
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        // Xử lý logic thêm hoặc sửa user dựa vào giá trị của form
        console.log('Received values:', values);
        setIsModalVisible(false);
        form.resetFields();
        // Gọi lại fetchUsers() để cập nhật danh sách người dùng sau khi thao tác
        fetchUsers();
      })
      .catch((errorInfo) => {
        console.log('Validate Failed:', errorInfo);
      });
  };

  const columns = [
    { title: 'ID', dataIndex: 'appUserID', key: 'appUserID' },
    { title: 'First Name', dataIndex: 'fname', key: 'fname' },
    { title: 'Last Name', dataIndex: 'lname', key: 'lname' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Gender', dataIndex: 'gender', key: 'gender' },
    { title: 'Wallet', dataIndex: 'amount', key: 'amount' },
    { title: 'Role', dataIndex: 'role', key: 'role', render: roles => roles.map(role => role.name).join(', ') }, // Render multiple roles
    {
      title: 'Actions', key: 'actions', render: (text, record) => (
        <>
          <Button onClick={() => handleEdit(record.appUserID)}>Edit</Button>
          <Button onClick={() => handleDelete(record.appUserID)}>Delete</Button>
        </>
      ),
    },
  ];

  return (
    <>
      <Button type="primary" onClick={handleAdd}>Add User</Button>
      <Table dataSource={users} columns={columns} />

      <Modal
        title="Add/Edit User"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item name="fname" label="First Name" rules={[{ required: true, message: 'Please enter first name' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="lname" label="Last Name" rules={[{ required: true, message: 'Please enter last name' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Please enter email' }, { type: 'email', message: 'Invalid email format' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="gender" label="Gender" rules={[{ required: true, message: 'Please select gender' }]}>
            <Select>
              <Option value="MALE">Male</Option>
              <Option value="FEMALE">Female</Option>
              <Option value="OTHER">Other</Option>
            </Select>
          </Form.Item>
          <Form.Item name="amount" label="Wallet" rules={[{ required: true, message: 'Please enter wallet amount' }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="role" label="Role" rules={[{ required: true, message: 'Please select role' }]}>
            <Select mode="multiple">
              <Option value="ROLE_TUTOR">Tutor</Option>
              <Option value="ROLE_USER">User</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ManageUsers;
