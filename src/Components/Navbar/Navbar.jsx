import React, { useEffect, useState } from "react";
import { Menu, Dropdown, Button, Avatar, Badge } from "antd";
import {
  UserOutlined,
  SettingOutlined,
  WalletOutlined,
  LogoutOutlined,
  ProfileOutlined,
  ScheduleOutlined,
  BellOutlined,
} from "@ant-design/icons";
import { BiSolidWallet } from "react-icons/bi";
import logo from "../Assets/logo1.png";
import styled from "styled-components";

import "./Navbar.css";
import { Link } from "react-router-dom";
import { API_URL } from "../../config";
import { useAuthContext } from "../Contexts/AuthContext";
import { convertLegacyProps } from "antd/es/button";

export const getToken = (name) => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

const NavbarContainer = styled.div`
  width: 80%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #fff;
  border-bottom: 1px solid #eaeaea;
`;

const NavLogo = styled.div`
  display: flex;
  align-items: center;
  img {
    height: 70px;
  }
`;

const NavMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const NavButton = styled(Button)`
  height: 40px;
  font-size: 16px;
`;

const UserButton = styled(Button)`
  height: 47px;
  font-size: 16px;
`;

const WalletBalance = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background-color: #f5f5f5;
  border-radius: 8px;
`;

function Navbar() {
  const auth = useAuthContext();
  const [token, setToken] = useState(null);
  const [profileData, setProfileData] = useState(null);

  const handleLogout = () => {
    setToken(null);
    document.cookie = "token" + "=; Max-Age=-99999999;";
    window.history.pushState({}, "", "/");
    window.location.reload();
  };

  useEffect(() => {
    const token = getToken("token");
    setToken(token);
    (async () => {
      const response = await fetch(`${API_URL}/app-users/GetCurrentAppUser`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response && response.ok) {
        const data = await response.json();
        console.log(data);
        setProfileData(data);
        auth?.login(data?.user);
      } else {
        setProfileData(null);
      }
    })();
  }, []);

  const handleLogin = () => {
    if (!token) {
      window.history.pushState({}, "", "/login");
      window.dispatchEvent(new PopStateEvent("popstate"));
    } else {
      document.cookie = "token" + "=; Max-Age=-99999999;";
      window.history.pushState({}, "", "/");
      window.location.reload();
    }
  };

  return (
    <NavbarContainer>
      <NavLogo>
        <Link to="/">
          <img src={logo} alt="Logo" />
        </Link>
      </NavLogo>
      <NavMenu>
        {token && profileData && profileData.wallet && (
          <>
            <Link to="/wallet">
              <WalletBalance>
                <WalletOutlined />
                <span>{profileData.wallet.amount.toLocaleString()} đ</span>
              </WalletBalance>
            </Link>
          </>
        )}
        {token && profileData && profileData?.user ? (
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item key="1" icon={<SettingOutlined />}>
                  <Link to="/UserProfile">Profile Settings</Link>
                </Menu.Item>
                <Menu.Item key="2" icon={<ProfileOutlined />}>
                  <Link to="/TutorProfile">Tutor Profile</Link>
                </Menu.Item>
                <Menu.Item key="3" icon={<ScheduleOutlined />}>
                  <Link to="/ScheduleProfile">Schedule Profile</Link>
                </Menu.Item>
                <Menu.Item key="4" icon={<WalletOutlined />}>
                  <Link to="/wallet">My Wallet</Link>
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                  key="5"
                  icon={<LogoutOutlined />}
                  onClick={handleLogout}
                >
                  <p className="font-semibold text-cyan-700">Logout</p>
                </Menu.Item>
              </Menu>
            }
            trigger={["click"]}
          >
            <UserButton>
              <Avatar
                style={{ backgroundColor: "rgb(14 116 144)" }}
                icon={<UserOutlined />}
              />
              <span className="ml-2 font-semibold text-cyan-700">
                {profileData.user.lastName}
              </span>
            </UserButton>
          </Dropdown>
        ) : (
          <>
            <Link to="/login">
              <NavButton type="primary" onClick={handleLogin}>
                Login
              </NavButton>
            </Link>
            <Link to="/register">
              <NavButton>Sign Up</NavButton>
            </Link>
          </>
        )}
      </NavMenu>
    </NavbarContainer>
  );
}

export default Navbar;
