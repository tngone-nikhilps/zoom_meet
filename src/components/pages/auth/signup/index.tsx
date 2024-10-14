import { useEffect, useRef, useState } from "react";

import axios from "axios";
import { ENDPOINTS } from "../../../../services/urls";
import { useNavigate } from "react-router-dom";
import { useDarkMode } from "../../../../theme/useDarkMode";
import { PATHS } from "../../../../router";
import SignInWithGoogle from "../verifications/signInWithGoogle";
import SignInWithLinkedin from "../verifications/signInWithLinkedin";
import OtpVerifyModal from "../../../elements/modals/otpVerifyModal";
import { formatPhoneNumber } from "../../../../services/helpers/helper";
import { CountryCode } from "libphonenumber-js";
function SignUp() {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();
  const [toggleCountryCode, setToggleCountryCode] = useState(false);
  const [countryCodes, setCountryCodes] =
    useState<{ countryName: string; countryCode: string; flag: string,regionName: string }[]>();
  const [emailAddress, setEmailAddress] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [phoneIsValid,setPhoneIsValid] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const [openOtpVerifyModal, setOpenOtpVerifyModal] = useState(false);
  //errors
  const [phoneNumberError, setPhoneNumberError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [selectedCountryCode, setSelectedCountryCode] = useState<{
    countryName: string;
    countryCode: string;
    flag: string;
    regionName: string;
  }>({
    countryName: "India",
    countryCode: "+91",
    flag: "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",
    regionName: "IND"
  });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const handleVerification = (email: string, phone: string) => {
    const isValidEmail =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let valid = true;
    if (email === "") {
      setEmailError("Enter Email");
      valid = false;
    } else {
      if (!isValidEmail.test(email)) {
        setEmailError("Enter valid email");
        valid = false;
      }
    }
    if (phone === "") {
      setPhoneNumberError("Enter phone number");
      valid = false;
    } else {
      if (!phoneIsValid) {
        setPhoneNumberError("Enter valid phone number");
        valid = false;
      }
    }
    return valid;
  };
  const handleSignup = () => {
    if (handleVerification(emailAddress, phoneNumber)) {
      const body = {
        email: emailAddress,
        phoneNumber: phoneNumber,
        userType: "CUSTOMER",
        countryCode: selectedCountryCode?.countryCode,
      };
      setSpinner(true);
      axios
        .post(ENDPOINTS.USER_SIGNUP, body)
        .then((response) => {
          setSpinner(false);
          if (response.data.isSuccess == true) {
            setOpenOtpVerifyModal(true);
          } else {
            setEmailError(response.data.error);
          }
        })
        .catch(() => {
          setSpinner(false);
        })
        .finally(() => {
          setSpinner(false);
        });
    }
  };
  useEffect(() => {
    axios.get(ENDPOINTS.GET_ALL_COUNTRY_CODE).then((response) => {
      setCountryCodes(response.data);
    });
  }, []);
  const handleToggleCountryCode = () => {
    setToggleCountryCode(!toggleCountryCode);
  };

  const handleSelectCountryCode = (data: {
    countryName: string;
    countryCode: string;
    flag: string;
    regionName: string;
  }) => {
    setPhoneNumber("");
    setSelectedCountryCode(data);
    setToggleCountryCode(false);
  };
  const handleKeyPress = (event: any): void => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSignup();
    }
  };
  const handleEmailEnter = (event: any): void => {
    if (event.key === 'Enter') {
      event.preventDefault();
      phoneInputRef.current?.focus();
    }
  }
  const handlePhoneNoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumberError("");

    const input = e.target.value.replace(/\D/g, ""); // Remove non-digit characters

    const formattedNumber = formatPhoneNumber(input, selectedCountryCode?.regionName.slice(0, 2) as CountryCode);

    if (formattedNumber !== null) {
      setPhoneNumber(formattedNumber.formattedNumber);
      setPhoneIsValid(formattedNumber.isValid);
    } else {
      setPhoneNumber(input); // Keep the raw input for further attempts
    }
  };
  return (
    <>
  {openOtpVerifyModal &&
      <OtpVerifyModal openModal={openOtpVerifyModal} setOpenModal={setOpenOtpVerifyModal}  userEmail={emailAddress}/>
      }
      <div className="h-[100vh] w-[100vw] dark:bg-black flex">
        <div className="w-1/2 mobile:w-full h-full px-[5%] py-[2%]  flex flex-col items-center">
          <div className="w-full h-full dark:text-white flex flex-col items-end justify-center">
            <div className="w-[22.43478rem] mobile:w-full">
              <div className="h-[3.325rem]" onClick={() => navigate(PATHS.chooseLevel)}>
                <img
                  src={
                    isDarkMode
                      ? "/icons/darkMode/fullLogo.svg"
                      : "/icons/lightMode/fullLogo.svg"
                  }
                  alt=""
                  className="w-auto h-full"
                />
              </div>
              <div className="dark:text-white text-[1.3913rem] font-bold justify-normal mt-[2.3rem]">
                Sign up
              </div>
              <div className="mt-[1.4rem] flex flex-col gap-[0.65rem]">
                <label className="text-[0.78261rem] opacity-[0.8]">
                  Your Email
                </label>
                <input
                  onKeyDown={handleEmailEnter}
                  type="text"
                  className={`w-full h-[2.43478rem] text-[0.78261rem] border dark:bg-black rounded-lg ${emailError ? "border-red-500" : "dark:border-white"
                    }`}
                  onChange={(e) => { setEmailAddress(e.target.value); setEmailError("") }}
                />
              </div>
              <div className="mt-1">
                {emailError && (
                  <div className="text-red-500 text-[0.6rem]">{emailError}</div>
                )}
              </div>
              <div className="mt-5 flex flex-col gap-[0.65rem]">
                <label className="text-[0.78261rem] opacity-[0.8]">
                  Your Phone
                </label>
                <form className="relative">
                  <div className="flex items-center">
                    <button
                      id="dropdown-phone-button"
                      data-dropdown-toggle="dropdown-phone"
                      className="h-[2.43478rem] w-[5.5rem] gap-2 flex-shrink-0 z-10 inline-flex items-center py-2.5 px-2  text-[0.78261rem] font-medium text-center dark:text-white dark:bg-black border dark:border-gray-300 border-black rounded-s-lg dark:hover:bg-gray-800 hover:bg-gray-200 focus:ring-[0.5px] focus:outline-none focus:ring-gray-100 "
                      type="button"
                      onClick={handleToggleCountryCode}
                    >
                      <div className="w-[1.13043rem] h-[1.17391rem] rounded-full overflow-hidden ">
                        <img
                          src={`data:image/png;base64,${selectedCountryCode.flag}`}
                          alt=""
                          className="w-full h-full object-fill"
                        />
                      </div>
                      <div>{selectedCountryCode.countryCode}</div>
                      <div
                        className={`w-[0.652rem] h-auto transition delay-100 duration-700 ${toggleCountryCode ? "rotate-0" : "rotate-180"
                          }`}
                      >
                        <img src="/icons/darkMode/up-arrow.svg" alt="" />
                      </div>
                    </button>
                    <div
                      className={`${toggleCountryCode ? "block" : "hidden"
                        } absolute top-[60px] z-10 dark:bg-[#656565] bg-white dark:text-white divide-y divide-gray-100 rounded-lg shadow w-52 border border-black`}
                      ref={dropdownRef}
                    >
                      <ul
                        className={`dropdown-content ${toggleCountryCode ? "block" : "hidden"
                          } py-2 text-sm overflow-x-auto`}
                        aria-labelledby="dropdown-phone-button"
                      >
                        {countryCodes?.map((code, index) => (
                          <li key={index}>
                            <button
                              type="button"
                              className="inline-flex items-center w-full gap-1 px-4 py-2  dark:text-white text-[0.6087rem] font-medium  dark:hover:bg-gray-600 dark:hover:text-white hover:bg-gray-300"
                              role="menuitem"
                              onClick={() => handleSelectCountryCode(code)}
                            >
                              <div className="w-[1.13043rem] h-[1.17391rem] rounded-full overflow-hidden ">
                                <img
                                  src={`data:image/png;base64,${code.flag}`}
                                  alt=""
                                  className="w-10 h-auto"
                                />
                              </div>
                              <div>{code.countryName}</div>
                              <div>({code.countryCode})</div>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="relative w-full">
                      <input
                        ref={phoneInputRef}
                        onKeyDown={handleKeyPress}
                        value={phoneNumber}
                        type="text"
                        id="phone-input"
                        className={`block h-[2.43478rem] p-2.5 w-full text-[0.78261rem] z-20  rounded-e-lg border-s-0 border dark:bg-black dark:border-white dark:placeholder-gray-400 dark:text-white ${phoneNumberError
                          ? "border-red-500"
                          : "dark:border-white"
                          }`}
                        onChange={handlePhoneNoChange}
                      />
                    </div>
                  </div>
                  <div>
                    {phoneNumberError && (
                      <span className="text-red-500 text-[0.6rem]">
                        {phoneNumberError}
                      </span>
                    )}
                  </div>
                </form>
              </div>
              <div className="mt-5">
                <button
                  className="w-full h-[2.43478rem] rounded-lg bg-[#00B152] text-white text-[0.86957rem]"
                  onClick={handleSignup}
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
                  Sign up
                </button>
              </div>
              <div className="mt-5 flex gap-4 items-center">
                <div className="w-1/2 h-0 border border-gray-700"></div>
                <div className="text-[#6E6E6E] text-[16px]">or</div>
                <div className="w-1/2 h-0 border border-gray-700"></div>
              </div>
              <div className="mt-5">
                <SignInWithGoogle />
              </div>
              <div className="mt-2">
                <SignInWithLinkedin />
              </div>
              <div className="mt-5 flex flex-col justify-center items-center text-[0.78261rem]">
                <div>Already have an account?</div>
                <div>
                  <button
                    className="text-[#00B152] font-semibold underline"
                    onClick={() => navigate(PATHS.login)}
                  >
                    Log In
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 flex  items-center p-6 mobile:hidden">
          <img
            src="/signup-img.png"
            alt="Signup"
            className="w-auto h-[32rem]  rounded-[32px] "
          />
        </div>
      </div>
    </>
  );
}

export default SignUp;
