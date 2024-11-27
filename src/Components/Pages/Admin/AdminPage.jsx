import React from 'react';
import { Layout, Menu, Breadcrumb, Modal, Button } from 'antd';
import { DollarOutlined, UserOutlined, FileSearchOutlined, CheckOutlined, TeamOutlined, MoneyCollectOutlined } from '@ant-design/icons';
import TotalIncome from './TotalIncome';
import ManageUsers from './ManageUsers';
import ViewReports from './ViewReports';
import CheckTutors from './CheckTutors';
import ApproveUsers from './ApproveUsers';
import ViewWithdrawalReports from './ViewWithdrawalReports';

const { Header, Content, Footer, Sider } = Layout;

class AdminPage extends React.Component {
  state = {
    collapsed: false,
    selectedMenu: '1',
  };

  onCollapse = collapsed => {
    this.setState({ collapsed });
  };

  handleMenuClick = e => {
    this.setState({ selectedMenu: e.key });
  };

  renderContent = () => {
    switch (this.state.selectedMenu) {
      case '1':
        return <TotalIncome />;
      case '2':
        return <ManageUsers />;
      case '3':
        return <ViewReports />;
      case '4':
        return <CheckTutors />;
      case '5':
        return <ApproveUsers />;
      case '6':
        return <ViewWithdrawalReports />;
      default:
        return <TotalIncome />;
    }
  };

  render() {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
          <div className="logo" />
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" onClick={this.handleMenuClick}>
            <Menu.Item key="1" icon={<DollarOutlined />}>
              Total Income
            </Menu.Item>
            <Menu.Item key="2" icon={<UserOutlined />}>
              Manage Users
            </Menu.Item>
            <Menu.Item key="3" icon={<FileSearchOutlined />}>
              View Reports
            </Menu.Item>
            <Menu.Item key="4" icon={<CheckOutlined />}>
              Check Tutors
            </Menu.Item>
            <Menu.Item key="5" icon={<TeamOutlined />}>
              Approve Users
            </Menu.Item>
            <Menu.Item key="6" icon={<MoneyCollectOutlined />}>
              View Withdrawal Reports
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Header className="site-layout-background" style={{ padding: 0 }} />
          <Content style={{ margin: '0 16px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>Admin</Breadcrumb.Item>
              <Breadcrumb.Item>{this.state.selectedMenu}</Breadcrumb.Item>
            </Breadcrumb>
            <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
              {this.renderContent()}
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>Admin Dashboard ©2024</Footer>
        </Layout>
      </Layout>
    );
  }
}

export default AdminPage;
