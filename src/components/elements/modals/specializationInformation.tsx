import React from "react";
import { useDarkModeStore } from "../../../theme/store";
import ReactDOM from "react-dom";

interface ConfirmModalProps {
  confirmModalPopUp: boolean;
  setConfirmModalPopUp: React.Dispatch<React.SetStateAction<boolean>>;
  selectedSpecialization: any;
  handleNext: () => void;
}

export default function SpecializationInformation({
  confirmModalPopUp,
  handleNext,
  setConfirmModalPopUp,
  selectedSpecialization,
}: ConfirmModalProps) {
  if (!confirmModalPopUp) return null;
  const { isDarkMode } = useDarkModeStore();

  return ReactDOM.createPortal(
    <div className="fixed z-50 inset-0 bg-black bg-opacity-50 flex items-center justify-center w-full">
      <div className="w-[80vw]  h-[25em] border-[2px] flex flex-col justify-between border-primary rounded-[.78rem] self-start mt-[5.56em] dark:bg-[#313131] bg-[#EFEFEF] px-[.9rem] py-[.9rem] dark:text-white text-[#222] mobile:border-[#3D3D3D] ">
        <div>
          <div className="flex justify-between items-center">
            <div>
              <span className="text-[1em] font-[600]">What do you get ?</span>
            </div>
            <div onClick={() => setConfirmModalPopUp(false)}>
              <img
                src={
                  isDarkMode
                    ? "/icons/darkMode/close.svg"
                    : "/icons/lightMode/close.svg"
                }
                className="w-[1em] h-[1em] cursor-pointer"
                alt=""
              />
            </div>
          </div>
          <div className="h-[1px] w-full mt-[.87em] bg-[#444]"></div>
          {selectedSpecialization.description?.map((item: any) => (
            <div className="flex items-start mt-[.87em]">
              <img
                src={
                  isDarkMode
                    ? "/icons/darkMode/rightTick.svg"
                    : "/icons/lightMode/rightTick.svg"
                }
                className="w-[1em] h-[1em]"
                alt=""
              />{" "}
              <span className="text-[.7em] ml-[8px] leading-[0.82609rem] font-[400]">
                {item}
              </span>
            </div>
          ))}
        </div>
        <div>
          <div
            onClick={handleNext}
            className={`w-full mt-[1.6em] h-[2.5rem] flex justify-center items-center   ${"border-none bg-primary cursor-pointer"}  border-[#00b1522b]  rounded-[6em] `}
          >
            {" "}
            <span className={`${"text-white"} text-[.85rem] `}>Continue</span>
          </div>
          <div
            onClick={() => setConfirmModalPopUp(false)}
            className={`w-full mt-[.48rem] h-[2.5rem] flex justify-center items-center    bg-transparent   border-black border-[1px] dark:border-white rounded-[6em] `}
          >
            {" "}
            <span className="text-black text-[.85rem] dark:text-white ">
              Close
            </span>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
