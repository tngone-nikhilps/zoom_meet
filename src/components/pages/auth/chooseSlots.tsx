import axios from "axios";
import React, { useEffect, useState } from "react";
import "react-calendar/dist/Calendar.css";
import "react-date-picker/dist/DatePicker.css";
import { useLocation, useNavigate } from "react-router-dom";
import { PATHS } from "../../../router";
import { capitalizeWords } from "../../../services/helpers/helper";
import { ENDPOINTS } from "../../../services/urls";
import { useDarkMode } from "../../../theme/useDarkMode";
import SlotCard from "../../elements/cards/slotCard";
import DatePicker from "../../elements/inputs/datePicker";
import TimeZoneSelect from "../../elements/inputs/select/timeZone";
import EditParamsModal from "../../elements/modals/editBasicSlotParams";
import DateSlider from "../../elements/slider/dateSlider";
import FilterDatasForMobile from "../../elements/inputs/select/filterDatasForMobile";
import useConfigStore from "../../../configStore/store";

const ChooseSlots: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { timezones, selectedCountry } = useConfigStore();
  const { isDarkMode } = useDarkMode();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const [selectedDate, setSelectedDate] = useState<Date | null>(tomorrow);
  const [swiperSelectedDate, setSwiperSelectedDate] = useState<Date | null>(
    new Date()
  );
  const [timezone, setTimeZone] = useState<any>(null);
  const [editBasicsPopup, setEditBasicsPopup] = useState(false);
  const [level, setLevel] = useState(() => location.state?.level);
  const [industry, setIndustry] = useState(() => location.state?.industry);
  const [specialization, setSpecializations] = useState(
    () => location.state?.specialization
  );
  const [slots, setSlots] = useState<any>(null);
  const [isFilled, setIsFilled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (timezone) {
      getAllSlots();
    }
  }, [selectedDate, timezone, level, industry, specialization]);
  console.log("dkdkdkdk");
  const getAllSlots = () => {
    setIsFilled(false);
    const body = {
      date: selectedDate?.toISOString().split("T")[0],
      stackId: specialization?.stackId,
      timeZone: timezone,
      isFresher: level == "FRESHER",
      Country: selectedCountry.countryName,
    };
    setIsLoading(true);
    axios
      .post(ENDPOINTS.GET_SLOTS, body)
      .then((res) => {
        setSlots(res.data.slots);
        setIsFilled(res.data.isFilled);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  return (
    <>
      <EditParamsModal
        level={level}
        setLevel={setLevel}
        industry={industry}
        setIndustry={setIndustry}
        specialization={specialization}
        setSpecialization={setSpecializations}
        setConfirmModalPopUp={setEditBasicsPopup}
        confirmModalPopUp={editBasicsPopup}
      ></EditParamsModal>
      <div className="w-full px-auto flex justify-center">
        <div className="w-[15.65rem] mobile:hidden">
          <div className="rounded-[.78rem] border-[1px] border-[#3D3D3D] p-[.86rem] mt-[1rem] w-[14.3rem]">
            <div>
              <span className="dark:text-dark-text text-[.69rem]">Date</span>
            </div>
            <DatePicker
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              setSwiperSelectedDate={setSwiperSelectedDate}
            ></DatePicker>
            {timezones?.length > 1 && (
              <>
                <div className="mt-[.3rem]">
                  <span className="dark:text-dark-text text-[.69rem] ">
                    TimeZone
                  </span>
                </div>

                <TimeZoneSelect
                  timeZone={timezone}
                  setTimeZone={setTimeZone}
                ></TimeZoneSelect>
              </>
            )}

            <div className="w-full dark:bg-[#313131] border-[1.8px] border-[#656565] dark:border-none  px-[.69rem] flex  flex-col rounded-[.78rem] mt-[1.3rem] relative pt-[1.3rem] pb-[.65rem] dark:text-dark-text text-black font-[500]">
              <div
                className="bg-primary cursor-pointer h-[1.17rem] w-[1.17rem] flex justify-center items-center rounded-full absolute right-[.78rem] top-[.78rem]"
                onClick={() => setEditBasicsPopup(true)}
              >
                <img
                  src="/icons/darkMode/editBasics.svg"
                  className="h-[.64rem] w-[.64rem]"
                  alt=""
                />
              </div>
              <div>
                <span className=" text-[.6rem] ml-[.65rem]">
                  {capitalizeWords(level)}
                </span>
                <div className="h-[1px] w-full bg-[#3D3D3D] mt-[.43rem]"></div>
              </div>
              <div className="mt-[.43rem]">
                <span className=" text-[.6rem] ml-[.65rem] ">
                  {industry.industry}
                </span>
                <div className="h-[1px] w-full bg-[#3D3D3D] mt-[.43rem]"></div>
              </div>
              <div className="mt-[.43rem]">
                <span className=" text-[.6rem] ml-[.65rem] ">
                  {specialization.stack?.length > 27
                    ? specialization.stack?.slice(0, 27) + "..."
                    : specialization.stack}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-[1.3rem] rounded-[.78rem] border-[2px] border-primary w-[14.3rem] pl-[.86rem] pt-[.52rem] pb-[.73rem] dark:text-white dark:bg-[#313131] bg-white">
            <div>
              <span className=" text-[.9rem] font-[500]">What do you get</span>
            </div>
            {specialization.description?.map((item: string) => (
              <div className="flex items-start mt-[.43rem]">
                <img
                  src={
                    isDarkMode
                      ? "/icons/darkMode/rightTick.svg"
                      : "/icons/lightMode/rightTick.svg"
                  }
                  alt=""
                />{" "}
                <span className="text-[.69rem] ml-[.34rem] leading-[1rem] font-[300]">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="w-[42rem] mobile:w-full border-r-[2px] dark:border-[#3D3D3D] border-[#B6B6B6] border-l-[2px] mobile:border-0">
          <div className="w-full p-3 hidden mobile:block">
            <FilterDatasForMobile
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              swiperSelectedDate={swiperSelectedDate}
              setSwiperSelectedDate={setSwiperSelectedDate}
              timezone={timezone}
              setTimezone={setTimeZone}
              level={level}
              specialization={specialization}
              industry={industry}
              setLevel={setLevel}
              setIndustry={setIndustry}
              setSpecialization={setSpecializations}
            />
          </div>
          <div className="h-[9rem] mobile:h-[5rem] dark:border-[#3D3D3D] border-[#B6B6B6] border-b-[2px] mobile:border-0 box-border w-full relative m-0 p-0 flex items-center">
            <DateSlider
              setSwiperSelectedDate={setSwiperSelectedDate}
              swiperSelectedDate={swiperSelectedDate}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            ></DateSlider>
          </div>
          <div className=" w-full px-[2.34rem] mobile:px-[.7rem] py-[.47rem]">
            {isFilled && (
              <div className="w-full mt-[.87rem] h-[2.43478rem] bg-[#FEEEEF] pl-[.22rem] pr-[.83rem] py-1 rounded-[0.44235rem] flex items-center">
                <div className="bg-[#EB5757] rounded-[0.44235rem] w-[1.69565rem] mobile:w-[2rem] h-full flex justify-center items-center">
                  <img src="/icons/lock.svg" alt="" />
                </div>
                <div className="text-[0.78261rem] ml-[.78rem] text-[#191919] font-semibold">
                  All slots are fully booked on this day . Stay tuned for future{" "}
                </div>
              </div>
            )}
            {isLoading ? (
              <>
                {Array.from({ length: 6 }).map((_, index) => (
                  <SlotCard
                    key={index}
                    isLoading={true}
                    slotDuration={""}
                    slotStatus={"available"}
                    slotDiscountPrice="500"
                    slotActualPrice={0}
                    slotTime={""}
                  ></SlotCard>
                ))}
              </>
            ) : (
              <>
                {slots?.map((slot: any, index: number) => (
                  <SlotCard
                    key={index}
                    isLoading={false}
                    slotDuration={slot.duration}
                    slotStatus={slot.flagStatus.toLowerCase()}
                    slotDiscountPrice="500"
                    slotActualPrice={slot.referencePice}
                    slotTime={slot.time}
                    onClick={() =>
                      navigate(PATHS.checkOut, {
                        state: {
                          industry: industry,
                          specialization: specialization,
                          level: level,
                          slot: slot,
                          selectedDate: selectedDate,
                          timezone: timezone,
                        },
                      })
                    }
                  ></SlotCard>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default ChooseSlots;
