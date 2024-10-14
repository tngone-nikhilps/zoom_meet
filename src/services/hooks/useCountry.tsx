import { useState, useEffect } from "react";

const useCountry = () => {
  const [country, setCountry] = useState<string | null>(null);

  useEffect(() => {
    async function getCountryFromIP() {
      try {
        const response = await fetch("https://ipapi.co/json/");
        const data = await response.json();
        return data.country_name;
      } catch (error) {
        console.error("Error getting country:", error);
        return null;
      }
    }


    async function fetchCountry() {
      try {
        const countryName = await getCountryFromIP();
        if (countryName) {
          setCountry(countryName);
        } else {
          console.log("Could not determine country code");
        }
      } catch (error) {
        console.error("Error getting country:", error);

      }
    }

    fetchCountry();
  }, []);

  return country;
};

export default useCountry;
