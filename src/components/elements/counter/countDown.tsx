import { useEffect, useState } from "react";

const CountdownTimer = ({ targetDate }: any) => {
  const calculateTimeLeft = (date: any) => {
    const now = new Date();
    const then = new Date(date);
    const diff = (then.getTime() - now.getTime()) / 1000; // Difference in seconds

    if (diff <= 0) {
      return "0";
    }

    const days = Math.floor(diff / 86400);
    const hours = Math.floor((diff % 86400) / 3600);
    const minutes = Math.floor((diff % 3600) / 60);
    const seconds = Math.floor(diff % 60);

    if (days > 0) {
      return `in ${days} days ${hours}h`;
    } else if (hours > 0) {
      return `in ${hours}h ${minutes}m `;
    } else if (minutes > 0) {
      return `in ${minutes}m ${seconds}s`;
    } else {
      return `in ${seconds}s`;
    }
  };
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetDate));

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    // Cleanup on component unmount
    return () => clearInterval(intervalId);
  }, [targetDate]);

  return (
    <div className="flex bg-[#D6FFEA] text-[#00B152] text-[0.6087rem] justify-center items-center rounded gap-1 p-[0.26rem] mt-2">
      <div>
        <img src="/icons/clock.svg" alt="" />
      </div>
      <div>{timeLeft}</div>
    </div>
  );
};

export default CountdownTimer;
