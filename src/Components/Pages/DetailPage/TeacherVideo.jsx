import React from "react";

const TeacherVideo = ({ videoUrl }) => {
  return (
    <div className="mt-8 w-full max-w-[1100px]">
      <h2 className="text-2xl font-semibold mb-8">Introduce video</h2>
      <div className="relative" style={{ paddingBottom: "30%", height: 0 }}>
        <iframe
          className="absolute top-0 left-0 w-full h-full"
          width="560"
          height="315"
          src={videoUrl}
          title="Introduction Video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default TeacherVideo;
