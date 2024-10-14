import { useEffect, useState } from "react";


const useMediaQuery = (query: string) => {
  // Initialize state to store whether the media query matches
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Create a MediaQueryList object
    const media = window.matchMedia(query);


    // Check if the media query matches initially
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    // Define a listener function to update state whenever the media query result changes
    const listener = () => setMatches(media.matches);

    // Add the listener to the MediaQueryList object
    media.addEventListener("change", listener);

    // Cleanup function to remove the event listener when the component unmounts
    return () => media.removeEventListener("change", listener);
  }, [matches, query]); // Re-run the effect if `matches` or `query` changes

  return matches; // Return the current state
};

export default useMediaQuery;

