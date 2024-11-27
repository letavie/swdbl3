import React, { useEffect, useState } from 'react';
import { Card, List, Typography, DatePicker, Button } from 'antd';
import moment from 'moment';
import { API_URL } from '../../../config';
import { formatCurrency, getToken } from '../../../utils/common';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const TotalIncome = () => {
  const [revenueData, setRevenueData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(moment());

  const fetchMonthlyRevenue = async (year, month) => {
    try {
      const token = getToken("token")
      const response = await fetch(`${API_URL}/wallet-transactions/financials/admin-monthly-revenue?year=${year}&month=${month}`, {
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
      setRevenueData(data);
    } catch (error) {
      console.error('Error fetching monthly revenue:', error);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleFetchData = () => {
    const year = selectedDate.year();
    const month = selectedDate.month() + 1; // month() returns 0-11, so add 1
    fetchMonthlyRevenue(year, month);
  };

  return (
    <Card title="Monthly Revenue" style={{ width: '100%' }}>
      <div style={{ marginBottom: '16px' }}>
        <DatePicker
          picker="month"
          onChange={handleDateChange}
          value={selectedDate}
        />
        <Button type="primary" onClick={handleFetchData} style={{ marginLeft: '8px' }}>
          Search
        </Button>
      </div>
      {revenueData ? (
        <>
          <Title level={4}>Total Revenue: {revenueData.totalRevenue.toLocaleString()} đ</Title>
          <List
            bordered
            dataSource={revenueData.transactions}
            renderItem={(transaction) => (
              <List.Item>
                <List.Item.Meta
                  title={`Transaction ID: ${transaction.id}`}
                  description={
                    <>
                      <Text>Amount: {transaction.amount.toLocaleString()} đ</Text><br />
                      <Text>Type: {transaction.type}</Text><br />
                      <Text>Status: {transaction.status}</Text><br />
                      <Text>Date: {transaction.createAt}</Text>
                    </>
                  }
                />
              </List.Item>
            )}
          />
        </>
      ) : (
        <Text>Loading...</Text>
      )}
    </Card>
  );
};

export default TotalIncome;
