import React from "react";
import { Button } from "antd";
import "tailwindcss/tailwind.css";

const TeacherClasses = ({ teach }) => {
  return (
    <div className="flex justify-center my-4">
      {teach && teach.length > 0 && teach.map((className, index) => (
        <Button key={index} className="mx-1">
          {className.subject}
        </Button>
      ))}
    </div>
  );
};

export default TeacherClasses;
