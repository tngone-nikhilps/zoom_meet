import gsap from "gsap";
import { useEffect, useRef } from "react";
import { useDarkModeStore } from "../../../theme/store";
import { formatNumber } from "../../../services/helpers/helper";

interface RadioSelction {
  title: string;
  details: any;
  isSelected: boolean;
  onClick?: () => void;
}

const RadioSelection = ({
  title,
  details,
  isSelected,
  onClick,
}: RadioSelction) => {
  const container = useRef(null);
  const { isDarkMode } = useDarkModeStore();
  
  useEffect(() => {
    if (isSelected) {
      gsap.to(container.current, {
        borderColor: "#00B152",
        background: isDarkMode ? "rgba(0, 177, 82, 0.05)" : "white",
        color: "#00B152",
      });
    } else {
      gsap.to(container.current, {
        borderColor: "#656565",
        background: isDarkMode ? "#151515" : "#EFEFEF",
        color: "#6D6D6D",
      });
    }
  }, [isSelected, isDarkMode]);

  return (
    <>
      <div
        ref={container}
        className="dark:bg-dark-background bg-[#EFEFEF] mobile:w-full cursor-pointer dark:text-[#6D6D6D] text-[#333] rounded-[0.6em] pl-[.53em] p-[.29em]  flex flex-col w-fit border-[1px] border-[#6D6D6D] mobile:mt-2"
        onClick={onClick}
      >
        <div className="flex items-center justify-between text-[.86em] font-[700]">
          <div>
            <span>{title}</span>
          </div>
          <div className="ml-[22px]">
            <img
              src={
                !isSelected
                  ? "/icons/darkMode/unchecked.svg"
                  : "/icons/darkMode/radioSelected.svg"
              }
              alt=""
            />
          </div>
        </div>
        <div className="flex">
          <span className="text-[.76em]">
            {formatNumber(details)} interviews
          </span>
        </div>
      </div>
    </>
  );
};

export default RadioSelection;
