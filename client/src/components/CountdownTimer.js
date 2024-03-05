import React, { useState, useEffect } from "react";
import "./CountdownTimer.css"; // Import CountdownTimer.css for styling (if needed)

const CountdownTimer = ({ targetDate, status }) => {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  function getTimeLeft() {
    const totalTimeLeft = new Date(targetDate) - new Date();
    if (status === "rejected" || totalTimeLeft <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    const days = Math.floor(totalTimeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((totalTimeLeft / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((totalTimeLeft / (1000 * 60)) % 60);
    const seconds = Math.floor((totalTimeLeft / 1000) % 60);
    return { days, hours, minutes, seconds };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [targetDate, status]);

  return (
    <div className="countdown">
      <div className="content">
        {Object.entries(timeLeft).map((el) => {
          const label = el[0];
          const value = el[1];
          return (
            <div className="box" key={label}>
              <div className="value">
                <span>{value < 10 ? `0${value}` : value}</span>
              </div>
              <span className="label dark"> {label} </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CountdownTimer;