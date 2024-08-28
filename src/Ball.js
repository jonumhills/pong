import React from "react";

const Ball = ({ x, y, size }) => {
  return (
    <div
      style={{
        position: "absolute",
        left: `${x}px`,
        top: `${y}px`,
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: "#000",
        borderRadius: "50%",
      }}
    />
  );
};

export default Ball;
