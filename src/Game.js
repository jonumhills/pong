import React, { useState, useEffect, useRef } from "react";
import Paddle from "./Paddle";
import Ball from "./Ball";

const Game = () => {
  let speed = 1;
  const [paddle1Position, setPaddle1Position] = useState(50);
  const [paddle2Position, setPaddle2Position] = useState(50);
  const [ballPosition, setBallPosition] = useState({ x: 50, y: 200 });
  const [ballDirection, setBallDirection] = useState({ x: speed, y: speed });
  const [score, setScore] = useState({ player1: 0, player2: 0 });
  const [bhit, setBhit] = useState(1);

  const gameRef = useRef(null);

  const gameHeight = 500;
  const gameWidth = 800;
  const paddleHeight = 100;
  const paddleWidth = 10;
  const ballSize = 20;

  // Handle paddle movement
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "ArrowUp") {
        setPaddle1Position((pos) => Math.max(pos - 10, 0));
      } else if (event.key === "ArrowDown") {
        setPaddle1Position((pos) =>
          Math.min(pos + 10, gameHeight - paddleHeight)
        );
      } else if (event.key === "w") {
        setPaddle2Position((pos) => Math.max(pos - 10, 0));
      } else if (event.key === "s") {
        setPaddle2Position((pos) =>
          Math.min(pos + 10, gameHeight - paddleHeight)
        );
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  // Ball movement and collision detection
  useEffect(() => {
    const interval = setInterval(() => {
      setBallPosition((prevPosition) => {
        const nextX = prevPosition.x + ballDirection.x;
        const nextY = prevPosition.y + ballDirection.y;

        // Bounce off bottom
        if (nextY >= gameHeight - ballSize) {
          if (bhit === 1) {
            setBallDirection({ x: speed, y: -speed });
          } else setBallDirection({ x: -speed, y: -speed });
        }

        // Bounce off top
        if (nextY <= 0) {
          if (bhit === 1) {
            setBallDirection({ x: speed, y: speed });
          } else setBallDirection({ x: -speed, y: speed });
        }

        // Paddle collision with paddle1 (left paddle)
        if (
          nextX <= paddleWidth && // ball is at or past the left edge
          nextY >= paddle1Position && // ball is within the top of paddle1
          nextY <= paddle1Position + paddleHeight // ball is within the bottom of paddle1
        ) {
          setBallDirection((dir) => ({ ...dir, x: Math.abs(dir.x) })); // Ensure ball moves to the right
          setBhit(1);
        }
        // Paddle collision with paddle2 (right paddle)
        else if (
          nextX >= gameWidth - paddleWidth - ballSize && // ball is at or past the right edge
          nextY >= paddle2Position && // ball is within the top of paddle2
          nextY <= paddle2Position + paddleHeight // ball is within the bottom of paddle2
        ) {
          setBallDirection((dir) => ({ ...dir, x: -Math.abs(dir.x) })); // Ensure ball moves to the left
          setBhit(2);
        }

        // Scoring logic
        if (nextX <= 0) {
          setScore((prevScore) => ({
            ...prevScore,
            player2: prevScore.player2 + 1,
          }));
          return { x: gameWidth / 2, y: gameHeight / 2 }; // Reset ball to center
        } else if (nextX >= gameWidth - ballSize) {
          setScore((prevScore) => ({
            ...prevScore,
            player1: prevScore.player1 + 1,
          }));
          return { x: gameWidth / 2, y: gameHeight / 2 }; // Reset ball to center
        }
        speed = Math.max(2, (score.player1 + score.player2) / 2);
        return { x: nextX, y: nextY };
      });
    }, 20);

    return () => clearInterval(interval);
  }, [ballDirection, paddle1Position, paddle2Position, bhit]);

  return (
    <div
      ref={gameRef}
      style={{
        position: "relative",
        width: `${gameWidth}px`,
        height: `${gameHeight}px`,
        border: "2px solid #000",
        background: "#eee",
      }}
    >
      <Paddle
        x={0}
        y={paddle1Position}
        height={paddleHeight}
        width={paddleWidth}
      />
      <Paddle
        x={gameWidth - paddleWidth}
        y={paddle2Position}
        height={paddleHeight}
        width={paddleWidth}
      />
      <Ball x={ballPosition.x} y={ballPosition.y} size={ballSize} />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        {score.player1} - {score.player2}
      </div>
    </div>
  );
};

export default Game;
