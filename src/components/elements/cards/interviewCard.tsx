import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useDarkMode } from "../../../theme/useDarkMode";
import CountdownTimer from "../counter/countDown";
import ChooseResumeModal from "../modals/chooseResumeModal";
import {
  GetLocalWithUTCDate,
  GetLocalWithUTCtime,
} from "../../../services/helpers/helper";
import { addMinutes, format } from "date-fns";
function InterviewCard({ item }: any) {
  const { isDarkMode } = useDarkMode();
  const [toggleChooseResumeModale, setToggleChooseResumeModale] =
    useState(false);
  const [selectedResume] = useState<{
    resumeName: string;
    resumeId: string;
  }>();
  // useEffect(() => {
  //     setSelectedResume({ resumeName: "GAUTHAM REGHU RESUME...", resumeId: "1" })
  // }, [])
  const handleChooseResume = () => {
    setToggleChooseResumeModale(true);
  };
  const buttonRef = useRef(null);
  const [isBlinking] = useState(false);
  // Example: Toggle blinking state
  // useEffect(() => {
  //     // Start blinking for 5 seconds as an example
  //     setIsBlinking(true);
  //     const timer = setTimeout(() => setIsBlinking(false), 5000);
  //     return () => clearTimeout(timer);
  // }, []);
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect((): any => {
    if (loaderRef.current) {
      const animation = gsap.to(loaderRef.current, {
        backgroundPositionX: "100%",
        duration: 1.2,
        repeat: -1,
        ease: "linear",
      });
      return () => animation.kill();
    }
  }, []);
  //   const formatDate = (date: string) => {
  //     return (
  //       date.split("T")[0].split("-")[2] +
  //       "/" +
  //       date.split("T")[0].split("-")[1] +
  //       "/" +
  //       date?.split("T")[0].split("-")[0].split("20")[1]
  //     );
  //   };
  const GetTimerStartTime = (utcDate: any) => {
    const offsetInMinutes = new Date().getTimezoneOffset();

    // Add the offset to the UTC date to get the correct local time
    const localDate = addMinutes(utcDate, -offsetInMinutes);
    return format(localDate, "yyyy-MM-dd'T'HH:mm:ss");
  };

  return (
    <>
      <div className="mt-[0.48rem] flex gap-[0.7rem] 2xl:gap-[1rem]">
        <div className="p-[0.87rem] 2xl:p-[1.2rem] h-[4.65217rem] w-full bg-[#F3F3F3] dark:bg-[#212325] rounded-[8px] flex justify-between items-center relative">
          {item == null ? (
            <>
              <div
                ref={loaderRef}
                className="w-full h-2 bg-gradient-to-r from-transparent dark:via-black via-white to-transparent bg-[length:300%_100%] bg-[#6d6d6d] rounded-full"
                style={{
                  backgroundSize: "300% 100%",
                }}
              ></div>
            </>
          ) : (
            <>
              <div className="border-[2px] h-[50px] top-[.96rem] rounded-full border-[#00B152] absolute"></div>
              <div className="dark:text-white ml-3">
                <div className="text-[0.6087rem]">
                  {GetLocalWithUTCDate(item?.startDateTime)}
                </div>
                <div className="text-[0.86957rem] font-semibold">
                  {GetLocalWithUTCtime(item?.startDateTime)}
                </div>
                <div className="text-[0.6087rem] text-[#A0A0A1]">
                  {item.duration}
                </div>
              </div>
              <div className="">
                <div className="dark:text-white text-[0.6087rem] font-semibold">
                  {item.stack}
                </div>
                <CountdownTimer
                  targetDate={GetTimerStartTime(item.startDateTime)}
                />
              </div>
              <div
                className="flex items-center gap-3  h-full  cursor-pointer"
                onClick={handleChooseResume}
              >
                {selectedResume ? (
                  <>
                    <div className="flex gap-2 items-center p-1 border-2 border-[#9FA0A1] rounded-[8px]">
                      <img src="/icons/resume-icon.svg" alt="" />
                      <div className="text-[0.6087rem] dark:text-white">
                        {selectedResume?.resumeName}
                      </div>
                      <div className="border h-[27px] border-[#9FA0A1]"></div>
                      <div className="flex gap-1 border-b border-[#00B152]">
                        <img src="/icons/edit.svg" alt="" />
                        <div className="text-[#00B152] text-[0.6087rem] ">
                          Edit
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-2 transition  hover:scale-105  duration-300">
                    <div>
                      {isDarkMode ? (
                        <img src="/icons/darkMode/CloudArrowUp.svg" alt="" />
                      ) : (
                        <img src="/icons/lightMode/CloudArrowUp.svg" alt="" />
                      )}
                    </div>
                    <div className="text-[0.6087rem] dark:text-white ">
                      Choose Resume
                    </div>
                  </div>
                )}
              </div>
              <div className="flex gap-[.52rem]">
                <button className="dark:text-white px-2 h-[1.26087rem] border dark:border-white border-[#1B1B1B] text-[0.6087rem]  rounded-lg w-[4.04348rem] flex justify-center items-center dark:hover:border-[#00B152] dark:hover:text-[#00B152] hover:border-[#00B152] hover:text-[#00B152] transition  hover:scale-105  duration-300">
                  Reshudule
                </button>
                <button
                  ref={buttonRef}
                  className={`flex h-[1.26087rem] gap-1 px-2 dark:text-white border dark:border-white/[30%]  border-[#1B1B1B] text-[0.6087rem] justify-center items-center rounded-lg ${
                    isBlinking ? "border-2 dark:bg-[#00B152]" : ""
                  }`}
                >
                  <div>
                    <img
                      src={
                        isDarkMode
                          ? "/icons/darkMode/video.svg"
                          : "/icons/lightMode/video.svg"
                      }
                      alt=""
                      className={`w-[0.92391rem] h-[0.63961rem] ${
                        isBlinking ? "opacity-[100%]" : "opacity-[30%]"
                      }`}
                    />
                  </div>
                  <div
                    className={`${
                      isBlinking
                        ? "dark:text-white"
                        : "dark:text-white/[30%] text-black/[30%]"
                    }`}
                  >
                    Join
                  </div>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      {toggleChooseResumeModale && (
        <ChooseResumeModal
          open={toggleChooseResumeModale}
          setOpen={setToggleChooseResumeModale}
        />
      )}
    </>
  );
}

export default InterviewCard;
