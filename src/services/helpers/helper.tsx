import { addMinutes, format, parseISO } from "date-fns";
import { CountryCode, parsePhoneNumber } from "libphonenumber-js";
import { useNavigate } from "react-router";

export const updateArrayAtIndex = (
  array: any[],
  index: number,
  newValue: any
) => {
  return array.map((item, i) => (i === index ? newValue : item));
};

export default function generateDatesAroundGivenDate(
  baseDateString: any,
  daysBeforeAfter: any
) {
  // Parse the base date string into a Date object
  const baseDate = new Date(baseDateString);

  // Initialize an empty array to store the generated dates
  let datesArray = [];

  // Generate dates for days before the base date
  for (let i = 1; i > 0; i--) {
    const currentDate = new Date(baseDate);
    currentDate.setDate(currentDate.getDate() - i + 1); // +1 to include the base date itself later
    datesArray.push(new Date(currentDate));
  }

  // Generate dates for days after the base date
  for (let i = 1; i <= daysBeforeAfter; i++) {
    const currentDate = new Date(baseDate);
    currentDate.setDate(currentDate.getDate() + i);
    datesArray.push(new Date(currentDate));
  }

  return datesArray;
}
export function getWeekdayName(date: Date | null) {
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return date ? weekdays[date.getDay()] : "";
}
export function getMonthdayName(date: Date | null) {
  const month = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];
  return date ? month[date.getMonth()] : "";
}
export const fetchCountryName = () => {
  return new Promise((resolve, reject) => {
    if (!("geolocation" in navigator)) {
      reject(new Error("Geolocation is not supported by this browser."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          const data = await response.json();
          resolve(data.countryName);
        } catch (error) {
          reject(error);
        }
      },
      (error) => {
        reject(error);
      }
    );
  });
};
export function formatNumber(value: number) {
  // Define thresholds
  const thresholds = [
    { value: 1000000000, suffix: "B+" },
    { value: 1000000, suffix: "M+" },
    { value: 1000, suffix: "K+" },
    { value: 100, suffix: "00+" },
  ];

  // Loop through thresholds to find the matching range
  for (let i = 0; i < thresholds.length; i++) {
    if (value >= thresholds[i].value) {
      // Calculate the value in terms of the current threshold
      let formattedValue = value / thresholds[i].value;

      // Round the number to keep it concise
      formattedValue = Math.round(formattedValue * 10) / 10;

      // Return the formatted string
      return `${formattedValue}${thresholds[i].suffix} `;
    }
  }

  // If value is below all thresholds, just return the original value
  return `${value.toString()}`;
}
export function capitalizeWords(str: string) {
  return str
    ?.split(" ")
    .map(
      (word: string) =>
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join(" ");
}
export const formatPhoneNumber = (
  number: string,
  country: CountryCode
): { isValid: boolean; formattedNumber: string } | null => {
  try {
    const phoneNumber = parsePhoneNumber(number, country);
    if (phoneNumber) {
      const isValid = phoneNumber.isValid();
      const formattedNumber = phoneNumber.formatNational();
      return { isValid, formattedNumber };
    }
    return null;
  } catch (error) {
    console.error("Error parsing phone number:", error);
    return null;
  }
};
export function filterStacks(stacks: any[], searchTerm: string | RegExp) {
  if (!searchTerm) return stacks; // Return all stacks if no search term

  const regex = new RegExp(searchTerm, "i"); // 'i' flag for case-insensitive search

  return stacks.filter((stack: { stack: string }) => regex.test(stack.stack));
}
export function filterCountry(countries: any, searchTerm: string | RegExp) {
  if (!searchTerm) return countries; // Return all stacks if no search term

  const regex = new RegExp(searchTerm, "i"); // 'i' flag for case-insensitive search

  return countries?.filter((country: { countryName: string }) => {
    regex.test(country.countryName);
  });
}
export const formatCurrency = (amount: number, selectedCountry: any) => {
  if (amount === null || amount === undefined) return;
  return new Intl.NumberFormat(selectedCountry?.currencyCulture, {
    style: "currency",
    currency: selectedCountry.countryName === "INDIA" ? "INR" : "USD",
  }).format(amount);
};

export const getDetailedTimeZoneInfo = () => {
  const date = new Date();
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const offsetMinutes = -date.getTimezoneOffset();
  const offsetHours = offsetMinutes / 60;
  const offsetSign = offsetHours >= 0 ? "+" : "-";
  const absoluteOffsetHours = Math.abs(Math.floor(offsetHours));
  const offsetMinutesRemainder = Math.abs(offsetMinutes % 60);
  const offsetString = `${offsetSign}${absoluteOffsetHours
    .toString()
    .padStart(2, "0")}:${offsetMinutesRemainder.toString().padStart(2, "0")}`;

  // Get individual date components
  const month = date.toLocaleString("default", { month: "long" });
  const day = date.getDate().toString();
  const year = date.getFullYear().toString();
  const hour = date.getHours().toString().padStart(2, "0");
  const minute = date.getMinutes().toString().padStart(2, "0");
  const second = date.getSeconds().toString().padStart(2, "0");
  const dayPeriod = parseInt(hour) < 12 ? "AM" : "PM"; // Convert hour to number for comparison
  const timeZoneName = Intl.DateTimeFormat(undefined, {
    timeZone,
    timeZoneName: "long",
  }).format(date);

  const isDST = () => {
    const jan = new Date(date.getFullYear(), 0, 1);
    const jul = new Date(date.getFullYear(), 6, 1);
    return (
      Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset()) >
      date.getTimezoneOffset()
    );
  };

  return {
    month,
    day,
    year,
    hour,
    minute,
    second,
    dayPeriod,
    timeZoneName,
    isDST: isDST(),
    offsetString,
  };
};

export const greeting = () => {
  const date = new Date();
  const hour = date.getHours();
  if (hour < 12) {
    return "Good Morning";
  } else if (hour < 18) {
    return "Good Afternoon";
  } else {
    return "Good Evening";
  }
};
export function getLocalTime(utcTimeString: string, currencyCulture: string) {
  if (!utcTimeString) {
    return;
  }
  const date = new Date(utcTimeString);
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const formatter = new Intl.DateTimeFormat(currencyCulture, {
    timeZone: timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return formatter.format(date);
}
export function GetLocalWithUTCtime(utcTimeString: any): string {
  const utcDate = parseISO(utcTimeString);

  // Calculate the timezone offset in minutes
  const offsetInMinutes = new Date().getTimezoneOffset();

  // Add the offset to the UTC date to get the correct local time
  const localDate = addMinutes(utcDate, -offsetInMinutes);

  return format(localDate, "hh:mm a");
}
export function GetLocalWithUTCDate(utcTimeString: any): string {
  const utcDate = parseISO(utcTimeString);
  const offsetInMinutes = new Date().getTimezoneOffset();

  // Add the offset to the UTC date to get the correct local time
  const localDate = addMinutes(utcDate, -offsetInMinutes);

  return format(localDate, "MM/dd/yy ");
}
export function formatUSPhone(phone: any) {
  var cleaned = ("" + phone).replace(/\D/g, "");
  var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return match[1] + "- " + match[2] + "-" + match[3];
  }
  return phone ?? "";
}

export function FormattedDate(
  date: Date | number | Date,
  locale: Intl.LocalesArgument
) {
  const formattedDate = new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
  return formattedDate;
}

export function FormattedDateForCheckout(
  date: Date | number | Date,
  locale: Intl.LocalesArgument
) {
  const formattedDate = new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "2-digit",
  }).format(date);
  return formattedDate;
}
export const navigateAndClearHistory = (path: any) => {
  const navigate = useNavigate();
  // Navigate to the new path
  navigate(path);

  // Clear the history stack
  window.history.pushState(null, "", window.location.href);
  window.history.go(1);
};
export function isSafari() {
  const userAgent = navigator.userAgent.toLowerCase();
  return userAgent.includes("safari") && !userAgent.includes("chrome");
}
