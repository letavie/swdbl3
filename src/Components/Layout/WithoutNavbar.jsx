import React from "react";
import { Outlet } from "react-router-dom";

const WithoutNavbar = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default WithoutNavbar;
