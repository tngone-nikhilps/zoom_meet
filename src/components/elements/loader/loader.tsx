import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";

function RotatingLoader() {
  const svgRef = useRef<any>(null);

  useLayoutEffect((): any => {
    const svg = svgRef.current;

    gsap.set(svg, { rotation: 0, transformOrigin: "center" });

    const tl = gsap.timeline({ repeat: -1, ease: "none" });

    tl.to(svg, {
      rotation: 360,
      duration: 1.5,
      ease: "none",
    });

    return () => tl.kill();
  }, []);

  return (
    <svg
      ref={svgRef}
      xmlns="http://www.w3.org/2000/svg"
      width="78"
      height="78"
      viewBox="0 0 78 78"
      fill="none"
    >
      <path
        id="loaderPath"
        d="M78 39C78 47.7821 75.0359 56.3071 69.5877 63.1949C64.1394 70.0827 56.5259 74.9301 47.9797 76.9521C39.4336 78.9742 30.4551 78.0527 22.4979 74.3367C14.5408 70.6207 8.07066 64.3279 4.13517 56.4769C0.199677 48.626 -0.970833 39.6766 0.813148 31.0776C2.59713 22.4786 7.23117 14.7334 13.965 9.096C20.6989 3.45857 29.1383 0.258908 37.917 0.0150395C46.6957 -0.228829 55.2998 2.49737 62.3362 7.75227L54.9125 17.6928C50.1145 14.1096 44.2476 12.2507 38.2615 12.417C32.2755 12.5832 26.5208 14.765 21.9292 18.6091C17.3375 22.4531 14.1776 27.7344 12.9612 33.5979C11.7447 39.4614 12.5429 45.5638 15.2264 50.9172C17.9099 56.2706 22.3217 60.5615 27.7476 63.0954C33.1734 65.6292 39.2957 66.2576 45.1231 64.8788C50.9505 63.5 56.142 60.1947 59.8571 55.498C63.5722 50.8014 65.5933 44.9883 65.5933 39H78Z"
        fill="#00B152"
      />
    </svg>
  );
}

export default RotatingLoader;
