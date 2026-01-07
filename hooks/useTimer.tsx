import { useEffect, useState } from "react";

const useTimer = () => {
  // Jan 8, 2026 @ 12:00 AM CST
  const targetDate = new Date("2026-01-08T00:00:00-06:00");

  const [day, setDay] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const distance = targetDate.getTime() - now.getTime();

      if (distance <= 0) {
        clearInterval(interval);
        setDay(0);
        setHours(0);
        setMinutes(0);
        setSeconds(0);
        return;
      }

      setDay(Math.floor(distance / (1000 * 60 * 60 * 24)));
      setHours(
        Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      );
      setMinutes(
        Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      );
      setSeconds(Math.floor((distance % (1000 * 60)) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return { day, hours, minutes, seconds };
};

export default useTimer;
