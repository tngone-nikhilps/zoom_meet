import React, { useState, useEffect, useRef } from "react";
import { FormattedDate } from "../../../services/helpers/helper";
import useConfigStore from "../../../configStore/store";

interface DatePickerProps {
  onChange?: (date: string) => void;
  initialDate?: string;

  selectedDate: Date | null;
  setSelectedDate: (selected: Date | null) => void;
  setSwiperSelectedDate: (selected: Date | null) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({
  onChange,
  selectedDate,
  setSelectedDate,
  setSwiperSelectedDate,
}) => {
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const { selectedCountry } = useConfigStore();

  const [today] = useState<Date>(new Date());
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setShowCalendar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number): number => {
    return new Date(year, month, 1).getDay();
  };

  const handleDateClick = (day: number) => {
    const selected = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );

    if (selected < new Date(today.setHours(0, 0, 0, 0))) {
      return; // Do nothing if the selected date is before today
    }

    const formattedDate = selected.toISOString().split("T")[0];
    setSelectedDate(selected);
    setSwiperSelectedDate(selected);
    setShowCalendar(false);
    if (onChange) {
      onChange(formattedDate);
    }
  };

  const renderCalendar = (): JSX.Element[] => {
    const daysInMonth = getDaysInMonth(
      currentDate.getFullYear(),
      currentDate.getMonth()
    );
    const firstDay = getFirstDayOfMonth(
      currentDate.getFullYear(),
      currentDate.getMonth()
    );
    const days: JSX.Element[] = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const currentIterationDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        i
      );
      const isBeforeToday =
        currentIterationDate < new Date(today.setHours(0, 0, 0, 0));

      const isSelected =
        selectedDate &&
        selectedDate.getDate() === i &&
        selectedDate.getMonth() === currentDate.getMonth() &&
        selectedDate.getFullYear() === currentDate.getFullYear();
      const isToday =
        today.getDate() === i &&
        today.getMonth() === currentDate.getMonth() &&
        today.getFullYear() === currentDate.getFullYear();

      days.push(
        <div
          key={i}
          className={`m-2 p-1 text-center hover:bg-gray-200 dark:text-[#F2F2F2] text-[.78rem] h-[1.6rem] w-[1.6rem] hover:text-black font-[400] rounded-full cursor-pointer
            ${isSelected ? "bg-primary text-white " : ""}
            ${isToday && !isSelected ? "border-2 border-green-500" : ""}
            ${isBeforeToday ? "opacity-50 cursor-not-allowed" : ""}
          `}
          onClick={() => !isBeforeToday && handleDateClick(i)}
        >
          <span>{i}</span>
        </div>
      );
    }

    return days;
  };

  const handlePrevMonth = () => {
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1
    );
    if (
      newDate.getMonth() >= today.getMonth() ||
      newDate.getFullYear() > today.getFullYear()
    ) {
      setCurrentDate(newDate);
    }
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };
  return (
    <div className="relative" ref={calendarRef}>
      <div className="w-full h-[2.17rem] mobile:h-[42px] dark:bg-[#313131] dark:mobile:bg-[#2A4436] mobile:bg-white  px-[16px] border-[1.8px] border-[#656565]  dark:mobile:border-dashed mobile:border-[#00B152] mobile:border-dashed mobile:border-2 dark:border-none flex items-center rounded-[.78rem] mt-[.47rem]">
        <div>
          <img src="/icons/darkMode/datePicker.svg" alt="" />
        </div>
        <div>
          <input
            type="text"
            className="w-full dark:text-dark-text text-black mobile:text-black text-[.6rem] mobile:text-[14px] font-[500] bg-transparent border-none !focus:border-none !focus:outline-none focus:ring-0"
            placeholder="Select a date"
            // value={`${selectedDate?.getDate().toString().padStart(2, "0")}-${selectedDate?.getMonth() !== undefined
            //     ? (selectedDate.getMonth() + 1).toString().padStart(2, "0")
            //     : "00"
            //   }-${selectedDate?.getFullYear()}`}
            value={selectedDate ? FormattedDate(selectedDate, selectedCountry.currencyCulture): ""}
            onClick={() => setShowCalendar(!showCalendar)}
          />

        </div>
      </div>
      {showCalendar && (
        <div className="absolute top-full left-0 mt-1 w-[15.5rem] dark:bg-[#333]  bg-white rounded-[.78rem] shadow-lg z-[3000] ">
          <div className="flex justify-between p-2 pt-4 dark:bg-[#333] bg-white dark:text-[#F2F2F2] text-black text-[.86rem] font-[700]">
            <button onClick={handlePrevMonth}>
              <img src="/icons/darkMode/calendarPrev.svg" alt="" />
            </button>
            <span>
              {currentDate.toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </span>
            <button onClick={handleNextMonth}>
              <img src="/icons/darkMode/calendarNext.svg" alt="" />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 p-2">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
              <div
                key={day}
                className="text-center text-[.78rem] dark:text-[#BDBDBD] font-[400]"
              >
                {day}
              </div>
            ))}
            {renderCalendar()}
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;
