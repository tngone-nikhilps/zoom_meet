import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useConfigStore from "../../../configStore/store";
import { PATHS } from "../../../router";
import { levels } from "../../../services/constants";
import { capitalizeWords } from "../../../services/helpers/helper";
import { ENDPOINTS } from "../../../services/urls";
import { SelectionInput } from "../../elements/inputs/selectionInput";

function ChooseLevel() {
  const navigate = useNavigate();

  const { setConfigs, setStates, setIsconfigLoading } = useConfigStore();

  useEffect(() => {
    getConfigs();
    getAllTimeZones();
  }, []);
  const getConfigs = () => {
    setIsconfigLoading(true);
    axios
      .get(ENDPOINTS.GET_ALL_CONFIGS)
      .then((res) => {
        setConfigs(res.data);
      })
      .finally(() => {
        setIsconfigLoading(false);
      });
  };
  const getAllTimeZones = () => {
    axios.get(ENDPOINTS.GET_ALL_LOOKUP).then((res) => {
      const states = res.data.filter(
        (el: { group: string }) => el.group == "SGST"
      );
      setStates(states);
    });
  };
  return (
    <>
      <div className="h-[100%] w-full flex flex-col justify-center items-center">
        <div className="mt-[5.5rem] mobile:w-full mobile:px-[1rem] mobile:overflow-x-hidden">
          <span className="dark:text-dark-text text-[1rem] text-center">
            I'm a
          </span>
          {levels?.map((level) => (
            <SelectionInput
              isLoading={false}
              title={capitalizeWords(level)}
              classNames="mt-[32px] mobile:mt-[16px]"
              onClick={() =>
                navigate(PATHS.chooseIndustry, {
                  state: {
                    level: level,
                  },
                })
              }
              animateTime={0.2}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default ChooseLevel;
