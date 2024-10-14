import { useState } from "react";
import useConfigStore from "../../../configStore/store";
import { levels } from "../../../services/constants";
import { useDarkMode } from "../../../theme/useDarkMode";
import DatePicker from "../inputs/datePicker";
import IndustrySelect from "../inputs/select/chooseIndustry";
import LevelSelect from "../inputs/select/chooseLevel";
import SelectSpecializationPopup from "../inputs/select/SpecializationPopup";
import TimeZoneSelect from "../inputs/select/timeZone";
import ReactDOM from "react-dom";

interface Props {
  editModalPopUp: boolean;
  setEditModalPopUp: (editModalPopUp: boolean) => void;
  selectedDate: Date | null;
  setSelectedDate: (selected: Date | null) => void;
  swiperSelectedDate: Date | null;
  setSwiperSelectedDate: (selected: Date | null) => void;
  timezone: any;
  setTimezone: (timezone: any) => void;
  level: string;
  setLevel: (level: any) => void;
  industry: any;
  setIndustry: (industry: any) => void;
  specialization: any;
  setSpecialization: (specialization: any) => void;
  setToggleExtend: (toggleModal: boolean) => void;
}
function EditBasisSlotParamsForMobile({
  editModalPopUp,
  setEditModalPopUp,
  selectedDate,
  setSelectedDate,
  setSwiperSelectedDate,
  timezone,
  setTimezone,
  level,
  setLevel,
  industry,
  setIndustry,
  specialization,
  setSpecialization,
  setToggleExtend,
}: Props) {
  const { configs } = useConfigStore();
  const [popUpIndustry, setPopupIndustry] = useState(industry);
  const [popupLevel, setPopupLevel] = useState(level);
  const [popupSpecialization, setPopupSpecialization] =
    useState(specialization);
  const [specializationError, setSpecializationError] = useState(false);
  if (!editModalPopUp) return null;

  const handleSave = () => {
    if (!popupSpecialization) {
      setSpecializationError(true);
      return;
    }
    setLevel(popupLevel);
    setIndustry(popUpIndustry);
    setSpecialization(popupSpecialization);
    setEditModalPopUp(false);
    setToggleExtend(false);
  };
  const handleCancel = () => {
    setEditModalPopUp(false);
    setToggleExtend(false);
  };
  const { isDarkMode } = useDarkMode();
  return ReactDOM.createPortal(
    <div
      className="fixed z-50 inset-0 
       bg-black bg-opacity-50 flex items-center justify-center"
    >
      <div className="w-[95%] dark:bg-[#313131] bg-[#eeeeee] dark:text-white border border-black/40  rounded-[.78rem] px-[1.3rem] pt-[2rem] pb-[1.96rem] relative">
        <div
          className="absolute top-[.8rem] right-[1.31rem] cursor-pointer"
          onClick={handleCancel}
        >
          <img
            src={
              isDarkMode
                ? "/icons/darkMode/close.svg"
                : "/icons/lightMode/close.svg"
            }
            alt=""
          />
        </div>
        <div className="mt-[1rem]">
          <div>Date</div>
          <DatePicker
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            setSwiperSelectedDate={setSwiperSelectedDate}
          ></DatePicker>
        </div>
        <div className="mt-[1rem]">
          <div>Timezone</div>
          <TimeZoneSelect
            timeZone={timezone}
            setTimeZone={setTimezone}
          ></TimeZoneSelect>
        </div>
        <div className="mt-[1rem]">
          <div className="mb-2">Level</div>
          <LevelSelect
            levels={levels}
            level={popupLevel}
            setLevel={setPopupLevel}
          ></LevelSelect>
        </div>
        <div className="mt-[1rem]">
          <div className="mb-2">Industry</div>
          <IndustrySelect
            industries={configs.industries}
            industry={popUpIndustry}
            setIndustry={setPopupIndustry}
            setPopupSpecialization={setPopupSpecialization}
          ></IndustrySelect>
        </div>
        <div className="mt-[1rem]">
          <div className="mb-2">Specialization</div>
          <SelectSpecializationPopup
            selectedSpecialization={popupSpecialization}
            setSelectedSpecialization={setPopupSpecialization}
            industryId={popUpIndustry.industryId}
          ></SelectSpecializationPopup>
        </div>
        {specializationError && (
          <div>
            <span className="text-[#FF5454] text-[.5rem]">
              Please select specialization
            </span>
          </div>
        )}

        <div className="mt-[2rem] flex  justify-between w-full">
          <div
            className="border-[2.13px] basis-[50%] mr-[.7rem] cursor-pointer border-[#FF5454] text-[#FF5454] text-[1rem] text-center flex justify-center items-center  h-[2.5rem] rounded-[.80rem]"
            onClick={handleCancel}
          >
            Cancel
          </div>
          <div
            className="bg-primary basis-[50%]  ml-[.7rem] text-white cursor-pointer text-[1rem] text-center flex justify-center items-center  w-full h-[2.5rem] rounded-[.80rem]"
            onClick={handleSave}
          >
            Save
          </div>
          <div></div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default EditBasisSlotParamsForMobile;
