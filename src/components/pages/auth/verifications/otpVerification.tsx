import axios from "axios";
import React, {
  ChangeEvent,
  ClipboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "../../../../authStore/store";
import { PATHS } from "../../../../router";
import { ENDPOINTS } from "../../../../services/urls";
const OtpVerification: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { setUserId, setToken, setUserType, setUserEmail } = useAuthStore();
  const length = 6;
  const [value, setValue] = useState<string[]>(Array(length).fill(''));
  const [validateOtp, setValidateOtp] = useState<string>("");
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const [time, setTime] = useState(120);
  const [isResend, setIsResend] = useState(false);
  const [spinner, setSpinner] = useState(false);

  useEffect(() => {
    if (inputsRef.current[0]) {
      inputsRef.current[0]?.focus();
    }
  }, []);

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const text = event.clipboardData.getData("Text").match(/\d/g);
    if (!text || !text.length) return;
  
    const pastedFrom = parseInt(
      event.currentTarget.getAttribute("data-index") || "0",
      10
    );
  
    const newValue = Array(length).fill(''); 
    const pastedValue = text.slice(0, length - pastedFrom);
  
    pastedValue.forEach((char, i) => {
      newValue[pastedFrom + i] = char;
      if (inputsRef.current[pastedFrom + i]) {
        inputsRef.current[pastedFrom + i]!.value = char;
      }
    });
  
    setValue(newValue);
  
    const nextEmptyIndex = newValue.findIndex((v, i) => i > pastedFrom && v === '');
    focusNextInput(nextEmptyIndex !== -1 ? nextEmptyIndex - 1 : length - 1);
  };
  const focusNextInput = (currentIndex: number) => {
    const nextIndex = currentIndex + 1;
    if (inputsRef.current[nextIndex]) {
      inputsRef.current[nextIndex]?.focus();
      inputsRef.current[nextIndex]?.select();
    } else {
      inputsRef.current[length - 1]?.focus();
      inputsRef.current[length - 1]?.select();
    }
  };

  const focusPreviousInput = (currentIndex: number) => {
    const previousIndex = currentIndex - 1;
    if (inputsRef.current[previousIndex]) {
      inputsRef.current[previousIndex]?.focus();
      inputsRef.current[previousIndex]?.select();
    }
  };
  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    setValidateOtp("");
    const input = event.target as HTMLInputElement;
    const newChar = input.value.slice(-1);
    
    setValue((prevValue) => {
      const newValue = [...prevValue];
      if (newChar) {
        newValue[index] = newChar;
        focusNextInput(index);
      } else {
        newValue[index] = '';
        focusPreviousInput(index);
      }
      return newValue.slice(0, length);
    });
  };
  const handleVerifyOTP = () => {
    if (value.length !== 6) {
      setValidateOtp("Please enter valid OTP");
    } else {
      setSpinner(true);
      setValidateOtp("");
      const otp = value.join("");
      const body = {
        email: state?.email,
        code: otp,
      };
      axios
        .post(ENDPOINTS.OTP_VERIFY, body)
        .then((response) => {
          setSpinner(false);
          if (response.data.success == true) {
            setUserId(response.data.userId);
            setToken(response.data.token);
            setUserType(response.data.userType);
            setUserEmail(response.data.email);
            navigate(PATHS.dashboard);
          } else {
            setValidateOtp(response.data.error);
          }
        })
        .finally(() => {
          setSpinner(false);
        });
    }
  };
  useEffect(() => {
    startTimer();
  }, []);
  const startTimer = () => {
    setIsResend(false);
    const timer = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime === 0) {
          clearInterval(timer);
          setIsResend(true);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  };

  const ResendOTPFun = async () => {
    setValue(Array(length).fill(''));
    setValidateOtp("");

    inputsRef.current.forEach((input) => {
      if (input) {
        input.value = '';
      }
    });
    setTime(120);
    startTimer();
    var body = {
      email: state?.email,
    };
    await axios.post(ENDPOINTS.USER_LOGIN, body).then(() => {
    });
  };
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(1, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };
  return (
    <div className="flex items-center justify-center min-h-screen w-full  dark:bg-black p-16 dark:text-white">
      <div className="relative  dark:bg-[#313131] border border-black  rounded-[38px]  w-[10.91304rem] mobile:w-[18rem] h-[24.56522rem] flex  items-center flex-col">
        <div className="block text-[1.17439rem]  font-medium text-center mt-[2.87rem]">
          OTP Verification
        </div>
        <div className="flex text-[0.91339rem] mt-[0.87rem]">
          Enter the OTP sent to{" "}
          <p className="font-semibold">- {state?.email}</p>
        </div>
        <form
          id="enter-pin"
          className="flex flex-row flex-wrap justify-center space-x-4 mt-[2.71rem]"
          onSubmit={(e) => e.preventDefault()}
        >
          {[...Array(length)].map((_, index) => (
            <input
              key={index}
              data-index={index}
              ref={(el) => (inputsRef.current[index] = el)}
              className={`w-[3.78409rem] h-[3.78409rem] mb-4 rounded-[15px] dark:bg-[#313131] border-[2px] border-[#D9D9D9] p-3 text-center appearance-none text-[1.17439rem] font-medium focus:border-[#00B152] focus:outline-none focus:ring-0 ${validateOtp !== "" && "border-red-500"
                }`}
              type="text"
              maxLength={1}
              onPaste={(e) =>
                handlePaste(e as ClipboardEvent<HTMLInputElement>)
              }
              onKeyDown={(e) => {
                if (
                  e.key === "Backspace" &&
                  (e.target as HTMLInputElement).value === ""
                ) {
                  e.preventDefault();
                  focusPreviousInput(index);
                }
                if (
                  e.key === "Enter"
                ) {
                  handleVerifyOTP();
                }
              }}
              onChange={(e) => {
                handleInputChange(e, index);
              }}
              aria-label={`Pin ${index + 1}`}
              autoComplete="off"
            />
          ))}
        </form>
        <div>
          {validateOtp !== "" && (
            <p className="text-red-500 text-[0.6rem]">{validateOtp}</p>
          )}
        </div>
        <div className="text-[#00B152] text-[0.80548rem] mt-[0.6rem]">
          {formatTime(time)}
        </div>
        <div className="flex text-[0.76222rem] mt-[0.79rem]">
          Don’t receive code ? &nbsp;
          <div
            className={`font-semibold ${isResend ? "text-[#00B152]" : "text-gray-500"
              } cursor-pointer `}
            onClick={isResend ? () => ResendOTPFun() : () => { }}
          >
            Re-send
          </div>
        </div>
        <div>
          <button
            disabled={spinner}
            className="w-[18.37035rem] h-[1.9937rem] rounded-[12px] bg-[#00B152] text-white text-[0.71204rem] mt-[2.17rem]"
            onClick={handleVerifyOTP}
          >
            <svg
              role="status"
              className={`inline w-4 h-4 me-3 text-white animate-spin ${spinner ? "" : "hidden"
                }`}
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="#E5E7EB"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentColor"
              />
            </svg>
            Verify OTP
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;
