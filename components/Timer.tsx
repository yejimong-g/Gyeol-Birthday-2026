import React, { useState } from "react";
import useTimer from "../hooks/useTimer";
import Image from "next/image";

const Timer = () => {
  const { day, hours, minutes, seconds } = useTimer();
  const [showImage, setShowImage] = useState(false);

  const onClick = () => {
    // Check if countdown is finished
    if (day === 0 && hours === 0 && minutes === 0 && seconds === 0) {
      setShowImage(true);
    } else {
      alert("아직 생일 아니다! 🎁");
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 py-8 bg-purple1 shadow-md rounded-lg w-[70%]">
      <span className="font-kangwon-bold text-xl text-white">~ 선물까지 ~</span>
      <span className="font-kangwon-bold text-3xl text-white">
        {day}일 {hours}시간 {minutes}분 {seconds}초
      </span>
      <button
        onClick={onClick}
        className="w-[40%] py-2 bg-purple2 text-white rounded-full shadow-md font-kangwon-bold"
      >
        선물 받으러 가기
      </button>

      {/* Show birthday image when time is up */}
      {showImage && (
        <div className="mt-8">
          <Image
            src="/bday.png" // make sure bday.png is in public folder
            alt="Happy Birthday!"
            width={400}
            height={400}
          />
        </div>
      )}
    </div>
  );
};

export default Timer;
