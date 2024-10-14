import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useConfigStore from "../../../configStore/store";
import { PATHS } from "../../../router";
import { formatNumber } from "../../../services/helpers/helper";
import useMediaQuery from "../../../services/hooks/useMediaQuery";
import { useDarkModeStore } from "../../../theme/store";
import RadioSelection from "../../elements/inputs/radioSelection";
import SelectSpecialization from "../../elements/inputs/select/specialization";
import SpecializationInformation from "../../elements/modals/specializationInformation";
import ViewAllSpecializations from "../../elements/modals/viewAllSpecialization";

function ChooseSpecialization() {
  const { isDarkMode } = useDarkModeStore();
  const isMobile = useMediaQuery("(max-width: 1024px)");
  const navigate = useNavigate();
  const location = useLocation();
  const level = location.state?.level;
  const industryId = location.state?.industry?.industryId;
  const { configs } = useConfigStore();

  const [trendings, setTrendings] = useState<null | any[]>(null);
  const [selectedSpecialization, setSelectedSpecialization] = useState<any>("");

  const container = useRef<any>(null);
  const details = useRef<any>(null);
  const specializationItems = useRef<any>(null);
  const [viewAllPopup, setViewAllPopup] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [specializationInfoPopup, setSpecializationInfoPopup] = useState(false);
  useEffect(() => {
    getTrendingSpecializations();
  }, []);
  console.log(isMobile, "isMobile");
  useEffect(() => {
    const timeline = gsap.timeline();
    if (!isMobile) {
      if (selectedSpecialization !== "" && !hasAnimated) {
        timeline
          .from(container.current, {
            justifyContent: "center",
            duration: 0,
          })
          .to(container.current, {
            justifyContent: "start",
            duration: 0.5,
            ease: "power2.inOut",
          })
          .from(
            container.current.children,
            {
              x: "30%",
              duration: 1,
              stagger: 0.1,
            },
            "<"
          );
        timeline.fromTo(
          details.current,
          {
            x: "100%",
            opacity: 0,
            display: "hidden",
          },
          {
            x: "0%",
            opacity: 1,
            duration: 0.8,
            display: "block",
            ease: "power2.out",
          },
          "-=.8"
        );

        setHasAnimated(true);
      } else if (selectedSpecialization === "") {
        gsap.fromTo(
          specializationItems.current,
          {
            x: "30px",
            duration: 0.5,
            ease: "power2.inOut",
          },
          {
            x: "0",
            duration: 0.5,
            ease: "power2.inOut",
          }
        );

        setHasAnimated(false);
      }
    } else {
      if (selectedSpecialization !== "") {
        setSpecializationInfoPopup(true);
      }
    }
  }, [selectedSpecialization]);

  const handleGetDetailsClose = () => {
    const timeline2 = gsap.timeline();
    timeline2
      .from(container.current, {
        justifyContent: "space-between",
        duration: 0,
      })
      .to(container.current, {
        justifyContent: "center",
        duration: 0.5,
        ease: "power2.inOut",
      })
      .from(
        container.current.children,
        {
          x: "-30%",
          duration: 1,
          stagger: 0.1,
        },
        "<"
      );
    timeline2.fromTo(
      details.current,
      {
        opacity: 1,
        display: "block",
      },
      {
        opacity: 0,
        duration: 0,
        display: "none",
        ease: "power2.out",
      },
      "-=.8"
    );

    setHasAnimated(false);
  };
  const getTrendingSpecializations = () => {
    const industry = configs.industries.find(
      (industry: any) => industry.industryId == industryId
    );
    setTrendings(industry.stacks);
  };
  useEffect(() => {
    const handleKeyDown = (event: { key: string }) => {
      if (event.key === "Enter" && selectedSpecialization) {
        navigate(PATHS.chooseSlots, {
          state: {
            level,
            industry: location.state?.industry,
            specialization: {
              stackId: selectedSpecialization.stackId,
              stack: selectedSpecialization.stack,
              description: selectedSpecialization.description,
            },
          },
        });
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedSpecialization]);
  const handleNext = () => {
    selectedSpecialization
      ? navigate(PATHS.chooseSlots, {
        state: {
          level: level,
          industry: location.state?.industry,
          specialization: {
            stackId: selectedSpecialization.stackId,
            stack: selectedSpecialization.stack,
            description: selectedSpecialization.description,
          },
        },
      })
      : null;
  };
  const handleOnClickRadioSelection = (specialization: any) => {
    setSelectedSpecialization(specialization);
    if (isMobile) {
      setSpecializationInfoPopup(true);
    }
  };
  return (
    <>
      <ViewAllSpecializations
        confirmFunction={() => ({})}
        setConfirmModalPopUp={setViewAllPopup}
        confirmModalPopUp={viewAllPopup}
        trendings={trendings}
        setSelectedSpecialization={setSelectedSpecialization}
        selectedSpecialization={selectedSpecialization}
      />
      <SpecializationInformation
        handleNext={handleNext}
        confirmModalPopUp={specializationInfoPopup}
        setConfirmModalPopUp={setSpecializationInfoPopup}
        selectedSpecialization={selectedSpecialization}
      ></SpecializationInformation>
      <div
        className="h-[100%] mobile:px-[.8rem] relative  text-[2.3vh] mobile:text-[1rem] flex w-[70em] mobile:w-full mx-auto mobile:mx-0  justify-center items-center mobile:justify-start px-auto overflow-hidden"
        ref={container}
      >
        <div
          className="w-fit min-w-[30rem] mobile:min-w-full  mobile:w-full flex flex-col mobile:flex-col-reverse items-center"
          ref={specializationItems}
        >
          <div className="mt-[1em] mobile:mt-[1rem]">
            <span className="dark:text-dark-text text-[1.2rem] mobile:hidden">
              {" "}
              Choose your specialization?
            </span>
          </div>
          <div className="max-w-[47em] w-fit mobile:w-full min-w-[30rem] mobile:min-w-full pb-[2em] dark:bg-[#313131] bg-white dark:border-none border-[1px] border-[#656565] rounded-[.78em] mt-[.5em] px-[1.7em]">
            <div className="pt-[1em]  flex justify-between items-center">
              <div className="flex items-center">
                <span className="text-[1.2em] dark:text-dark-text text-[#1B1B1B] mobile:text-[1.1rem]">
                  Trending
                </span>{" "}
                <span className="ml-[.43em]">
                  <img src="/icons/darkMode/trending.svg" alt="" />
                </span>
              </div>
              <div
                className="flex flex-col cursor-pointer"
                onClick={() => setViewAllPopup(true)}
              >
                <span className="text-[.8em] text-primary underline underline-offset-4">
                  View all
                </span>
              </div>
            </div>
            <div className="w-full h-[1px] bg-[#444] mt-[.5em]"></div>

            <div className="mt-[1.43em] flex flex-wrap  gap-[9px] mobile:gap-0 mobile:block">
              {trendings?.slice(0, 5).map((trending) => (
                <RadioSelection
                  title={trending.stack}
                  details={formatNumber(trending.count)}
                  onClick={() => {
                    handleOnClickRadioSelection(trending);
                  }}
                  isSelected={
                    selectedSpecialization.stackId === trending.stackId
                  }
                ></RadioSelection>
              ))}
            </div>
          </div>
          <div className="flex mt-[.7em] items-center w-full justify-center">
            <div className="h-[1px] bg-[#444444] w-[220px] mobile:w-full"></div>
            <div className="mx-[20px]">
              <span className="text-[1em] text-[#6D6D6D]">OR</span>
            </div>
            <div className="h-[1px] bg-[#444444] w-[220px] mobile:w-full"></div>
          </div>
          <div className="w-full mobile:hidden  pb-[1.5em] dark:bg-[#313131] bg-white dark:border-none border-[1px] border-[#656565] rounded-[18px] mt-[.78em] px-[1.69em]">
            <div className="flex  justify-center w-full">
              <span className="text-[1em] dark:text-dark-text mt-[2.43em] z-[13] relative">
                Search Specialization?
              </span>{" "}
            </div>
            <SelectSpecialization
              industryId={industryId}
              selectedSpecialization={selectedSpecialization}
              setSelectedSpecialization={setSelectedSpecialization}
            />
          </div>
          {isMobile && (
            <SelectSpecialization
              industryId={industryId}
              selectedSpecialization={selectedSpecialization}
              setSelectedSpecialization={setSelectedSpecialization}
            />
          )}

          <div
            onClick={handleNext}
            className={`w-full mt-[1.6em] h-[2.7em] flex justify-center items-center mobile:hidden  ${selectedSpecialization
                ? "border-none bg-primary cursor-pointer"
                : "border-[1px] bg-[#202020b8] cursor-not-allowed"
              }  border-[#00b1522b]  rounded-[6em] `}
          >
            {" "}
            <span
              className={`${selectedSpecialization
                  ? "text-white"
                  : "dark:text-[#626262] text-white"
                } `}
            >
              Continue
            </span>
          </div>
        </div>

        <div
          ref={details}
          className="w-[21.1em] ml-[1.87em] h-[25em] border-[2px] border-primary rounded-[.78rem] self-start mt-[3.5em] dark:bg-[#313131] bg-[#EFEFEF] px-[1.39rem] py-[1.74em] dark:text-white text-[#222] hidden"
        >
          <div className="flex justify-between items-center">
            <div>
              <span className="text-[1em] font-[600]">What do you get ?</span>
            </div>
            <div onClick={handleGetDetailsClose}>
              <img
                src={
                  isDarkMode
                    ? "/icons/darkMode/close.svg"
                    : "/icons/lightMode/close.svg"
                }
                className="w-[1em] h-[1em] cursor-pointer"
                alt=""
              />
            </div>
          </div>
          <div className="h-[1px] w-full mt-[.87em] bg-[#444]"></div>
          {selectedSpecialization.description?.map((item: any) => (
            <div className="flex items-start mt-[.87em]">
              <img
                src={
                  isDarkMode
                    ? "/icons/darkMode/rightTick.svg"
                    : "/icons/lightMode/rightTick.svg"
                }
                className="w-[1em] h-[1em]"
                alt=""
              />{" "}
              <span className="text-[.69rem] ml-[8px] leading-[0.95rem] font-[400]">
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default ChooseSpecialization;
