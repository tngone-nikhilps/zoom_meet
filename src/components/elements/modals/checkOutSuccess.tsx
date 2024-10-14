import ReactDOM from "react-dom";
interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
}
function CheckOutSuccess({ open, setOpen }: Props) {
  if (!open) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center flex-col top-10">
      <div className="dark:bg-[#1F1F1F] dark:text-white bg-white rounded-[1.13043rem] border border-white/[54%] shadow-lg  p-[1.5rem] w-[22.73913rem] h-[26.35313rem] flex flex-col items-center relative">
        <div
          className="text-white absolute top-[-1.5rem] right-[-1rem] z-1000 cursor-pointer"
          onClick={() => setOpen(false)}
        >
          <img src="/icons/darkMode/pop-up-close.svg" alt="" />
        </div>
        <div className="w-[20.49439rem] h-[14.36626rem] rounded-[0.95652rem] overflow-hidden">
          <img src="/success.gif" alt="" />
        </div>
        <div className="mt-[1.5rem] flex flex-col justify-center items-center">
          <div className="text-[#00B152] text-[1.43661rem] font-extrabold">
            Congratulations!
          </div>
          <div className="text-[0.78261rem] text-center">
            Our cutting-edge expert-guided interview platform helps showcase
            your true potential
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default CheckOutSuccess;
