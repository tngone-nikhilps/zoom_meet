import React, { useState } from "react";
import useConfigStore from "../../../configStore/store";
import { levels } from "../../../services/constants";
import { useDarkMode } from "../../../theme/useDarkMode";
import IndustrySelect from "../inputs/select/chooseIndustry";
import LevelSelect from "../inputs/select/chooseLevel";
import SelectSpecializationPopup from "../inputs/select/SpecializationPopup";

interface editBasicSlotParamsProps {
  level: string;
  setLevel: (level: any) => void;
  industry: any;
  setIndustry: (industry: any) => void;
  specialization: any;
  setSpecialization: (specialization: any) => void;
  confirmModalPopUp: boolean;
  setConfirmModalPopUp: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function EditParamsModal({
  level,
  setLevel,
  industry,
  setIndustry,
  specialization,
  setSpecialization,
  confirmModalPopUp,
  setConfirmModalPopUp,
}: editBasicSlotParamsProps) {
  const { configs } = useConfigStore();
  const [popUpIndustry, setPopupIndustry] = useState(industry);
  const [popupLevel, setPopupLevel] = useState(level);
  const { isDarkMode } = useDarkMode();
  const [popupSpecialization, setPopupSpecialization] =
    useState(specialization);
  const [specializationError, setSpecializationError] = useState(false);
  if (!confirmModalPopUp) return null;

  const handleSave = () => {
    if (!popupSpecialization) {
      setSpecializationError(true);
      return;
    }
    setLevel(popupLevel);
    setIndustry(popUpIndustry);
    setSpecialization(popupSpecialization);
    setConfirmModalPopUp(false);
  };
  const handleCancel = () => {
    setConfirmModalPopUp(false);
  };
  return (
    <div className="fixed z-50 inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="w-[19rem]  dark:bg-[#313131] bg-white rounded-[.78rem] px-[1.3rem] pt-[3.74rem] pb-[1.96rem] relative">
        <div
          className="absolute top-[.91rem] right-[1.31rem] cursor-pointer"
          onClick={() => setConfirmModalPopUp(false)}
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
        <div>
          <LevelSelect
            levels={levels}
            level={popupLevel}
            setLevel={setPopupLevel}
          ></LevelSelect>
        </div>
        <div className="mt-[1rem]">
          <IndustrySelect
            industries={configs.industries}
            industry={popUpIndustry}
            setIndustry={setPopupIndustry}
            setPopupSpecialization={setPopupSpecialization}
          ></IndustrySelect>
        </div>
        <div className="mt-[1rem]">
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

        <div className="mt-[1rem] flex  justify-between w-full">
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
    </div>
  );
}
