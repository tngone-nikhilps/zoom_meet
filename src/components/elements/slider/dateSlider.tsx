import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

import "../../../index.css";
import { Navigation, Pagination } from "swiper/modules";
import DateCard from "../cards/dateCard";
import generateDatesAroundGivenDate, {
  getMonthdayName,
  getWeekdayName,
} from "../../../services/helpers/helper";
import { useEffect, useRef } from "react";
import { useDarkMode } from "../../../theme/useDarkMode";
import useMediaQuery from "../../../services/hooks/useMediaQuery";

interface DateSlider {
  swiperSelectedDate: Date | null;
  setSwiperSelectedDate?: (date: Date | null) => void;
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
}
const DateSlider = ({
  selectedDate,
  setSelectedDate,
  swiperSelectedDate,
}: DateSlider) => {
  const swiperRef = useRef<any>(null);
  const isMobile = useMediaQuery("(max-width: 1024px)");
  const { isDarkMode } = useDarkMode();

  useEffect(() => {
    if (swiperRef.current && swiperRef.current.swiper) {
      // Navigate to the second slide (index starts at 0)
      swiperRef.current.swiper.slideTo(0);
    }
  }, [swiperSelectedDate]);
  return (
    <>
      {isMobile ? (
        <>
          <Swiper
            ref={swiperRef}
            // key={swiperKey}
            modules={[Pagination]}
            style={{
              cursor: "pointer",
              marginInline: "0.7rem",
            }}
            initialSlide={0}
            slidesPerView={"auto"}
            speed={isMobile ? 1200 : 600}
            touchRatio={1.5}
          >
            {generateDatesAroundGivenDate(swiperSelectedDate, 40).map(
              (date) => (
                <SwiperSlide>
                  <DateCard
                    onClick={() => setSelectedDate(date)}
                    date={date.getDate().toString()}
                    day={getWeekdayName(date)}
                    month={getMonthdayName(date)}
                    isSelected={selectedDate?.getDate() == date?.getDate()}
                  ></DateCard>
                </SwiperSlide>
              )
            )}
          </Swiper>
        </>
      ) : (
        <>
          <Swiper
            ref={swiperRef}
            // key={swiperKey}
            modules={[Navigation, Pagination]}
            style={{
              cursor: "pointer",
              marginInline: "4.5rem",
            }}
            initialSlide={0}
            slidesPerView={"auto"}
            speed={300}
            touchRatio={1.5}
            navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            }}
          >
            {generateDatesAroundGivenDate(swiperSelectedDate, 40).map(
              (date) => (
                <SwiperSlide>
                  <DateCard
                    onClick={() => setSelectedDate(date)}
                    date={date.getDate().toString()}
                    day={getWeekdayName(date)}
                    month={getMonthdayName(date)}
                    isSelected={selectedDate?.getDate() == date?.getDate()}
                  ></DateCard>
                </SwiperSlide>
              )
            )}
          </Swiper>
          <img
            src={
              isDarkMode
                ? "/icons/darkMode/dateSlideNext.svg"
                : "/icons/lightMode/dateSlideNext.svg"
            }
            className="swiper-button-next !h-[1.9rem] !w-[1.9rem] !right-[.73rem]"
          />
          <img
            src={
              isDarkMode
                ? "/icons/darkMode/dateSlidePrevious.svg"
                : "/icons/lightMode/dateSlidePrevious.svg"
            }
            className="swiper-button-prev !h-[1.9rem] !w-[1.9rem] !left-[.73rem]"
          />
        </>
      )}
    </>
  );
};
export default DateSlider;
