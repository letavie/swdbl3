import React from "react";
import { Rate, Pagination } from "antd";

const TeacherFeedback = ({ ratings }) => {
  console.log("ratings", ratings);
  return (
    <div className="mt-8 w-full max-w-[1100px]">
      <h2 className="text-2xl font-semibold my-8">Feedback</h2>
      <div className="space-y-4 mx-4">
        {ratings && ratings.length > 0 && ratings.map((rating, index) => (
          <div key={index} className="flex justify-between items-start p-4 border rounded shadow-sm">
            <div className="flex items-center space-x-4">
              <img
                src={rating.img}
                alt={`${rating.firstName} ${rating.lastName}`}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h3 className="font-bold text-gray-700">{`${rating.lastName}`}</h3>
                <p className="text-sm text-gray-500">{rating.date}</p>
                <p className="my-2">{rating.comment}</p>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <Rate disabled defaultValue={rating.rating} />
              <span className="text-sm text-gray-500">{`(thuê ${rating.hours} giờ)`}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-center">
        <Pagination defaultCurrent={1} total={ratings.length} pageSize={5} />
      </div>
    </div>
  );
};

export default TeacherFeedback;
