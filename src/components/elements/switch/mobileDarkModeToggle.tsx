import { useEffect, useRef } from "react";
import { useDarkMode } from "../../../theme/useDarkMode";
import gsap from "gsap";

const MobileDarKModeToggle = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const darkModeRef = useRef(null);
  const lightModeRef = useRef(null);
  useEffect(() => {
    const timeline = gsap.timeline();
    if (isDarkMode) {
      timeline.fromTo(
        darkModeRef.current,

        {
          fill: "#FFF",
          duration: 1,
        },
        {
          fill: "#313131",
          duration: 1,
        }
      );
    } else {
      timeline.fromTo(
        lightModeRef.current,

        {
          fill: "#313131",
          duration: 1,
        },
        {
          fill: "#FFF",
          duration: 1,
        }
      );
    }
  }, [isDarkMode]);
  return (
    <>
      {isDarkMode ? (
        <div onClick={toggleDarkMode} className="relative border border-[#7e7e7e] rounded-full">
          <img src="/icons/lightMode/mobileLightIcon.svg" alt="" />
        </div>
      ) : (

        <div onClick={toggleDarkMode}>
          <img src="/icons/darkMode/mobileDarkIcon.svg" alt="" />
        </div>
      )}
    </>
  );
};

export default MobileDarKModeToggle;
