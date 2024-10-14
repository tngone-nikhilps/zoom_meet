import PropTypes from "prop-types";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import gsap from "gsap";

import AnimatedOutlet from "../../elements/routeAnimator/animatedRoutes";
import { useDarkMode } from "../../../theme/useDarkMode";
import CountrySelect from "../../elements/inputs/select/countrySelect";
import useMediaQuery from "../../../services/hooks/useMediaQuery";
import MobileDarKModeToggle from "../../elements/switch/mobileDarkModeToggle";
const AuthLayout = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const isMobile = useMediaQuery("(max-width: 1024px)");
  const toggleIcon = useRef(null);
  const navigate = useNavigate();
  const layout = useRef(null);
  const location = useLocation();
  useEffect(() => {
    // Check if the ref is attached to an element
    if (toggleIcon.current) {
      gsap.to(toggleIcon.current, {
        rotation: isDarkMode ? -180 : 0,
        left: isDarkMode ? 0 : "3.3em", // Move x based on dark mode state
        duration: 0.5,
      });
    }
    if (isDarkMode) {
      gsap.to(layout.current, { backgroundColor: "#151515", duration: 0.5 });
    } else {
      gsap.to(layout.current, { backgroundColor: "#ffffff ", duration: 0.5 });
    }
  }, [isDarkMode]);

  return (
    <>
      <div
        ref={layout}
        className=" w-full h-[100svh]  bg-light-background dark:bg-dark-background overflow-y-auto z-[2000]"
      >
        {/* <div className="fixed bottom-[80px] right-[80px]">
          <img src="/icons/chatBot.svg" alt="" />
        </div> */}
        <div className="flex fixed top-0 left-0 z-[40] justify-between items-center text-[1.2rem] h-[5rem] mobile:h-[65px] px-[80px] mobile:px-[1rem] w-full bg-light-background dark:bg-dark-background border-b-[1px] border-[#444]">
          <div>
            <img
              src={
                isDarkMode
                  ? "/icons/darkMode/fullLogo.svg"
                  : "/icons/lightMode/fullLogo.svg"
              }
              className="w-[10.5em] mobile:w-[9rem] h-auto"
              alt="logo"
              onClick={() => navigate("/")}
            />
          </div>
          <div className="flex justify-between gap-[23px]">
            {!isMobile ? (
              <>
                {" "}
                <div
                  className="w-[5.3em] cursor-pointer h-[2em] dark:bg-[#313131] dark:border-none border-[1px] border-black rounded-[1em] flex justify-between px-[12px] items-center relative"
                  onClick={toggleDarkMode}
                >
                  <div
                    className="absolute left-0 cursor-pointer"
                    ref={toggleIcon}
                  >
                    <img
                      src="/icons/darkModeToggle.svg"
                      alt=""
                      className="w-[1.9em] h-auto"
                    />
                  </div>
                  <div>
                    <img
                      src={
                        isDarkMode
                          ? "/icons/darkMode/darkMode.svg"
                          : "/icons/lightMode/darkMode.svg"
                      }
                      className="w-[.93em] h-auto "
                      alt=""
                    />
                  </div>
                  <div>
                    <img
                      src={
                        isDarkMode
                          ? "/icons/darkMode/lightMode.svg"
                          : "/icons/lightMode/lightMode.svg"
                      }
                      className="w-[.93em] h-auto "
                      alt=""
                    />
                  </div>
                </div>
                {location.pathname !== "/check-out" &&
                  location.pathname !== "/payment-success" && (
                    <CountrySelect></CountrySelect>
                  )}
              </>
            ) : (
              <>
                {" "}
                <div className="flex items-center gap-[1rem]">
                  {location.pathname !== "/check-out" &&
                    location.pathname !== "/payment-success" && (
                      <CountrySelect></CountrySelect>
                    )}
                  <MobileDarKModeToggle></MobileDarKModeToggle>
                </div>
              </>
            )}
          </div>
        </div>

        <main className=" mt-[5rem] mobile:mt-[70px]">
          <AnimatedOutlet />
        </main>
      </div>
    </>
  );
};

AuthLayout.propTypes = {
  children: PropTypes.node,
};

export default AuthLayout;
