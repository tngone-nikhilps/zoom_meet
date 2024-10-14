import { useEffect, useState } from "react";
import useAxiosAuthKey from "../../../customizedAxios/useAxiosAuthKey";
import { getDetailedTimeZoneInfo } from "../../../services/helpers/helper";
import { ENDPOINTS } from "../../../services/urls";
import ChooseResumeModal from "../../elements/modals/chooseResumeModal";
import dashboardWorkspaceImg from "/icons/banner.png";
import InterviewCard from "../../elements/cards/interviewCard";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../../router";

function Dashboard() {
  const axios = useAxiosAuthKey();
  const navigate = useNavigate();
  const { timeZoneName } = getDetailedTimeZoneInfo();
  const [loader, setLoader] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [toggleChooseResumeModale, setToggleChooseResumeModale] =
    useState(false);
  const [, setSelectedResume] = useState<{
    resumeName: string;
    resumeId: string;
  }>();
  const handleSeeAllToggle = () => {
    setShowAll(!showAll);
  };
  const [upComingInterviews, setUpComingInterviews] = useState([]);
  useEffect(() => {
    setSelectedResume({ resumeName: "Resume 1", resumeId: "1" });
  }, []);
  console.log(timeZoneName, "timezoneName");
  const handleGetAllUpcomingInterviews = () => {
    setLoader(true);
    const body = {
      timeZone: "India Standard Time",
    };
    axios
      .post(ENDPOINTS.GET_ALL_UPCOMING_INTERVIEWS, body)
      .then((response) => {
        setLoader(false);
        setUpComingInterviews(response.data.interviews);
      })
      .catch((error) => {
        setLoader(false);
        console.log(error);
      });
  };
  useEffect(() => {
    handleGetAllUpcomingInterviews();
  }, []);
  // Example: Toggle blinking state
  // useEffect(() => {
  //     // Start blinking for 5 seconds as an example
  //     setIsBlinking(true);
  //     const timer = setTimeout(() => setIsBlinking(false), 5000);
  //     return () => clearTimeout(timer);
  // }, []);
  const handleAddNewInterview = () => {
    navigate(PATHS.chooseLevel);
  };
  // const sampleItems = {
  //     startDateTime: "2023-01-01T00:00:00.000Z",
  //     startTime: "02:00pm",
  //     duration: "1hr",
  //     stack: "Java",

  // }
  return (
    <div className="w-full h-full">
      <div className="w-full h-fit rounded-2xl overflow-hidden flex justify-end items-center relative">
        <img src={dashboardWorkspaceImg} alt="" className="w-full h-auto" />
        <div className="absolute z-10 right-[3.2rem]">
          <button className="w-[7.05752rem] text-[0.69565rem] h-[2rem] rounded-full bg-black text-white">
            Apply
          </button>
        </div>
      </div>
      <div className="gap-[1.3rem] mt-[1.3rem] rounded-2xl border border-[#3f4144] p-[0.87rem] 2xl:px-[1.5rem]">
        <div className="flex justify-between">
          <div className="dark:text-white text-[0.86957rem] opacity-[0.8]">
            Upcoming Interview
          </div>
          <div
            className="dark:text-[#00B152] underline text-[0.6087rem] font-medium cursor-pointer"
            onClick={handleSeeAllToggle}
          >
            {showAll ? "See less" : "See all"}
          </div>
        </div>
        {loader ? (
          <InterviewCard item={null} key={null} />
        ) : (
          <>
            {upComingInterviews
              ?.slice(0, showAll ? undefined : 1)
              .map((item, index) => (
                <InterviewCard item={item} key={index} />
              ))}
          </>
        )}
        {/* <InterviewCard item={sampleItems} key={1} /> */}
        <div className="flex mt-[.7rem] dark:text-white text-[0.60839rem] font-medium justify-center items-center">
          <button
            className="flex justify-center items-center gap-1"
            onClick={handleAddNewInterview}
          >
            <div>
              <img src="/icons/darkMode/plus.svg" alt="" />
            </div>
            <div className="text-[#00B152]">Add a new interview</div>
          </button>
        </div>
      </div>
      {toggleChooseResumeModale && (
        <ChooseResumeModal
          open={toggleChooseResumeModale}
          setOpen={setToggleChooseResumeModale}
        />
      )}
    </div>
  );
}
export default Dashboard;
