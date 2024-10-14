import gsap from "gsap";
import React, { useEffect, useRef } from "react";

interface Toast {
  message: string;
  isVisible: boolean;
  setIsVisible: (boolean: boolean) => void;
  onClose: () => void;
  status: "success" | "error" | "info";
}
const StatusIcon: React.FC<{ status: "success" | "error" | "info" }> = ({
  status,
}) => {
  switch (status) {
    case "success":
      return (
        <svg
          className="w-5 h-5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
        </svg>
      );
    case "error":
      return (
        <svg
          className="w-5 h-5"
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
          className="w-5 h-5"
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
const Toast = ({ message, isVisible, setIsVisible, status }: Toast) => {
  const toastRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let timeoutId: any;

    if (isVisible && toastRef.current) {
      gsap.fromTo(
        toastRef.current,
        { x: "+100%", opacity: 0 },
        { x: "0%", opacity: 1, duration: 0.5, ease: "power3.out" }
      );

      timeoutId = setTimeout(() => {
        setIsVisible(false);
      }, 3000); // Changed to 3 seconds for better visibility
    } else if (!isVisible && toastRef.current) {
      gsap.to(toastRef.current, {
        x: "+100%",
        opacity: 0,
        duration: 0.5,
        ease: "power3.in",
      });
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isVisible, setIsVisible]);
  if (!isVisible) return null;
  const getStatusColor = () => {
    switch (status) {
      case "success":
        return "text-green-500 bg-green-100 dark:bg-green-800 dark:text-green-200";
      case "error":
        return "text-red-500 bg-red-100 dark:bg-red-800 dark:text-red-200";
      default:
        return "text-blue-500 bg-blue-100 dark:bg-blue-800 dark:text-blue-200";
    }
  };
  return (
    <div
      ref={toastRef}
      id="toast-success"
      className="flex fixed bottom-3 right-4 items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800"
      role="alert"
    >
      <div
        className={`inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg ${getStatusColor()}`}
      >
        <StatusIcon status={status}></StatusIcon>
        <span className="sr-only">Check icon</span>
      </div>
      <div className="ms-3 text-sm font-normal">{message}</div>
    </div>
  );
};

export default Toast;
