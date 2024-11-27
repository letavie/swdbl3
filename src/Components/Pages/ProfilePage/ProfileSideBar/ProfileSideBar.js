import React, { useState } from 'react';
import { Collapse } from 'react-collapse';
import { Link } from 'react-router-dom';
import './ProfileSideBar.css';

function ProfileSideBar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleAccount = () => {
    setIsAccountOpen(!isAccountOpen);
  };

  return (
    <div className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
      <div className="toggle-button" onClick={toggleSidebar}>
        {isSidebarOpen ? '<<' : '>>'}
      </div>
      {isSidebarOpen && (
        <>
          <div className="tab" onClick={toggleAccount}>
            Account
          </div>
          <Collapse isOpened={isAccountOpen}>
            <ul className="list">
              <li className="list-item">
                <Link to="/UserProfile">User Profile</Link>
              </li>
              <li className="list-item">
                <Link to="/TutorProfile">Tutor Profile</Link>
              </li>
              <li className="list-item">
                <Link to="/ScheduleProfile">Schedule Profile</Link>
              </li>
              <li className="list-item">
                <Link to="/wallet">Wallet</Link>
              </li>
              <li className="list-item">
                <Link to="/IdentityCard">Identity Card</Link>
              </li>
            </ul>
          </Collapse>
        </>
      )}
    </div>
  );
}

export default ProfileSideBar;
