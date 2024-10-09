import React, { useState, useRef, useEffect } from "react";
import { UpOutlined } from "@ant-design/icons";

const DropdownButton = ({
  audioIcon,
  onMicrophoneClick,
  onPhoneMenuClick,
}: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<any>(null);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          onMicrophoneClick();
        }}
        className="bg-red-500 text-white px-4 py-2 rounded-lg text-lg flex items-center justify-center hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
      >
        {audioIcon}
        <UpOutlined className="ml-2" />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            <a
              href="#"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              role="menuitem"
              onClick={() => {
                onPhoneMenuClick("phone");
                setIsOpen(false);
              }}
            >
              Invite by phone
            </a>
            <a
              href="#"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              role="menuitem"
              onClick={() => {
                onPhoneMenuClick("crc");
                setIsOpen(false);
              }}
            >
              Invite H323/SIP Room
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownButton;
