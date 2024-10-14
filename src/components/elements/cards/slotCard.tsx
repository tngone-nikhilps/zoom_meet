import gsap from "gsap";
import { useEffect, useRef } from "react";
import { formatCurrency } from "../../../services/helpers/helper";
import useConfigStore from "../../../configStore/store";

interface SlotCardProps {
  onClick?: () => void;
  isLoading: boolean;
  slotTime: string;
  slotDuration: string;
  slotStatus: "limited" | "filled" | "available";
  slotActualPrice: number;
  slotDiscountPrice: string;
}

const SlotCard = ({
  isLoading,
  slotTime,
  slotDuration,
  slotStatus,
  slotActualPrice,
  onClick,
}: SlotCardProps) => {
  const loaderRef = useRef<HTMLDivElement>(null);
  const { selectedCountry } = useConfigStore();
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

  return (
    <>
      <div className="w-full px-[1.21rem] mobile:px-2 mt-[.78rem] h-[4.13rem] border-[1.8px] border-[#444] dark:bg-[#1F1F1F] bg-white rounded-[.86rem] mobile:rounded-[8px] relative flex justify-between text-black dark:text-white items-center">
        {isLoading ? (
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
            <div className="absolute left-[-3px] top-[50%] translate-y-[-50%]">
              <img
                src={
                  slotStatus == "limited"
                    ? "/icons/limitedStatus.svg"
                    : slotStatus == "available"
                    ? "/icons/availableStatus.svg"
                    : "/icons/filledStatus.svg"
                }
                alt=""
                className="mobile:w-1/2"
              />
            </div>
            <div
              className={`flex ${
                slotStatus == "filled" ? "text-[#7D7D7D]" : ""
              }`}
            >
              <div className="">
                <div className="flex gap-[0.56rem]">
                  <span className="text-[clamp(0.5rem,5vw,.8rem)] font-[500]  mobile:font-semibold">
                    {slotTime}
                  </span>
                  <div className=" items-center gap-[.14rem] text-[.52174rem] hidden mobile:flex">
                    <div
                      className={`w-[.6rem] h-[.6rem] rounded-full ${
                        slotStatus == "limited"
                          ? " bg-[#FCC83B]"
                          : slotStatus == "available"
                          ? " bg-[#1EA83C]"
                          : " bg-[#7F7F7F]"
                      }`}
                    ></div>
                    <div
                      className={` ${
                        slotStatus == "filled" ? "text-[#7D7D7D]" : ""
                      } text-[12px]`}
                    >
                      <span>
                        {slotStatus == "limited"
                          ? "Limited"
                          : slotStatus == "available"
                          ? "Available"
                          : "Filled"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-[clamp(0.5rem,5vw,.7rem)] mobile:text-[13px] mobile:opacity-[35%] flex">
                  <div>
                    <span>Duration</span>
                  </div>
                  <div className="ml-[.43rem]">
                    <span>{slotDuration} </span>
                  </div>
                </div>
              </div>
              <div className="ml-[3.3rem] flex items-center text-[clamp(0.5rem,5vw,.8rem)] mobile:hidden">
                <div
                  className={`w-[.6rem] h-[.6rem] rounded-full${
                    slotStatus == "limited"
                      ? " bg-[#FCC83B]"
                      : slotStatus == "available"
                      ? " bg-[#1EA83C]"
                      : " bg-[#7F7F7F]"
                  }`}
                ></div>
                <div
                  className={`ml-[.34rem] ${
                    slotStatus == "filled" ? "text-[#7D7D7D]" : ""
                  } `}
                >
                  <span>
                    {slotStatus == "limited"
                      ? "Limited"
                      : slotStatus == "available"
                      ? "Available"
                      : "Filled"}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex">
              <div className="text-[clamp(0.5rem,5vw,.8rem)] flex items-center mr-[1.69rem] mobile:mr-0">
                <div>
                  <span className="text-[#909090] text-[400]">
                    {formatCurrency(slotActualPrice, selectedCountry)}
                  </span>
                </div>
                <div className="ml-[.69rem]">
                  <span
                    className={`font-[500 ${
                      slotStatus == "filled" ? "text-[#7D7D7D]" : ""
                    }`}
                  >
                    {/* ${slotDiscountPrice} */}
                  </span>
                </div>
              </div>
              <div
                className={`${
                  slotStatus == "filled"
                    ? "bg-[#2E2E2E] line-through text-[#7D7D7D] cursor-not-allowed"
                    : "bg-[#0E0E0E] text-white cursor-pointer"
                }  rounded-[1.13rem] mobile:rounded-[12px] py-[.63rem] font-[700] text-[.7rem] mobile:text-[0.6087rem] flex justify-center w-[7.17rem] mobile:w-[4.47826rem] r`}
                onClick={slotStatus == "filled" ? () => {} : onClick}
              >
                <span className="text ">Book Now</span>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default SlotCard;
