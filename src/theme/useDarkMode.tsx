import { useEffect } from "react";
import { useDarkModeStore } from "./store";

export const useDarkMode = () => {
  const { isDarkMode } = useDarkModeStore();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return useDarkModeStore();
};
