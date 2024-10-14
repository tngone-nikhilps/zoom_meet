import { gsap } from "gsap";
import { useEffect, useRef } from "react";
import ReactDOM from "react-dom";

const SVGLoader = () => {
  const containerRef = useRef(null);
  const dropRef = useRef(null);
  const drop2Ref = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const drop = dropRef.current;
    const drop2 = drop2Ref.current;

    gsap.set(["svg", container], {
      position: "absolute",
      top: "50%",
      left: "50%",
      xPercent: -50,
      yPercent: -50,
    });

    gsap.set(drop, {
      transformOrigin: "50% 50%",
    });

    const tl = gsap.timeline({
      repeat: -1,
      paused: false,
      repeatDelay: 0,
      immediateRender: false,
    });

    tl.timeScale(3);

    tl.to(drop, {
      duration: 4,
      attr: { cx: 250, rx: "+=10", ry: "+=10" },
      ease: "back.inOut(3)",
    })
      .to(
        drop2,
        {
          duration: 4,
          attr: { cx: 250 },
          ease: "power1.inOut",
        },
        "-=4"
      )
      .to(drop, {
        duration: 4,
        attr: { cx: 125, rx: "-=10", ry: "-=10" },
        ease: "back.inOut(3)",
      })
      .to(
        drop2,
        {
          duration: 4,
          attr: { cx: 125, rx: "-=10", ry: "-=10" },
          ease: "power1.inOut",
        },
        "-=4"
      );

    return () => {
      tl.kill();
    };
  }, []);

  return ReactDOM.createPortal(
    <div className="fixed z-50 inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="content">
        <div id="container" ref={containerRef}>
          <svg width="200" height="100" viewBox="0 0 400 200">
            <defs>
              <filter id="goo">
                <feGaussianBlur
                  in="SourceGraphic"
                  stdDeviation="7"
                  result="blur"
                />
                <feColorMatrix
                  in="blur"
                  mode="matrix"
                  values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 17 -7"
                  result="cm"
                />
                <feComposite in="SourceGraphic" in2="cm" />
              </filter>
              <filter id="f2" x="-200%" y="-40%" width="400%" height="200%">
                <feOffset in="SourceAlpha" dx="9" dy="3" />
                <feGaussianBlur
                  result="blurOut"
                  in="offOut"
                  stdDeviation="0.51"
                />
                <feComponentTransfer>
                  <feFuncA type="linear" slope="0.05" />
                </feComponentTransfer>
                <feMerge>
                  <feMergeNode />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <g filter="url(#goo)" style={{ fill: "#00B152" }}>
              <ellipse
                id="drop"
                ref={dropRef}
                cx="125"
                cy="90"
                rx="20"
                ry="20"
                fillOpacity="1"
                fill="#00B152"
              />
              <ellipse
                id="drop2"
                ref={drop2Ref}
                cx="125"
                cy="90"
                rx="20"
                ry="20"
                fillOpacity="1"
                fill="#00B152"
              />
            </g>
          </svg>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default SVGLoader;
