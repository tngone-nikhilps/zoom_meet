import gsap from "gsap";
import { useEffect, useRef } from "react";
import { useDarkMode } from "../../../../theme/useDarkMode";
import { greeting } from "../../../../services/helpers/helper";
function Navbar() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const toggleIcon = useRef(null);
  useEffect(() => {
    // Check if the ref is attached to an element
    if (toggleIcon.current) {
      gsap.to(toggleIcon.current, {
        rotation: isDarkMode ? -180 : 0,
        left: isDarkMode ? 0 : 70, // Move x based on dark mode state
        duration: 0.5,
      });
    }
  }, [isDarkMode]);

  return (
    <div className="sticky top-0 right-0 w-full z-30  h-[4.48rem]">
      <nav className="dark:bg-[#151515] bg-white border-b border-[#212325]">
        <div className="flex flex-wrap items-center justify-between mx-auto p-4">
          <div>
            <div className="text-[1.3913rem] dark:text-white">Dashboard</div>
            <div className="text-[0.52174rem] text-[#909093]">{greeting()}</div>
          </div>
          <div className="flex gap-[0.43rem] items-center space-x-2">
            <div className="w-[123px] h-[46px] dark:bg-[#313131] bg-white dark:border-none border-[1px] border-black rounded-[23px] flex justify-between px-[12px] items-center relative" onClick={toggleDarkMode}>
              <div
                className="absolute left-0 cursor-pointer"
                ref={toggleIcon}

              >
                <img src="/icons/darkModeToggle.svg" alt="" />
              </div>
              <div className="">
                <img
                  src={
                    isDarkMode
                      ? "/icons/darkMode/darkMode.svg"
                      : "/icons/lightMode/darkMode.svg"
                  }
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
                  alt=""
                />
              </div>
            </div>
            <div className="flex justify-center items-center">
              <img
                src={
                  isDarkMode
                    ? "/icons/darkMode/notification-bing.svg"
                    : "/icons/lightMode/notification-bing.svg"
                }
                className="relative inline-flex rounded-full bg-sky-500"
              />
            </div>
            {/* <div className="flex justify-center items-center gap-[0.43rem]">
              <div className="w-[50px] h-[50px] overflow-hidden rounded-full">
                <img src="/icons/pro.jpg" alt="Profile Picture" />
              </div>
              <div className="text-[0.69565rem] dark:text-white">
                Alexim
              </div>
              <div>
                <img src="/icons/down-arrow.svg" alt="" />
              </div>
            </div> */}
          </div>
        </div>
      </nav>
    </div>
  );
}
export default Navbar;
