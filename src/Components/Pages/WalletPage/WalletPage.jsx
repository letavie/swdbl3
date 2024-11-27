import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Tabs, Button, Modal, Form, Input, Select, Spin } from 'antd';
import { API_URL } from '../../../config';
import { getToken } from "../../../utils/common";
import { Link } from 'react-router-dom';

const { TabPane } = Tabs;
const { Option } = Select;


const WalletContainer = styled.div`
  width: 80%;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const MoneyContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
`;

const MoneyAmount = styled.span`
  font-size: 24px;
  font-weight: bold;
  color: #4caf50;
`;

const HistoryTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 30px;
`;

const TableHeader = styled.th`
  padding: 10px;
  background-color: #007bff;
  color: white;
  text-align: left;
  border: 1px solid #ddd;
`;

const TableData = styled.td`
  padding: 10px;
  border: 1px solid #ddd;
`;

const WalletPage = () => {

  const [transactions, setTransactions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [withdrawForm, setWithdrawForm] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const token = getToken("token")
        console.log('token', token);
        const response = await fetch(`${API_URL}/wallets/Historytransactions`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
        });
        if (!response.ok) {
          throw new Error('Network was not response ok');
        }
        console.log("response", response)
        const data = await response.json();
        setTransactions(data);
      }
      catch (err) {
        setTransactions(null);
      }
    })()
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const token = getToken("token")
        console.log('token', token)
        const response = await fetch(`${API_URL}/app-users/WithdrawForm`, {
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
        setWithdrawForm(data);
      } catch (err) {
        setWithdrawForm(null);
      }
    })()
  }, []);
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleFinish = async (values) => {
    try {
      const token = getToken("token");
      const response = await fetch(`${API_URL}/app-users/WithdrawForm/CreateApplication`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          appUserID: withdrawForm.appUserID, // Thay thế bằng giá trị thực tế
          amount: values.amount,
          bankName: withdrawForm.bankName, // Lấy từ state hoặc giá trị cứng (ví dụ: "Vietcombank")
          bankNumber: withdrawForm.bankNumber // Lấy từ state hoặc giá trị cứng (ví dụ: "0011001234567")
        })
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('Withdraw application sent successfully:', data);
      setIsModalVisible(false);
      window.location.reload();
      // Thực hiện các thao tác cần thiết sau khi gửi đơn rút tiền thành công
    } catch (err) {
      console.error('Error sending withdraw application:', err);
      // Xử lý lỗi nếu cần
    }
  };


  console.log("withdrawForm", withdrawForm)
  if (!transactions || !withdrawForm) return <></>

  return (
    <WalletContainer>
      <div style={{ marginBottom: '20px' }}>
        <Button type="primary" onClick={showModal} style={{ marginRight: '10px' }}>
          Withdrawal
        </Button>
        <Link to="/braintree">
          <Button type="primary">
            Deposit
          </Button>
        </Link>
      </div>
      <Modal title="Rút tiền" visible={isModalVisible} onCancel={handleCancel} footer={null}>
        <Form layout="vertical" onFinish={handleFinish}>
          <Form.Item label="Số tiền rút" name="amount" rules={[{ required: true, message: 'Vui lòng nhập số tiền cần rút!' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Bank Name" name="bankName" initialValue={withdrawForm.bankName}>
            <Input readOnly />
          </Form.Item>
          <Form.Item label="Bank Number" name="bankNumber" initialValue={withdrawForm.bankNumber}>
            <Input readOnly />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginLeft: '0px' }}>
              Send
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Current Money" key="1">
          <MoneyContainer>
            <span>Available Balance:</span>
            <MoneyAmount>{transactions.amount.toLocaleString()} đ</MoneyAmount>
          </MoneyContainer>
        </TabPane>
        <TabPane tab="Rental History" key="2">
          <HistoryTable>
            <thead>
              <tr>
                <TableHeader>Date</TableHeader>
                <TableHeader>Amount</TableHeader>
              </tr>
            </thead>
            <tbody>
              {transactions.hireTrans.map((item, index) => (
                <tr key={index}>
                  <TableData>{item.createAt}</TableData>
                  <TableData>{item.amount.toLocaleString()} đ</TableData>
                </tr>
              ))}
            </tbody>
          </HistoryTable>
        </TabPane>
        <TabPane tab="Deposit History" key="3">
          <HistoryTable>
            <thead>
              <tr>
                <TableHeader>Date</TableHeader>
                <TableHeader>Amount</TableHeader>
              </tr>
            </thead>
            <tbody>
              {transactions.depositTrans.map((item, index) => (
                <tr key={index}>
                  <TableData>{item.createAt}</TableData>
                  <TableData>{item.amount.toLocaleString()} đ</TableData>
                </tr>
              ))}
            </tbody>
          </HistoryTable>
        </TabPane>
      </Tabs>
    </WalletContainer>
  );
};

const TransactionHistory = () => {


};
export default WalletPage;
