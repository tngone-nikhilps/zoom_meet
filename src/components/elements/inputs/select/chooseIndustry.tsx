import { useEffect, useRef, useState } from "react";
import { useDarkMode } from "../../../../theme/useDarkMode";

interface IndustrySelect {
  industry: any;
  setIndustry: (value: any) => void;
  industries: any;
  setPopupSpecialization: (value: any) => void;
}

const IndustrySelect = ({
  industries,
  industry,
  setIndustry,
  setPopupSpecialization,
}: IndustrySelect) => {
  const { isDarkMode } = useDarkMode();
  const industryDropDown = useRef<any>(null);
  const [showDropDown, setShowDropDown] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        industryDropDown.current &&
        !industryDropDown.current.contains(event.target as Node)
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
    if (industryDropDown.current) {
      setShowDropDown((prev) => !prev);
    }
  };

  return (
    <>
      <div className="   relative " ref={industryDropDown}>
        <div
          className="dark:bg-dark-background mobile:dark:bg-[#2A4436] mobile:bg-white dark:text-[#6D6D6D] mobile:dark:text-white text-[.7rem] rounded-[.50rem] w-full p-[.43rem] h-fit pl-[.78rem] focus:border-0 focus:outline-none  min-w-[100px] relative  z-[20] flex justify-between items-center border-[1.4px] mobile:border-2 mobile:border-dashed mobile:border-[#00B152] border-[#656565]"
          onClick={handleDropDownOpen}
        >
          <div>
            <span className="text-[.95rem]">{industry.industry}</span>
          </div>
          <div>
            <img src="/icons/dropDown.svg" alt="" />
          </div>
        </div>
        {showDropDown && (
          <div className="absolute box-border right-0 w-full dark:bg-[#313131] bg-white top-[110%] left-[50%] translate-x-[-50%] z-[110] border-[1px] border-[#656565] rounded-[.86rem] flex flex-col p-[.87rem] h-[6rem] overflow-y-auto scrollbar-thin">
            {industries?.map((items: any) => (
              <div
                key={items.industryId}
                className={`cursor-pointer dark:hover:text-[#AFFFD4] hover:text-[#6D6D6D] ${
                  industry.industryId === items.industryId
                    ? "text-primary"
                    : isDarkMode
                    ? "text-white"
                    : "text-black"
                }`}
                onClick={() => {
                  setIndustry(items);
                  setShowDropDown(false);
                  setPopupSpecialization("");
                }}
              >
                <span className="text-[.78rem] font-[500]">
                  {items.industry}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};
export default IndustrySelect;
