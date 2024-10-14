import { useEffect, useState } from "react";
import { capitalizeWords } from "../../../../services/helpers/helper";
import EditBasisSlotParamsForMobile from "../../modals/editBasisSlotParamsForMobile";
import useConfigStore from "../../../../configStore/store";
interface Props {
  selectedDate: Date | null;
  setSelectedDate: (selected: Date | null) => void;
  swiperSelectedDate: Date | null;
  setSwiperSelectedDate: (selected: Date | null) => void;
  timezone: any;
  setTimezone: (timezone: any) => void;
  level: string;
  specialization: any;
  industry: any;
  setLevel: (level: any) => void;
  setSpecialization: (specialization: any) => void;
  setIndustry: (industry: any) => void;
}
function FilterDatasForMobile({
  selectedDate,
  setSelectedDate,
  swiperSelectedDate,
  setSwiperSelectedDate,
  timezone,
  setTimezone,
  level,
  specialization,
  industry,
  setIndustry,
  setLevel,
  setSpecialization,
}: Props) {
  const [editModalPopUp, setEditModalPopUp] = useState(false);
  const [toggleExtend, setToggleExtend] = useState(false);
  const { selectedCountry } = useConfigStore();
  console.log(timezone, "timezone");
  useEffect(() => {
    setTimezone(selectedCountry.timeZone[0]);
  }, [selectedCountry]);
  return (
    <>
      <div className="relative h-[75px] w-full">
        <div
          className="w-full absolute top-0 dark:bg-[#232323] z-[20] bg-white border border-[#858484] rounded-[20px] px-3 dark:text-white text-[14px] flex items-center justify-between py-3"
          onClick={() => setToggleExtend(!toggleExtend)}
        >
          <div className="flex flex-col gap-2">
            <div className="flex gap-3 items-center">
              <img
                src="/icons/darkMode/datePicker.svg"
                alt="Date"
                className="w-5 h-5"
              />
              <span>{selectedDate?.toLocaleDateString("en-GB")}</span>
            </div>

            <div className="flex gap-3 items-center">
              <img
                src="/icons/darkMode/timeZone.svg"
                alt="Timezone"
                className="w-5 h-5"
              />
              <span>{timezone?.split("|")[0]}</span>
            </div>
          </div>
          <div>
            <div
              className={`w-[20px] h-auto transition delay-100 duration-700 ${
                toggleExtend ? "rotate-0" : "rotate-180"
              }`}
            >
              <img
                src="/icons/darkMode/up-arrow.svg"
                className="w-full h-full"
                alt=""
              />
            </div>
          </div>
        </div>
        {toggleExtend && (
          <div className="absolute z-[10] top-[80%] rounded-t-none left-0 right-0 dark:bg-[#1F1F1F] bg-white p-4 rounded-[20px] border border-[#868484] dark:text-[#858484] text-black shadow-lg">
            <div className="flex flex-col gap-2 pb-3 border-b border-[#858484] text-[14px] mt-2">
              <div>{capitalizeWords(level)}</div>
              <div>{industry.industry}</div>
              <div>{specialization.stack}</div>
            </div>
            <button
              className="w-full h-[37px] bg-[#00B152] rounded-[12px] text-center flex justify-center items-center mt-4 text-white"
              onClick={() => setEditModalPopUp(true)}
            >
              Edit
            </button>
          </div>
        )}
      </div>
      {editModalPopUp && (
        <EditBasisSlotParamsForMobile
          editModalPopUp={editModalPopUp}
          setEditModalPopUp={setEditModalPopUp}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          swiperSelectedDate={swiperSelectedDate}
          setSwiperSelectedDate={setSwiperSelectedDate}
          timezone={timezone}
          setTimezone={setTimezone}
          level={level}
          setLevel={setLevel}
          industry={industry}
          setIndustry={setIndustry}
          specialization={specialization}
          setSpecialization={setSpecialization}
          setToggleExtend={setToggleExtend}
        />
      )}
    </>
  );
}

export default FilterDatasForMobile;
