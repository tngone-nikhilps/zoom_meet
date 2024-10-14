import { gsap } from "gsap";
import { useEffect, useRef } from "react";
import ReactDOM from "react-dom";

const SVGLoader = () => {
  const boxContainerRef = useRef(null);
  const boxLoaderRef = useRef(null);
  const baseRef = useRef(null);

  useEffect(() => {
    const boxContainer = boxContainerRef.current;
    const boxLoader = boxLoaderRef.current;
    const base = baseRef.current;

    gsap.set([boxLoader, base], {
      position: "absolute",
      top: "50%",
      left: "50%",
      xPercent: -50,
      yPercent: -50,
    });

    gsap.set(boxContainer, {
      position: "absolute",
      top: "50%",
      left: "50%",
      xPercent: -50,
      yPercent: -50,
    });

    const tl = gsap.timeline({ repeat: -1 });
    tl.timeScale(1.2);

    tl.set(boxLoader, {
      transformOrigin: "0% 100%",
      left: "+=70",
      top: "-=35",
    })
      .to(boxLoader, { rotation: -90, duration: 1, ease: "power4.inOut" })
      .set(boxLoader, { transformOrigin: "0% 100%", left: "-=70", rotation: 0 })
      .to(boxLoader, { rotation: -90, duration: 1, ease: "power4.inOut" })
      .set(boxLoader, { transformOrigin: "0% 100%", left: "-=70", rotation: 0 })
      .to(boxLoader, { rotation: -270, duration: 1, ease: "power4.inOut" })
      .to(
        boxContainer,
        { rotation: 180, duration: 1, ease: "back.inOut" },
        "-=1"
      )
      .set(boxLoader, { transformOrigin: "100% 0%", top: "+=70", rotation: 0 })
      .to(boxLoader, { rotation: -90, duration: 1, ease: "power4.inOut" })
      .set(boxLoader, { transformOrigin: "100% 0%", left: "+=70", rotation: 0 })
      .to(boxLoader, { rotation: -90, duration: 1, ease: "power4.inOut" })
      .set(boxLoader, { transformOrigin: "100% 0%", left: "+=70", rotation: 0 })
      .to(boxLoader, { rotation: -270, duration: 1, ease: "power4.inOut" })
      .to(
        boxContainer,
        { rotation: 180, duration: 1, ease: "back.inOut" },
        "-=1"
      );

    return () => {
      tl.kill();
    };
  }, []);

  return ReactDOM.createPortal(
    <div className="fixed z-50 inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="svg-container" ref={boxContainerRef}>
        <svg
          ref={boxLoaderRef}
          id="boxLoader"
          width="70px"
          height="70px"
          viewBox="0 0 35 35"
          preserveAspectRatio="none"
        >
          <rect x="0" fill="#00B152" width="35" height="35" />
        </svg>
        <circle
          fill="none"
          stroke="#fff"
          stroke-width="1"
          stroke-miterlimit="10"
          stroke-dasharray="10,10"
          cx="50"
          cy="50"
          r="39"
        >
          <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="rotate"
            dur="5s"
            from="0 50 50"
            to="-360 50 50"
            repeatCount="indefinite"
          />
        </circle>
        <svg
          ref={baseRef}
          id="base"
          width="210px"
          height="210px"
          viewBox="0 0 105 105"
          preserveAspectRatio="none"
        >
          <line
            strokeWidth="1.5"
            fill="none"
            stroke="#FFFFF"
            strokeMiterlimit="10"
            x1="0"
            y1="52.5"
            x2="105"
            y2="52.5"
          />
        </svg>
      </div>
    </div>,
    document.body
  );
};

export default SVGLoader;
