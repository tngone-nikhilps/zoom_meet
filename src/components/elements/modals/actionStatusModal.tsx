import React from "react";

interface ActionModalProps {
  actionModalPopUp: boolean;
  setActionModalPopUp: React.Dispatch<React.SetStateAction<boolean>>;
  ActionMessage: string;
  //   ActionIcon: JSX.Element;
  ActionFunction: () => void;
}
const StatusIcon: React.FC<{ status: "success" | "error" | "info" }> = ({
  status,
}) => {
  switch (status) {
    case "success":
      return (
        <svg
          className="w-[70px] h-[70px]"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="green"
          viewBox="0 0 20 20"
        >
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
        </svg>
      );
    case "error":
      return (
        <svg
          className="w-[70px] h-[70px]"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z" />
        </svg>
      );
    default:
      return (
        <svg
          className="w-[70px] h-[70px]"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z" />
        </svg>
      );
  }
};
export default function ActionStatusModal({
  actionModalPopUp,
  setActionModalPopUp,
  ActionMessage,
  ActionFunction,
}: //   ActionIcon,
ActionModalProps) {
  if (!actionModalPopUp) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-64">
        <div className="flex flex-col items-center">
          <div className="mb-4">
            <StatusIcon status="success"></StatusIcon>
          </div>
          <p className="text-base font-semibold mb-6 text-center">
            {ActionMessage}
          </p>
          <button
            className="bg-black text-white px-4 py-2 rounded hover:bg-black transition duration-300"
            onClick={() => {
              setActionModalPopUp(false);
              ActionFunction();
            }}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
