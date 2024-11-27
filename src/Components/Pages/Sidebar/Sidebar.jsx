import React, { useState } from "react";
import "./Sidebar.css";
import { Link } from "react-router-dom";
import signal_png from "../../Assets/signal.png";
import { API_URL } from "../../../config";

function Sidebar() {
  return (
    <div className="Sidebar">
      <h3>Subject</h3>
      <ul>
        <li>
          <Link to="/MathTeacher">
            <img src={signal_png} alt="Signal" />
            Math
          </Link>
        </li>
        <li>
          <Link to="/PhysicTeacher">
            <img src={signal_png} alt="Signal" />
            Physic
          </Link>
        </li>
        <li>
          <Link to="/ChemistryTeacher">
            <img src={signal_png} alt="Signal" />
            Chemistry
          </Link>
        </li>
        <li>
          <Link to="/EnglishTeacher">
            <img src={signal_png} alt="Signal" />
            English
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
