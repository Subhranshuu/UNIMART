import React, { useEffect, useState, useRef } from 'react';
import '../../styles/clock.css';

const Clock = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const intervalRef = useRef(null);

  useEffect(() => {
    const countdown = () => {
      const destination = new Date('Dec 31, 2025 23:59:59').getTime();

      intervalRef.current = setInterval(() => {
        const now = new Date().getTime();
        const difference = destination - now;

        if (difference <= 0) {
          clearInterval(intervalRef.current);
          setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        } else {
          setTimeLeft({
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / (1000 * 60)) % 60),
            seconds: Math.floor((difference / 1000) % 60),
          });
        }
      }, 1000);
    };

    countdown();
    
    return () => clearInterval(intervalRef.current); // Cleanup on unmount
  }, []);

  return (
    <div className="clock__wrapper d-flex align-items-center gap-3">
      {Object.entries(timeLeft).map(([unit, value], index) => (
        <div className="clock__data d-flex align-items-center gap-3" key={unit}>
          <div className="text-center">
            <h1 className="text-white fs-3 mb-2">{value}</h1>
            <h5 className="text-white fs-6">{unit.charAt(0).toUpperCase() + unit.slice(1)}</h5>
          </div>
          {index < 3 && <span className="text-white fs-3">:</span>}
        </div>
      ))}
    </div>
  );
};

export default Clock;
