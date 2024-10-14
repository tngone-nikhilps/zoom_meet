import { useState } from "react";
import { useDarkMode } from "../../../theme/useDarkMode";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
}
function ChooseResumeModal({ open, setOpen }: Props) {
  const { isDarkMode } = useDarkMode();
  const [selectedId, setSelectedId] = useState("");

  const [resumes, setResumes] = useState<
    { id: string; name: string; nickName: string }[]
  >([
    {
      id: "resume-1",
      name: "Resume 1",
      nickName: "UX DESIGN",
    },
    {
      id: "resume-2",
      name: "Resume 2",
      nickName: "",
    },
  ]);
  const handleEditResume = (id: string, newNickname: string) => {
    setResumes((prevResumes) =>
      prevResumes.map((resume) =>
        resume.id === id ? { ...resume, nickName: newNickname } : resume
      )
    );
  };
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNickname, setEditNickname] = useState("");

  const startEditing = (id: string, nickname: string) => {
    setEditingId(id);
    setEditNickname(nickname);
  };
  const saveEdit = (id: string) => {
    handleEditResume(id, editNickname);
    setEditingId(null);
  };
  const handleEditResumeInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEditNickname(event.target.value);
  };
  const handleSelect = (id: string) => {
    setSelectedId(id);
    console.log(id);
  };

  if (!open) return null;
  return (
    <div className="fixed z-50 inset-0 bg-black bg-opacity-50 flex items-center justify-center ">
      <div className="bg-white dark:bg-black rounded-xl shadow-lg p-[1rem] w-[27.17391rem] border-2 border-black">
        <div className="flex justify-between">
          <div className="text-[0.86957rem] font-semibold dark:text-white">
            Choose Resume
          </div>
          <div>
            <img
              src="/icons/darkMode/close.svg"
              alt=""
              onClick={() => setOpen(false)}
            />
          </div>
        </div>
        <div className="flex flex-col space-y-4 dark:bg-[#212325] p-4 rounded-xl mt-3 bg-[#E6E6E6]/[90%]">
          <div className="dark:text-white text-[0.6087rem]">
            Be sure to include an updated resume
          </div>
          <div className="mt-3">
            <ul className="flex gap-2 flex-col">
              {resumes.map((resume) => {
                return (
                  <li key={resume.id}>
                    <div
                      onClick={() => handleSelect(resume.id)}
                      className="flex h-[2.21739rem]"
                    >
                      <div className="bg-[#CB112D] border-4 border-[#CB112D] w-[3.08696rem] h-full flex items-center justify-center rounded-l-[0.347rem]">
                        <div className="text-white text-[0.69565rem] opacity-[.8]">
                          PDF
                        </div>
                      </div>
                      <div
                        className={`px-[.43rem] py-[.39rem] rounded-r-lg flex bg-white dark:bg-[#212325]  justify-between w-full  dark:text-gray-400  items-center border border-gray-200/20 border-l-0`}
                      >
                        <div>
                          <div className="flex gap-2 items-center">
                            <div>
                              {editingId === resume.id ? (
                                <div className="flex gap-2">
                                  <input
                                    autoFocus
                                    id="editNickname"
                                    type="text"
                                    value={editNickname}
                                    onChange={handleEditResumeInputChange}
                                    className="w-[6rem] h-[0.5087rem] rounded  dark:bg-[#212325] bg-white dark:text-white text-black text-[0.5087rem] border-[#212325] focus:dark:bg-[#212325]  focus:border-[#00B152] focus:border focus:ring-0"
                                  />

                                  <button
                                    onClick={() => saveEdit(resume.id)}
                                    className="ml-2 h-0 text-[#00B152] text-[0.6087rem]"
                                  >
                                    save
                                  </button>
                                </div>
                              ) : (
                                <div className="flex gap-2 items-center">
                                  {resume.nickName == "" ? (
                                    <div
                                      className="text-[#00B152] text-[0.6087rem] underline cursor-pointer"
                                      onClick={() =>
                                        startEditing(resume.id, resume.nickName)
                                      }
                                    >
                                      +Add nick name
                                    </div>
                                  ) : (
                                    <div className=" text-black dark:text-white text-[0.6087rem]">
                                      {resume.nickName}
                                    </div>
                                  )}
                                  <img
                                    src="/icons/edit.svg"
                                    alt=""
                                    className="cursor-pointer"
                                    onClick={() =>
                                      startEditing(resume.id, resume.nickName)
                                    }
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="text-[0.52174rem] dark:text-white/[73%] text-[#656565]">
                            {resume.name}
                          </div>
                        </div>
                        <div
                          className={`w-[0.91304rem] h-[0.91304rem] rounded-full border-[4px] ${
                            selectedId === resume.id
                              ? "border-[#00B152]"
                              : "dark:border-white border-[#4D4F51]"
                          }  flex items-center justify-center`}
                        >
                          {/* <div className={`w-[4px] h-[4px] rounded-full ${selectedId === resume.id ? 'bg-[#00B152]' : ''} `}>
                                                        </div> */}
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="flex justify-between items-center mt-3 border-b dark:border-white/20 border-[#4D4F51] py-2 ">
            <div className="flex flex-col gap-1 ">
              <label
                htmlFor="upload-resume"
                className="w-[5.73196rem] h-[1.64309rem] border border-[#00B152] text-[#00B152] rounded-lg font-semibold text-[0.57509rem] flex justify-center items-center"
              >
                Upload Resume
              </label>
              <input type="file" id="upload-resume" className="hidden" />
              <div className="text-[0.52174rem] dark:text-white/20 text-black mt-2">
                DOC, DOCX, PDF (2 MB)
              </div>
            </div>
            <div className="dark:text-white text-black text-[0.57509rem] flex gap-2 items-center">
              <div>Show more</div>
              <div>
                <img
                  src={
                    isDarkMode
                      ? "/icons/darkMode/dropdown.svg"
                      : "/icons/lightMode/dropdown.svg"
                  }
                  alt=""
                  className="w-[0.6087rem]"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end items-center gap-2">
            <button
              className="w-[4.34783rem] h-[1.46848rem] border dark:border-white border-black dark:text-white text-black rounded-[19px] font-semibold text-[0.5183rem]"
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>
            <button className="w-[4.34783rem] h-[1.46848rem] rounded-[19px] bg-[#00B152] text-white font-semibold text-[0.5183rem]">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ChooseResumeModal;
