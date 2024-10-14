import React from "react";

interface ConfirmModalProps {
  confirmModalPopUp: boolean;
  setConfirmModalPopUp: React.Dispatch<React.SetStateAction<boolean>>;
  confirmMessage: string;
  confirmFunction: () => void;
}

export default function ConfirmModal({
  confirmModalPopUp,
  setConfirmModalPopUp,
  confirmMessage,
  confirmFunction,
}: ConfirmModalProps) {
  if (!confirmModalPopUp) return null;

  return (
    <div className="fixed z-50 inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white dark:bg-[#313131] dark:text-white text-black rounded-md shadow-lg p-6 w-auto">
        <div className="flex flex-col space-y-4">
          <h2 className="text-xl font-semibold">Confirm</h2>
          <p>{confirmMessage}</p>
          <div className="flex justify-end space-x-2">
            <button
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              onClick={confirmFunction}
            >
              Yes
            </button>
            <button
              className="px-4 py-2 border border-red-500 text-red-500 rounded hover:bg-red-100"
              onClick={() => setConfirmModalPopUp(false)}
            >
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
