import { useEffect, useRef, useState } from "react";
import useConfigStore from "../../../../configStore/store";
import {
  filterStacks,
  formatNumber,
} from "../../../../services/helpers/helper";

interface SelectSpecializationProps {
  industryId: string;
  selectedSpecialization: any;
  setSelectedSpecialization: (value: any) => void;
}
const SelectSpecializationPopup = ({
  industryId,
  selectedSpecialization,
  setSelectedSpecialization,
}: SelectSpecializationProps) => {
  const specializationDropDown = useRef<any>(null);
  const [searchSpecialization, setSearchSpeicialization] = useState("");
  const [showDropDown, setShowDropDown] = useState(false);
  const [specializations, setSpecializations] = useState<null | any[]>(null);
  const [trendings, setTrendings] = useState<null | any[]>(null);
  const { configs } = useConfigStore();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        specializationDropDown.current &&
        !specializationDropDown.current.contains(event.target as Node)
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
    if (!showDropDown) {
      setSearchSpeicialization(selectedSpecialization.stack);
    }
  }, [showDropDown]);
  useEffect(() => {
    if (searchSpecialization) {
      searchStack();
    } else {
      setSpecializations([]);
    }
  }, [searchSpecialization]);
  useEffect(() => {
    if (!selectedSpecialization) {
      setSearchSpeicialization("");
    }
  }, [selectedSpecialization]);
  const handleSpecializationDropDownOpen = () => {
    if (specializationDropDown.current) {
      setShowDropDown(true);
    }
  };
  useEffect(() => {
    getTrendingSpecializations();
  }, [industryId]);
  const getTrendingSpecializations = () => {
    const industry = configs.industries.find(
      (industry: any) => industry.industryId == industryId
    );
    setTrendings(industry.stacks);
  };
  const searchStack = () => {
    const industry = configs.industries.find(
      (industry: any) => industry.industryId == industryId
    );
    const filteredStacks = filterStacks(industry.stacks, searchSpecialization);
    setSpecializations(filteredStacks);
  };
  return (
    <>
      <div
        className="relative w-full flex justify-center"
        ref={specializationDropDown}
      >
        <div
          className="dark:bg-dark-background dark:mobile:bg-[#2A4436] bg-white dark:text-[#6D6D6D] text-[.7rem] rounded-[.50rem]
         w-full p-[.43rem] h-fit pl-[.78rem] focus:border-0 focus:outline-none  min-w-[100px] relative  flex justify-between items-center 
         border-[1.4px] border-[#656565] mobile:border-dashed mobile:border-2 mobile:border-[#00BF6F] z-[105]"
        >
          <div className="relative w-full">
            <input
              placeholder="Search specialization"
              className="dark:bg-transparent dark:text-[#6D6D6D] mobile:dark:text-white  focus:border-0 focus:outline-none  w-full 
              placeholder:dark:text-[#6D6D6D] placeholder:text-[.85rem] text-[.95rem] font-[400px]"
              value={searchSpecialization}
              onChange={(e) => setSearchSpeicialization(e.target.value)}
              onFocus={handleSpecializationDropDownOpen}
            ></input>
            {/* <div
                  ref={countryDropDown}
                  className="w-[100px] h-[200px] bg-white flex flex-col absolute top-[46px] left-0 z-10 "
                >
                  <div className="h-[20px] w-full">India</div>
                </div> */}
          </div>
          <div>
            <img src="/icons/darkMode/search.svg" alt="" />
          </div>
        </div>
        {showDropDown && (
          <div
            className="absolute right-0 w-full dark:bg-[#313131] bg-white bottom-[50%] rounded-[.78em]  left-[50%] translate-x-[-50%] z-[100]
           border-[1px] border-[#5D5C5C] flex flex-col-reverse p-[.43rem] pb-[1.5rem] h-[8.7rem] overflow-y-auto scrollbar-thin "
          >
            {!specializations?.length ? (
              <>
                {trendings?.map((trendings) => (
                  <div
                    className={`dark:bg-[#151515] bg-white rounded-[0.39em] w-full py-[.3em] px-[.36em] flex flex-col justify-between mt-[.43em] hover:border-[.66px] hover:border-primary hover:text-primary ${
                      selectedSpecialization.stackId == trendings.stackId
                        ? "border-[.66px] border-[#00B152] bg-[#00b15226] text-primary"
                        : "text-[#6D6D6D] border-[.66px] border-[#333]"
                    }`}
                    onClick={() => {
                      setSelectedSpecialization(trendings);
                      setShowDropDown(false);
                    }}
                  >
                    <div className="flex items-center  h-fit">
                      <span className=" text-[.65em] mobile:text-[14px] font-[700] leading-[1]">
                        {trendings.stack}
                      </span>
                    </div>
                    <div className="flex items-center  h-fit mt-[.5em]">
                      <span className=" text-[.55em] mobile:text-[10px] font-[400] leading-[1] ">
                        {formatNumber(trendings.count)+"Interviews"}
                      </span>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <>
                {" "}
                {specializations?.map((specialization) => (
                  <div
                    className={`dark:bg-[#151515] bg-white rounded-[0.39em] w-full py-[.3em] px-[.36em] flex flex-col justify-between mt-[.43em] hover:border-[.66px] hover:border-primary hover:text-primary ${
                      selectedSpecialization.stackId == specialization.stackId
                        ? "border-[.66px] border-[#00B152] bg-[#00b15226] text-primary"
                        : "text-[#6D6D6D] border-[.66px] border-[#333]"
                    }`}
                    onClick={() => {
                      setSelectedSpecialization(specialization);
                      setShowDropDown(false);
                    }}
                  >
                    <div className="flex items-center  h-fit">
                      <span className=" text-[.65em] mobile:text-[14px] font-[700] leading-[1]">
                        {specialization.stack}
                      </span>
                    </div>
                    <div className="flex items-center  h-fit mt-[.5em]">
                      <span className=" text-[.55em] mobile:text-[10px] font-[400] leading-[1] ">
                        {formatNumber(specialization.count)+"Interviews"}
                      </span>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default SelectSpecializationPopup;
