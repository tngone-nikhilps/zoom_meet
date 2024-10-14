import { useLocation, useNavigate } from "react-router-dom";
import useConfigStore from "../../../configStore/store";
import { PATHS } from "../../../router";
import { SelectionInput } from "../../elements/inputs/selectionInput";

function ChooseIndustry() {
  const navigate = useNavigate();
  const location = useLocation();
  const level = location.state?.level;
  const { configs, isConfigLoading } = useConfigStore();

  return (
    <>
      <div className="h-[100%] w-full flex flex-col justify-center items-center">
        <div className="mt-[2.65rem] mobile:w-full mobile:px-[1rem]  mobile:overflow-x-hidden">
          <span className="dark:text-dark-text text-[1rem] ">
            Choose your field
          </span>
          {isConfigLoading
            ? Array.from({ length: 4 }).map((_, index) => (
                <SelectionInput
                  title={""}
                  isLoading={true}
                  classNames="mt-[32px] mobile:mt-[16px]"
                  animateTime={0.3 + index / 10}
                  onClick={() => {}}
                />
              ))
            : configs.industries?.map(
                (
                  industry: { industry: string; industryId: any },
                  index: number
                ) => (
                  <SelectionInput
                    title={industry.industry}
                    isLoading={false}
                    classNames="mt-[32px] mobile:mt-[16px]"
                    animateTime={0.3 + index / 10}
                    onClick={() =>
                      navigate(PATHS.chooseSpecialization, {
                        state: {
                          industry: {
                            industryId: industry.industryId,
                            industry: industry.industry,
                          },
                          level: level,
                        },
                      })
                    }
                  />
                )
              )}
        </div>
      </div>
    </>
  );
}

export default ChooseIndustry;
