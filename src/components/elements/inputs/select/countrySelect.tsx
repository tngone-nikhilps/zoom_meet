import { useRef, useState, useEffect } from "react";
import useCountry from "../../../../services/hooks/useCountry";
import { ENDPOINTS } from "../../../../services/urls";
import axios from "axios";
import { capitalizeWords } from "../../../../services/helpers/helper";
import useConfigStore from "../../../../configStore/store";
import useMediaQuery from "../../../../services/hooks/useMediaQuery";
import { useDarkMode } from "../../../../theme/useDarkMode";

const CountrySelect = () => {
  const fetchcountry = useCountry() as any;
  const { isDarkMode } = useDarkMode();
  const { setTimeZones } = useConfigStore();
  const isMobile = useMediaQuery("(max-width: 1024px)");
  const { selectedCountry, setSelectedCountry } = useConfigStore();
  const [searchCountry, setSearchCountry] = useState("");
  const [countries, setCountries] = useState<[] | null>(null);
  const [initialCountries, setInitailCountries] = useState<[] | null>(null);
  const countryDropDown = useRef<any>(null);
  const [showDropDown, setShowDropDown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setInitialCountry();

    const handleClickOutside = (event: MouseEvent) => {
      if (
        countryDropDown.current &&
        !countryDropDown.current.contains(event.target as Node)
      ) {
        setShowDropDown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [fetchcountry]);
  useEffect((): any => {
    // Return all stacks if no search term

    const regex = new RegExp(searchCountry, "i"); // 'i' flag for case-insensitive search

    const filteredCountries: any = initialCountries?.filter(
      (selectedCountry: { countryName: string }) => {
        return regex.test(selectedCountry.countryName); // Add the missing return statement
      }
    );
    if (!isMobile) {
      setCountries(filteredCountries);
    }
  }, [searchCountry]);
  useEffect(() => {
    if (!showDropDown) {
      setSearchCountry(capitalizeWords(selectedCountry?.countryName));
    } else {
      setCountries(initialCountries);
    }
  }, [showDropDown]);
  useEffect(() => {
    setTimeZones(selectedCountry?.timeZone);
  }, [selectedCountry]);

  const setInitialCountry = () => {
    setIsLoading(true);
    axios
      .get(ENDPOINTS.GET_COUNTRY_DETAILS)
      .then((res) => {
        setInitailCountries(res.data);
        setCountries(res.data);
        if (!selectedCountry) {
          res.data?.map((item: any) => {
            if (item.countryName.toUpperCase() == fetchcountry?.toUpperCase()) {
              setSelectedCountry(item);
              setSearchCountry(capitalizeWords(item.countryName));
            }
          });
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleCountryChnage = (e: any) => {
    setSearchCountry(e.target.value);
  };

  const handleCountryDropDownOpen = () => {
    if (countryDropDown.current) {
      setShowDropDown((prev) => !prev);
    }
  };
  return (
    <>
      {!isLoading && (
        <div className="relative " ref={countryDropDown}>
          <div
            className="h-[2em] rounded-[1em] mobile:h-[1.8rem] mobile:w-[5rem] mobile:rounded-[1rem] mobile:justify-between mobile:dark:bg-[#313131]  border-[1px] border-[#444] flex px-[.9em] mobile:px-[.3rem] items-center relative z-[30]"
            onClick={handleCountryDropDownOpen}
          >
            <div className="relative z-[1] w-fit h-fit  overflow-hidden">
              <img
                src={`data:image/png;base64,${selectedCountry?.flag}`}
                className="object-cover rounded-full w-[1.4rem] h-[1.4rem]"
                alt=""
              />
            </div>
            <div className="relative z-[1] flex items-center">
              {!isMobile ? (
                <input
                  placeholder="Country"
                  value={searchCountry}
                  className="dark:bg-dark-background dark:text-white text-[.7em] focus:border-0 focus:outline-none mx-[.65em] min-w-[100px] "
                  size={searchCountry?.length || 5}
                  onChange={handleCountryChnage}
                  autoComplete="new-password"
                />
              ) : (
                <>
                  <span className="text-[.6rem] block dark:text-white">
                    {selectedCountry?.regionName}
                  </span>
                </>
              )}
            </div>
            <div className="relative z-[1]">
              <img
                src={
                  !isMobile
                    ? "/icons/dropDown.svg"
                    : isDarkMode
                    ? "/icons/down-arrow.svg"
                    : "/icons/down-arrow-dark.svg"
                }
                alt=""
              />
            </div>
            <div></div>
          </div>
          {showDropDown && (
            <div className="absolute z-10 w-[100%] mobile:w-[10rem] right-0 top-[50%] mobile:top-[100%]  mt-1 border-[1px] border-t-0 mobile:border-t-[1px] border-[#444] pt-[20px] mobile:pt-[0px] rounded-b-[12px] mobile:rounded-[12px]">
              <div className="bg-white dark:bg-dark-background  rounded-[12px] h-[200px] overflow-y-auto scrollbar-thin ">
                {/* Example selectedCountry options */}
                {countries?.map((countryOption: any) => (
                  <div
                    key={countryOption}
                    className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer px-[.9em]"
                    onClick={() => {
                      setSelectedCountry(countryOption);
                      setShowDropDown(false);
                    }}
                  >
                    <img
                      src={`data:image/png;base64,${countryOption?.flag}`}
                      alt=""
                      className="mr-[.44em] w-[1.5em] h-auto"
                    />
                    <span className="dark:text-white text-[.6em] ">
                      {capitalizeWords(countryOption.countryName)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default CountrySelect;
