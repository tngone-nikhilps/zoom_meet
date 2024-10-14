interface Props {
  title: string;
  classNames?: string;
  animateTime: number;
  onClick?: () => void;
  isLoading: boolean;
}
import gsap from "gsap";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
export const SelectionInput = ({
  title,
  classNames,
  onClick,
  animateTime,
  isLoading,
}: Props) => {
  const [isClicked, setIsClicked] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);
  useEffect((): any => {
    if (loaderRef.current) {
      const animation = gsap.to(loaderRef.current, {
        backgroundPositionX: "100%",
        duration: 1.2,
        repeat: -1,
        ease: "linear",
      });
      return () => animation.kill();
    }
  }, []);
  return (
    <motion.div
      initial={{ translateX: `90px` }}
      exit={{ border: isClicked ? "1px solid #00B152" : "" }}
      animate={{ translateX: 0 }}
      transition={{ duration: animateTime, ease: "anticipate" }}
      whileHover={{
        boxShadow: " 0px 15px 20.5px -4px rgba(0, 177, 82, 0.11)",
        borderColor: "#00B152",
      }}
      className={`w-[27rem] h-[3.4rem] mobile:w-full mobile:h-[48px] mobile:px-[1rem] flex items-center justify-between rounded-[20px] mobile:rounded-[10.6px] border-[2px] mobile:border-[.8px] mobile:border-[#656565] border-[#656565]  dark:bg-[#313131]	px-[41px] ${classNames} cursor-pointer`}
      onClick={() => {
        onClick ? onClick() : () => {};
        setIsClicked(true);
      }}
    >
      {isLoading ? (
        <>
          <div
            ref={loaderRef}
            className="w-full h-2 bg-gradient-to-r from-transparent dark:via-black via-white to-transparent bg-[length:300%_100%] bg-[#6d6d6d] rounded-full"
            style={{
              backgroundSize: "300% 100%",
            }}
          ></div>
        </>
      ) : (
        <>
          <div>
            <span className="dark:text-dark-text text-light-text text-[.86rem]">
              {title}
            </span>
          </div>
          <div>
            <img src="/icons/nextArrow.svg" alt="" />
          </div>
        </>
      )}
    </motion.div>
  );
};
