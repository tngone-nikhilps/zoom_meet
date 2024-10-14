import React from "react";
import ReactDOM from "react-dom";
import { formatNumber } from "../../../services/helpers/helper";
import { useDarkMode } from "../../../theme/useDarkMode";
import RadioSelection from "../inputs/radioSelection";

interface ViewAllSpecializationsProps {
  trendings: any;
  setSelectedSpecialization: any;
  selectedSpecialization: any;
  confirmModalPopUp: boolean;
  setConfirmModalPopUp: React.Dispatch<React.SetStateAction<boolean>>;
  confirmFunction: () => void;
}

export default function ViewAllSpecializations({
  trendings,
  setSelectedSpecialization,
  selectedSpecialization,
  confirmModalPopUp,
  setConfirmModalPopUp,
}: ViewAllSpecializationsProps) {
  if (!confirmModalPopUp) return null;
  const { isDarkMode } = useDarkMode();

  return ReactDOM.createPortal(
    <div className="fixed z-50 inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="w-[80vw] mobile:w-[90vw] h-[85vh] dark:bg-[#313131] bg-white rounded-[.78rem] px-[2.17rem] mobile:px-[1rem] mobile:pt-[.5rem] pt-[1.17rem] pb-[1.96rem] relative">
        <div className="pt-[1.7em]  flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-[1.2em] dark:text-dark-text text-[#1B1B1B] mobile:text-[1.1rem]">
              Trending
            </span>{" "}
            <span className="ml-[.43em]">
              <img src="/icons/darkMode/trending.svg" alt="" />
            </span>
          </div>
          <div onClick={() => setConfirmModalPopUp(false)}>
            <img
              src={
                isDarkMode
                  ? "/icons/darkMode/close.svg"
                  : "/icons/lightMode/close.svg"
              }
              className="w-[1.1rem] h-[1.1rem] cursor-pointer"
              alt=""
            />
          </div>
        </div>
        <div className="mt-[1.43em] flex gap-[13px] mobile:block">
          {trendings?.map(
            (trending: { stack: string; count: number; stackId: any }) => (
              <RadioSelection
                title={trending.stack}
                details={formatNumber(trending.count)}
                onClick={() => {
                  setSelectedSpecialization(trending);
                  setConfirmModalPopUp(false);
                }}
                isSelected={selectedSpecialization.stackId === trending.stackId}
              ></RadioSelection>
            )
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
