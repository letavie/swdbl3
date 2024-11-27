import React, { useState, useEffect } from 'react';
import { List, Button, Modal, Form, Input, Select, Table, message } from 'antd';
import { API_URL } from '../../../config';
import { getToken } from '../../../utils/common';

const { Option } = Select;

const ViewWithdrawalReports = () => {
    const [reports, setReports] = useState([]);
    const [selectedReport, setSelectedReport] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    // Fetch withdrawal reports from API using fetch
    useEffect(() => {
        const token = getToken("token")
        fetch(`${API_URL}/wallet-transactions/wallet-transactions/withdrawal-details`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        })
            .then(response => response.json())
            .then(data => {
                setReports(data);
            })
            .catch(error => {
                console.error('There was an error fetching the withdrawal reports!', error);
            });
    }, []);

    const handleReportClick = (report) => {
        setSelectedReport(report);
        setIsModalVisible(true);
    };

    const handleConfirmViewed = () => {
        setReports((prevReports) =>
            prevReports.map((report) =>
                report.appUserID === selectedReport.appUserID ? { ...report, viewed: true } : report
            )
        );
        setSelectedReport(null);
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setSelectedReport(null);
        setIsModalVisible(false);
    };

    const handleConfirmWithdraw = (withdrawId) => {
        const token = getToken("token")
        const url = `${API_URL}/wallet-transactions/wallet-transactions/${withdrawId}`;

        fetch(url, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => { throw new Error(text) });
                }
                return response.json();
            })
            .then(() => {
                setReports((prevReports) =>
                    prevReports.map((report) =>
                        report.withdrawTrans.id === withdrawId ? { ...report, withdrawTrans: { ...report.withdrawTrans, status: 'SUCCEED' } } : report
                    )
                );
                message.success('Transaction confirmed successfully!');
            })
            .catch(error => {
                console.error('There was an error confirming the withdraw!', error);
                message.error(`Failed to confirm transaction: ${error.message}`);
            });
    };

    const handleRejectWithdraw = (withdrawId) => {
        const token = getToken("token")
        const url = `${API_URL}/wallet-transactions/wallet-transactions/${withdrawId}/reject`;

        fetch(url, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => { throw new Error(text) });
                }
                return response.json();
            })
            .then(() => {
                setReports((prevReports) =>
                    prevReports.map((report) =>
                        report.withdrawTrans.id === withdrawId ? { ...report, withdrawTrans: { ...report.withdrawTrans, status: 'Rejected' } } : report
                    )
                );
                message.success('Transaction rejected successfully!');
            })
            .catch(error => {
                console.error('There was an error rejecting the withdraw!', error);
                message.error(`Failed to reject transaction: ${error.message}`);
            });
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'appUserID',
            key: 'appUserID',
        },
        {
            title: 'Last Name',
            dataIndex: 'lname',
            key: 'lname',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Amount',
            dataIndex: ['withdrawTrans', 'amount'],
            key: 'amount',
        },
        {
            title: 'Type',
            dataIndex: ['withdrawTrans', 'type'],
            key: 'type',
        },
        {
            title: 'Transaction Status',
            dataIndex: ['withdrawTrans', 'status'],
            key: 'transactionStatus',
        },
        {
            title: 'Created At',
            dataIndex: ['withdrawTrans', 'createAt'],
            key: 'createAt',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <div>
                    <Button
                        type="primary"
                        onClick={() => handleConfirmWithdraw(record.withdrawTrans.id)}
                        disabled={record.withdrawTrans.status !== 'VERIFING'}
                    >
                        Confirm
                    </Button>
                    <Button
                        type="danger"
                        onClick={() => handleRejectWithdraw(record.withdrawTrans.id)}
                        disabled={record.withdrawTrans.status !== 'VERIFING'}
                    >
                        Reject
                    </Button>
                    <Button onClick={() => handleReportClick(record)}>
                        View Withdrawal
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div>
            <h1>View Withdrawal Reports</h1>
            <Table dataSource={reports} columns={columns} rowKey="appUserID" />

            <Modal
                title="Rút tiền"
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={[
                    <Button key="back" onClick={handleCancel}>
                        Hủy
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleConfirmViewed}>
                        Confirm Viewed
                    </Button>,
                ]}
            >
                {selectedReport && (
                    <Form layout="vertical">
                        <Form.Item label="Last Name">
                            <Input value={selectedReport.lname} disabled />
                        </Form.Item>
                        <Form.Item label="Email">
                            <Input value={selectedReport.email} disabled />
                        </Form.Item>
                        <Form.Item label="Amount">
                            <Input value={selectedReport.withdrawTrans.amount} disabled />
                        </Form.Item>
                        <Form.Item label="Type">
                            <Input value={selectedReport.withdrawTrans.type} disabled />
                        </Form.Item>
                        <Form.Item label="Transaction Status">
                            <Input value={selectedReport.withdrawTrans.status} disabled />
                        </Form.Item>
                        <Form.Item label="Created At">
                            <Input value={selectedReport.withdrawTrans.createAt} disabled />
                        </Form.Item>
                    </Form>
                )}
            </Modal>
        </div>
    );
};

export default ViewWithdrawalReports;