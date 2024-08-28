import React from "react";

const Paddle = ({ x, y, width, height }) => {
  return (
    <div
      style={{
        position: "absolute",
        left: `${x}px`,
        top: `${y}px`,
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: "#000",
      }}
    />
  );
};

export default Paddle;
