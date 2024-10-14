import axios from "axios";
import { useState } from "react";
import { ENDPOINTS } from "../../../../services/urls";
import { useDarkMode } from "../../../../theme/useDarkMode";
import OtpVerifyModal from "../../../elements/modals/otpVerifyModal";
import SignInWithGoogle from "../verifications/signInWithGoogle";
import SignInWithLinkedin from "../verifications/signInWithLinkedin";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../../../router";
function LoginPage() {
  const { isDarkMode } = useDarkMode();
  const navigate = useNavigate();
  const [emailAddress, setEmailAddress] = useState("");
  const [emailError, setEmailError] = useState("");
  const [spinner, setSpinner] = useState(false);
  const [openOtpVerifyModal, setOpenOtpVerifyModal] = useState(false);

  const validateEmail = async (email: string) => {
    const isValidEmail =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email === "") {
      setEmailError("Enter Email");
      return false;
    }
    if (!isValidEmail.test(email)) {
      setEmailError("Enter Valid Email");
      return false;
    } else {
      setEmailError("");
      return true;
    }
  };
  const handleKeyPress = (event: any): void => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleLogin();
    }
  };
  const handleLogin = async () => {
    if (await validateEmail(emailAddress)) {
      setSpinner(true);
      const body = {
        email: emailAddress,
      };
      await axios
        .post(ENDPOINTS.USER_LOGIN, body)
        .then((response) => {
          setSpinner(false);
          if (response.data.isSuccess == true) {
            setOpenOtpVerifyModal(true);
          } else {
            setEmailError(response.data.error);
          }
        })
        .catch((error) => {
          console.log(error);
          setSpinner(false);
        })
        .finally(() => {
          setSpinner(false);
        });
    }
  };
  const handleSignUp = () => {
    navigate(PATHS.signup);
  };
  return (
    <>
      <div className="w-[100vw] h-[100vh] dark:bg-black mobile:px-2">
        <div className="w-full h-full flex">
          <div className="w-1/2 mobile:w-full flex justify-center items-center">
            <div className="w-[22.43478rem] flex justify-between flex-col">
              <div className="w-[11.82rem]" onClick={() => navigate(PATHS.chooseLevel)}>
                <img
                  src={
                    isDarkMode
                      ? "/icons/darkMode/fullLogo.svg"
                      : "/icons/lightMode/fullLogo.svg"
                  }
                  alt=""
                  className="w-auto h-[3.325rem]"
                />
              </div>
              <div className="dark:text-white text-[1.3913rem] font-semibold mt-5">
                Login
              </div>
              <div className="mt-5">
                <label className="text-[0.78261rem] opacity-[0.8] dark:text-white">
                  Email address
                </label>
                <div className="mt-[0.65rem]">
                  <input
                    onKeyDown={handleKeyPress}
                    className={`h-[2.43478rem] p-2 dark:text-white w-full rounded-[12px] ${emailError ? "border-red-500" : "border-[#D8D8D8]"
                      } dark:bg-black border text-[0.78261rem]`}
                    onChange={(e) => {
                      setEmailAddress(e.target.value);
                      setEmailError("");
                    }}
                  />
                </div>
                <div className="my-1">
                  {emailError && (
                    <p className="text-red-500 text-[0.6rem]">{emailError}</p>
                  )}
                </div>
              </div>
              <div className="mt-5">
                <button
                  disabled={spinner}
                  className="w-full h-[2.43478rem] rounded-[12px] cursor-pointer bg-[#00B152] text-white text-[0.86957rem]"
                  onClick={handleLogin}
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
                  Login
                </button>
              </div>
              <div className="mt-5 flex gap-4 items-center">
                <div className="w-1/2 h-0 border border-t-0 border-[#6E6E6E]"></div>
                <div className="text-[#6E6E6E] text-[16px]">or</div>
                <div className="w-1/2 h-0 border border-t-0 border-[#6E6E6E]"></div>
              </div>
              <div>
                <div className="mt-5">
                  <SignInWithGoogle />
                </div>
                <div className="mt-2">
                  <SignInWithLinkedin />
                </div>
                <div className="mt-2 text-[0.78261rem] text-center dark:text-white text-black">
                  Don't have an account? <span className="text-[#00B152] cursor-pointer" onClick={handleSignUp}>Sign up</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 flex items-center  mobile:hidden">
            <div className="rounded-lg overflow-hidden w-[25.95652rem] h-auto">
              <img src="/login.svg" alt="" className="w-full h-full" />
            </div>
          </div>
        </div>
      </div>
      {openOtpVerifyModal &&
        <OtpVerifyModal openModal={openOtpVerifyModal} setOpenModal={setOpenOtpVerifyModal} userEmail={emailAddress} />
      }
    </>
  );
}
export default LoginPage;
