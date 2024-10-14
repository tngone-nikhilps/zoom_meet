
import { useDarkMode } from "../../../theme/useDarkMode";

interface DateCardProps {
  day: string;
  date: string;
  month: string;
  isSelected: boolean;
  onClick: () => void;
}

const DateCard = ({ day, date, month, isSelected, onClick }: DateCardProps) => {
  const today = new Date();
  const isToday = today.getDate().toString() == date;
  const { isDarkMode } = useDarkMode();
  return (
    <>
      {" "}
      <div
        onClick={onClick}
        className={`w-[4.7rem] p-[.43rem] h-[4.48rem] mr-[.84rem] flex flex-col justify-between ${isSelected ? "bg-primary" : isDarkMode ? "bg-[#151515]" : "bg-white hover:bg-[#EFEFEF]"

          } ${isSelected ? "text-white" : "text-[#6D6D6D]"
          }  flex flex-col items-center rounded-[19px] ${isSelected ? "border-none" : "border-[1.5px]"
          } ${isToday ? "border-[#00B152]" : "border-[#656565]"}
        ${isToday ? isDarkMode ? "text-white" : "text-black" : "text-[#6D6D6D]"}
        `}
      >
        <div className="flex items-center justify-center h-fit">
          <span className="text-[.72rem] font-[400] leading-[1] block">
            {day}
          </span>
        </div>
        <div className="flex items-center justify-center h-fit">
          <span className="text-[1.3rem] font-[700] leading-[1] block">
            {date}
          </span>
        </div>
        <div className="flex items-center justify-center h-fit">
          <span className="text-[.72rem] font-[400] leading-[1] block">
            {month}
          </span>
        </div>
      </div>
    </>
  );
};
export default DateCard;
