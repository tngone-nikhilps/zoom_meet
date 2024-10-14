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
const SelectSpecialization = ({
  industryId,
  selectedSpecialization,
  setSelectedSpecialization,
}: SelectSpecializationProps) => {
  const specializationDropDown = useRef<any>(null);
  const { configs } = useConfigStore();
  const [searchSpecialization, setSearchSpeicialization] = useState("");
  const [showDropDown, setShowDropDown] = useState(false);
  const [specializations, setSpecializations] = useState<null | any[]>(null);
  const [trendings, setTrendings] = useState<null | any[]>(null);

  useEffect(() => {
    getTrendingSpecializations();
  }, []);
  const getTrendingSpecializations = () => {
    const industry = configs.industries.find(
      (industry: any) => industry.industryId == industryId
    );
    setTrendings(industry.stacks);
  };
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
    searchStack();
  }, [searchSpecialization]);
  useEffect(() => {
    if (!showDropDown) {
      setSearchSpeicialization(selectedSpecialization.stack);
    }
  }, [showDropDown]);
  const handleSpecializationDropDownOpen = () => {
    if (specializationDropDown.current) {
      setShowDropDown(true);
    }
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
        className="relative w-full flex justify-center "
        ref={specializationDropDown}
      >
        <div
          className={`h-[2.82em] w-[80%] mobile:w-full mobile:border-primary ${
            showDropDown
              ? "mobile:dark:bg-[#464646]"
              : "mobile:dark:bg-[#00b15217]"
          }  rounded-[.69em] dark:bg-[#464646] bg-white  mt-[1.13em] border-[1px] border-[#656565] flex  px-[1.43em] py-[1.2em] items-center relative  z-[40]`}
        >
          <div>
            <img src="/icons/darkMode/search.svg" alt="" />
          </div>
          <div className="relative w-full">
            <input
              placeholder="Search for your specialization."
              className="dark:bg-transparent dark:text-white  focus:border-0 focus:outline-none mx-[15px] w-full  placeholder:dark:text-[#D7D7D7] placeholder:text-[.9em] text-[.9em] font-[400px]"
              value={searchSpecialization}
              onChange={(e) => setSearchSpeicialization(e.target.value)}
              onFocus={handleSpecializationDropDownOpen}
              //   onBlur={handleSpecializationDropDownClose}
            ></input>
            {/* <div
                  ref={countryDropDown}
                  className="w-[100px] h-[200px] bg-white flex flex-col absolute top-[46px] left-0 z-10 "
                >
                  <div className="h-[20px] w-full">India</div>
                </div> */}
          </div>
        </div>
        {showDropDown && (

          <div className="absolute right-0   w-[80%] mobile:w-full px-[1.13em]   dark:bg-[#313131] bg-white bottom-[50%] mobile:top-[50%] rounded-[.78em]  left-[50%] translate-x-[-50%] z-[15] border-[1px] border-[#5D5C5C] flex flex-col-reverse mobile:flex-col pb-[1.7em] pt-[1em] mobile:pt-[2em] mobile:pb-[1em] max-h-[18.3em] h-fit overflow-y-auto scrollbar-thin ">
            {specializations?.length ? (
              <>
                {specializations?.map((specialization) => (
                  <div
                    className={`dark:bg-[#151515] bg-[##EFEFEF"] border-[2px] mobile:border-[1px] rounded-[0.59em] w-full py-[.3em] px-[.53em] h-fit mt-[.43em] hover:border-[2px] hover:border-primary hover:text-primary ${
                      selectedSpecialization.stackId == specialization.stackId
                        ? "] border-[#00B152] dark:bg-[#00b15226] bg-white text-primary"
                        : "dark:text-[#6D6D6D] text-[#333] "
                    }`}
                    onClick={() => {
                      setSelectedSpecialization(specialization);
                      setShowDropDown(false);
                    }}
                  >
                    <div>
                      <span className=" text-[.86em] font-[700]">
                        {specialization.stack}
                      </span>
                    </div>
                    <div>
                      <span className=" text-[.76em] font-[400]">
                        {formatNumber(specialization.count)} Interviews
                      </span>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="w-full h-full py-2">
                {trendings?.slice(0, 3).map((trending) => (
                  <>
                    <div
                      className={`dark:bg-[#151515] bg-[#EFEFEF"] border-[2px] mobile:border-[1px] rounded-[0.59em] w-full py-[.3em] px-[.53em] h-fit mt-[.43em] hover:border-primary hover:text-primary cursor-pointer ${
                        selectedSpecialization.stackId == trending.stackId
                          ? " border-[#00B152]  dark:bg-[#00b15226] bg-white text-primary"
                          : "dark:text-[#6D6D6D] mobile:border-[#333] text-[#333] border-[#6D6D6D]"
                      }`}
                      onClick={() => {
                        setSelectedSpecialization(trending);
                        setShowDropDown(false);
                      }}
                    >
                      <div>
                        <span className=" text-[.86em] font-[700]">
                          {trending.stack}
                        </span>
                      </div>
                      <div>
                        <span className=" text-[.76em] font-[400]">
                          {formatNumber(trending.count)} interviews
                        </span>
                      </div>
                    </div>
                    <div
                      className={`dark:bg-[#151515] bg-[#EFEFEF"] border-[2px]  rounded-[0.59em] w-full py-[.3em] px-[.53em] h-fit mt-[.43em] hover:border-primary hover:text-primary cursor-pointer ${
                        selectedSpecialization.stackId == trending.stackId
                          ? "border-[2px] border-[#00B152] dark:bg-[#00b15226] bg-white text-primary"
                          : "dark:text-[#6D6D6D] text-[#333] border-[#6D6D6D]"
                      }`}
                      onClick={() => {
                        setSelectedSpecialization(trending);
                        setShowDropDown(false);
                      }}
                    >
                      <div>
                        <span className=" text-[.86em] font-[700]">
                          {trending.stack}
                        </span>
                      </div>
                      <div>
                        <span className=" text-[.76em] font-[400]">
                          {formatNumber(trending.count)} interviews
                        </span>
                      </div>
                    </div>
                  </>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default SelectSpecialization;
