import { useEffect, useRef, useState } from "react";
import { capitalizeWords } from "../../../../services/helpers/helper";

import { useDarkMode } from "../../../../theme/useDarkMode";

interface LevelSelect {
  level: string;
  setLevel: (value: string) => void;
  levels: any;
}

const LevelSelect = ({ levels, level, setLevel }: LevelSelect) => {
  const { isDarkMode } = useDarkMode();
  const levelDropDown = useRef<any>(null);
  const [showDropDown, setShowDropDown] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        levelDropDown.current &&
        !levelDropDown.current.contains(event.target as Node)
      ) {
        setShowDropDown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const handleDropDownOpen = () => {
    if (levelDropDown.current) {
      setShowDropDown((prev) => !prev);
    }
  };

  return (
    <>
      <div className="   relative " ref={levelDropDown}>
        <div
          className="dark:bg-dark-background mobile:dark:bg-[#2A4436] mobile:bg-white  dark:text-[#6D6D6D] mobile:dark:text-white text-[.7rem] rounded-[.50rem] w-full p-[.43rem] h-fit pl-[.78rem] focus:border-0 focus:outline-none  min-w-[100px] relative  z-[20] flex justify-between items-center border-[1.4px] mobile:border-dashed mobile:border-2 mobile:border-[#00B152] border-[#656565]"
          onClick={handleDropDownOpen}
        >
          <div>
            <span className="text-[.95rem]">{capitalizeWords(level)}</span>
          </div>
          <div>
            <img src="/icons/dropDown.svg" alt="" />
          </div>
        </div>
        {showDropDown && (
          <div className="absolute right-0 w-full dark:bg-[#313131] bg-[white]  top-[110%]   left-[50%] translate-x-[-50%] z-[110] border-[1px]  border-[#656565] rounded-[.86rem] flex flex-col p-[.87rem] h-[6rem] overflow-y-auto scrollbar-thin ">
            {levels?.map((items: any) => (
              <div
                className={` cursor-pointer hover:text-[#AFFFD4]  ${
                  level == items
                    ? " text-primary"
                    : isDarkMode
                    ? "text-white "
                    : "text-black"
                }`}
                onClick={() => {
                  setLevel(items), setShowDropDown(false);
                }}
              >
                <span className=" text-[.78rem] mobile:text-[14px] font-[500]">
                  {capitalizeWords(items)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};
export default LevelSelect;
