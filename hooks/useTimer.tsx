import React, { useEffect, useState } from "react";

const useTimer = () => {
  const setDate = new Date("2026-01-08T00:00:00-06:00")

  const now = new Date();

  const distance = setDate.getTime() - now.getTime();

  const [day, setDay] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDay(Math.floor(distance / (1000 * 60 * 60 * 24)));
      setHours(
        Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      );
      setMinutes(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));
      setSeconds(Math.floor((distance % (1000 * 60)) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [distance]);
  return { day, hours, minutes, seconds };
};

export default useTimer;
