import { useEffect, useRef, useState } from "react";
import useConfigStore from "../../../../configStore/store";
import { capitalizeWords } from "../../../../services/helpers/helper";
import { useDarkMode } from "../../../../theme/useDarkMode";

interface StateSelect {
  state: any;
  setState: (value: string) => void;
}

const StateSelect = ({ state, setState }: StateSelect) => {
  const { isDarkMode } = useDarkMode();
  const stateDropDown = useRef<any>(null);
  const { selectedCountry } = useConfigStore();
  const [filteredStates, setFilteredStates] = useState([]);
  const [showDropDown, setShowDropDown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        stateDropDown.current &&
        !stateDropDown.current.contains(event.target as Node)
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
      setSearchTerm(capitalizeWords(state.key));
    } else {
      setFilteredStates(selectedCountry.stateDetails);
    }
  }, [showDropDown]);

  const handleDropDownOpen = () => {
    setShowDropDown(true);
  };
  useEffect(() => {
    handleFilterStates();
  }, [searchTerm]);
  const handleFilterStates = () => {
    const filteredState = searchTerm
      ? selectedCountry.stateDetails?.filter((item: any) =>
          item.stateName.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : selectedCountry.stateDetails;
    setFilteredStates(filteredState);
  };

  return (
    <>
      <div className="relative" ref={stateDropDown}>
        <div className="mt-[.1rem] border-[1px] dark:border-white border-[#7D7D7D] w-full h-[2.6rem] rounded-[.6rem] relative p-[.57rem] pr-[.69rem] flex justify-between items-center">
          <input
            placeholder="Please select your state"
            value={searchTerm}
            className="dark:bg-dark-background dark:text-white text-black text-[.7rem] focus:border-0 focus:outline-none  placeholder:text-gray-400 placeholder:font-[600] w-full"
            onFocus={handleDropDownOpen}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoComplete="new-password"
          />
          <div
            className={`w-[0.652rem] h-auto transition-transform duration-600 ${
              showDropDown ? "rotate-180" : "rotate-0"
            }`}
            onClick={() => setShowDropDown(!showDropDown)}
          >
            <img
              className="w-[.8rem] h-auto"
              src="/icons/dropDown.svg"
              alt=""
            />
          </div>
        </div>
        {showDropDown && (
          <div
            className="absolute left-0 w-full dark:bg-[#313131] bg-white top-[110%] z-[110] border-[1px] border-[#656565] rounded-[.86rem] flex flex-col p-[.87rem] h-[7rem] overflow-y-auto scrollbar-thin"
            style={{ clipPath: "inset(0 0 0 0 round .86rem)" }}
          >
            {filteredStates?.map((items: any) => (
              <div
                key={items.key}
                className={`cursor-pointer dark:hover:text-[#AFFFD4] hover:text-[#6F6F6F] ${
                  state.stateName === items.stateName
                    ? "text-primary"
                    : isDarkMode
                    ? "text-white"
                    : "text-black"
                }`}
                onClick={() => {
                  setState(items);
                  setSearchTerm(capitalizeWords(items.stateName));
                  setShowDropDown(false);
                }}
              >
                <span className="text-[.78rem] font-[500]">
                  {capitalizeWords(items.stateName)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default StateSelect;
