import { RouterProvider } from "react-router-dom";
import router from "./router";
import { useEffect } from "react";
import { useCallback } from "react";

function useFullscreen() {
  const enterFullscreen = useCallback(() => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    }
  }, []);

  return enterFullscreen;
}

function App() {
  useFullscreen();
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY === 0) {
        window.scrollTo(0, 1);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return <RouterProvider router={router} fallbackElement={<p></p>} />;
}

export default App;
