import { useEffect, useRef, useState } from "react";
import useConfigStore from "../../../../configStore/store";
import { capitalizeWords } from "../../../../services/helpers/helper";

import { useDarkMode } from "../../../../theme/useDarkMode";

interface TimeZoneSelect {
  timeZone: any;
  setTimeZone: (value: any) => void;
}

const TimeZoneSelect = ({ timeZone, setTimeZone }: TimeZoneSelect) => {
  const { isDarkMode } = useDarkMode();

  const timeZoneDropDown = useRef<any>(null);
  const [showDropDown, setShowDropDown] = useState(false);
  const { timezones, selectedCountry } = useConfigStore();
  useEffect(() => {
    setTimeZone(timezones ? timezones[0] : null);
    const handleClickOutside = (event: MouseEvent) => {
      if (
        timeZoneDropDown.current &&
        !timeZoneDropDown.current.contains(event.target as Node)
      ) {
        setShowDropDown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  useEffect(() => {
    setTimeZone(selectedCountry.timeZone ? selectedCountry.timeZone[0] : null);
  }, [selectedCountry]);
  const handleDropDownOpen = () => {
    if (timeZoneDropDown.current) {
      setShowDropDown((prev) => !prev);
    }
  };

  return (
    <>
      <div className="   relative " ref={timeZoneDropDown}>
        <div
          className="w-full h-[2.17rem] mobile:h-[42px] dark:bg-[#313131] mobile:dark:bg-[#2A4436] mobile:bg-white  border-[1.8px] mobile:border-2 border-[#656565] mobile:border-[#00B152] mobile:dark:border-dashed mobile:border-dashed dark:border-none px-[.69rem] flex items-center rounded-[.78rem] mt-[.47rem]"
          onClick={handleDropDownOpen}
        >
          <div>
            <img src="/icons/darkMode/timeZone.svg" alt="" />
          </div>
          <div>
            <span className="dark:text-dark-text text-black font-[500] text-[.6rem] mobile:text-[14px] ml-[.65rem]">
              {capitalizeWords(timeZone?.split("|")[0])?.length > 25
                ? timeZone?.split("|")[0]?.slice(0, 25) + "..."
                : timeZone?.split("|")[0]}
            </span>
          </div>
        </div>
        {showDropDown && (
          <div className="absolute right-0 w-full dark:bg-[#313131] bg-white text-black top-[110%]   left-[50%] translate-x-[-50%] z-[110] border-[1px]  border-[#656565] rounded-[.86rem] flex flex-col p-[.8rem] h-[8.3rem] overflow-y-auto scrollbar-thin ">
            {timezones?.map((items: any) => (
              <div
                className={` cursor-pointer dark:hover:text-[#AFFFD4] hover:text-[#656565] ${
                  timeZone == items
                    ? " text-primary"
                    : isDarkMode
                    ? "text-white"
                    : "text-black "
                }`}
                onClick={() => {
                  setTimeZone(items), setShowDropDown(false);
                }}
              >
                <span className=" text-[.6rem] mobile:text-[14px] font-[500]">
                  {capitalizeWords(items.split("|")[0])}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};
export default TimeZoneSelect;
