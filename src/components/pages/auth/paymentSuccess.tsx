import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useConfigStore from "../../../configStore/store";
import { PATHS } from "../../../router";
import {
  capitalizeWords,
  formatCurrency,
  FormattedDate,
  getLocalTime,
} from "../../../services/helpers/helper";
import { ENDPOINTS } from "../../../services/urls";
import { useDarkMode } from "../../../theme/useDarkMode";
import SVGLoader from "../../elements/loader/svgLoader2";

function PaymentSuccess() {
  const { isDarkMode } = useDarkMode();
  const navigate = useNavigate();
  const { selectedCountry } = useConfigStore();

  const location = useLocation();
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const handleLogin = () => {
    navigate(PATHS.login);
  };

  useEffect(() => {
    handleGetPaymentDetails();
  }, []);
  const handleGetPaymentDetails = () => {
    setIsDetailsLoading(true);
    const body = {
      orderId: location.state.orderId,
      razorpayPaymentId: location.state.razorpayPaymentId,
      paymentIntentId: location.state.paymentIntentId,
    };
    axios
      .post(ENDPOINTS.GET_PAYMENT_DETAILS, body)
      .then((res) => {
        setPaymentDetails(res.data);
      })
      .finally(() => {
        setIsDetailsLoading(false);
      });
  };

  const handleDownloadPDF = () => {
    setIsDetailsLoading(true);

    const body = {
      orderId: location.state?.orderId,
      timeZone: location.state?.timezone,
    };

    axios
      .post(ENDPOINTS.GENERATE_INVOICE, body, {
        responseType: "blob",
      })
      .then((response: any) => {
        const blob = new Blob([response.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        var newWindow = window.open();
        if (!newWindow) {
          alert("Popup blocked. Please allow popups for this site ");
          const userConfirmed = window.confirm(
            "Would you like to download the PDF without permission?"
          );
          if (userConfirmed) {
            setIsDetailsLoading(false);
            const link = document.createElement("a");
            link.href = url;
            link.download = `${paymentDetails?.displayOrd}-interviewbetter.io.pdf`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            URL.revokeObjectURL(url);
          }
        } else {
          setIsDetailsLoading(false);
          newWindow.location = url;
        }
        setTimeout(() => {
          window.URL.revokeObjectURL(url);
        }, 100);
      })
      .catch((error) => {
        console.error("Error opening PDF:", error);
      });
  };
  // const downloadPdf = async (
  //   base64Data: string,
  //   filename: string = "document.pdf"
  // ) => {
  //   try {
  //     // Create a Blob from the Base64 string
  //     const byteCharacters = atob(base64Data);
  //     const bytes = new Uint8Array(byteCharacters.length);
  //     for (let i = 0; i < byteCharacters.length; i++) {
  //       bytes[i] = byteCharacters.charCodeAt(i);
  //     }

  //     // Create a Blob URL
  //     const blob = new Blob([bytes], { type: "application/pdf" });
  //     const url = URL.createObjectURL(blob);

  //     // Create a temporary link element
  //     const link = document.createElement("a");
  //     link.style.display = "none";
  //     link.href = url;
  //     link.download = filename;

  //     // Append to the document, trigger the download, and remove the link
  //     document.body.appendChild(link);
  //     link.click();

  //     // Use a timeout to ensure the download starts before cleaning up
  //     setTimeout(() => {
  //       document.body.removeChild(link);
  //       URL.revokeObjectURL(url);
  //     }, 100);
  //   } catch (error) {
  //     console.error("Error creating PDF:", error);
  //   }
  // };
  // function downloadPDF(response: BlobPart, filename = "document.pdf") {
  //   const blob = new Blob([response], { type: "application/pdf" });
  //   const url = window.URL.createObjectURL(blob);
  //   const link = document.createElement("a");
  //   link.href = url;
  //   link.setAttribute("download", filename);
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  //   window.URL.revokeObjectURL(url);
  // }

  if (isDetailsLoading) {
    return <SVGLoader></SVGLoader>;
  }
  console.log(location.state?.selectedDate, "locationState");
  return (
    <div className="  flex items-center justify-center mt-[3.5em] text-[2vh]">
      <div className="relative mobile:w-[90%] w-[40em] px-[2em] mobile:px-[.5rem] py-[2.5em] dark:bg-[#212325] dark:text-white bg-[#ECECEC] flex flex-col items-center rounded-[12px] shadow-lg">
        <div className="absolute -top-[2.5em] left-[50%] translate-x-[-50%] z-[10] w-[3.5em] h-[3.5em] rounded-full dark:bg-[#212325] bg-[#00B152] flex justify-center items-center shadow-2xl">
          <img
            src={
              isDarkMode
                ? "/icons/darkMode/paymentSuccess.svg"
                : "/icons/lightMode/paymentSuccess.svg"
            }
            alt=""
          />
        </div>
        <div className="text-[1.09428em] font-semibold">Payment Success!</div>
        <div className="mt-[.33em] mobile:text-[0.766em] text-[.9em] opacity-[72%] items-center text-center">
          Your payment has been successfully completed.
        </div>
        <div className="mt-[1.3em] dark:bg-[#ffffff3d] bg-[#242424]/[6%]  h-[.1em] w-full"></div>
        <div className=" mt-[1.3em] text-[0.98578em] opacity-[72%]">
          Total Payment
        </div>
        <div className="text-[1.66822em] font-semibold">
          {formatCurrency(location.state?.totalPrice, selectedCountry)}
        </div>
        <div className="mt-[1.3em] w-full flex justify-between">
          <div className="w-[45%]  mobile:w-[47%] p-2 border dark:border-[#ffffff3d] border-[#242424]/[6%] rounded-[6px]">
            <div className="mobile:text-[0.65656em] text-[.8em]  opacity-[72%]">
              Order Id
            </div>
            <div className="mobile:text-[0.71128em] text-[.9em] ">
              {paymentDetails?.displayOrd}
            </div>
          </div>
          <div className="w-[45%]  mobile:w-[47%] p-2 border dark:border-[#ffffff3d] border-[#242424]/[6%] rounded-[6px]">
            <div className="mobile:text-[0.65656em] text-[.8em]  opacity-[72%]">
              Interview date and time
            </div>
            <div className="mobile:text-[0.71128em] text-[.9em] ">
              {FormattedDate(
                location.state?.selectedState,
                selectedCountry.currencyCulture
              )}{" "}
              | {location.state?.time}
            </div>
          </div>
        </div>
        <div className="mt-[.6em] w-full flex justify-between">
          <div className="w-[45%]  mobile:w-[47%] p-2 border dark:border-[#ffffff3d] border-[#242424]/[6%] rounded-[6px]">
            <div className="mobile:text-[0.65656em] text-[.8em] opacity-[72%]">
              Specialization
            </div>
            <div className="mobile:text-[0.71128em] text-[.9em]">
              {location?.state?.specialization?.stack}
            </div>
          </div>
          <div className="w-[45%]  mobile:w-[47%] p-2 border dark:border-[#ffffff3d] border-[#242424]/[6%] rounded-[6px]">
            <div className="mobile:text-[0.65656em] text-[.8em] opacity-[72%]">
              Industry
            </div>
            <div className="mobile:text-[0.71128em] text-[.9em]">
              {" "}
              {location?.state?.industry?.industry}
            </div>
          </div>
        </div>
        <div className="mt-[.6em] w-full flex justify-between">
          <div className="w-[45%]  mobile:w-[47%] p-2 border dark:border-[#ffffff3d] border-[#242424]/[6%] rounded-[6px]">
            <div className="mobile:text-[0.65656em] text-[.8em] opacity-[72%]">
              Payment Method
            </div>
            <div className="mobile:text-[0.71128em] text-[.9em]">
              {capitalizeWords(paymentDetails?.paymentMethod)}
            </div>
          </div>
          <div className="w-[45%]  mobile:w-[47%] p-2 border dark:border-[#ffffff3d] border-[#242424]/[6%] rounded-[6px]">
            <div className="mobile:text-[0.65656em] text-[.8em] opacity-[72%]">
              Payment Time
            </div>
            <div className="mobile:text-[0.71128em] text-[.9em]">
              {getLocalTime(
                paymentDetails?.paymentTime,
                selectedCountry.currencyCulture
              )}
            </div>
          </div>
        </div>
        <div className="my-[1.75em] w-full flex justify-center items-center">
          <div></div>
          <div
            className="mobile:text-[0.766em] text-[.9em] text-[#00B152] flex justify-center items-center gap-2 cursor-pointer"
            onClick={handleDownloadPDF}
          >
            <div>
              <img src="/icons/downloadPdf.svg" alt="" />
            </div>
            <div>Get PDF Receipt</div>
          </div>
        </div>
        <div
          className="w-full flex cursor-pointer justify-center items-center h-[42px] rounded-[30px] bg-[#00B152] text-[1em] text-semibold text-white"
          onClick={handleLogin}
        >
          Log In
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccess;
