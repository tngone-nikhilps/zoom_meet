import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useConfigStore from "../../../configStore/store";
import { PATHS } from "../../../router";
import {
  capitalizeWords,
  formatCurrency,
  formatPhoneNumber,
  FormattedDateForCheckout,
} from "../../../services/helpers/helper";
import { ENDPOINTS } from "../../../services/urls";
import StateSelect from "../../elements/inputs/select/chooseState";
import SVGLoader from "../../elements/loader/svgLoader2";
import StripeModal from "../../elements/payments/stripe";
import Stepper from "../../elements/stepper/stepper";
import ConfettiComponent from "../../elements/animated/animatedPopper";

function CheckOut() {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedCountry } = useConfigStore();
  const [applyCoupon, setApplyCoupon] = useState("not-applied");
  const handleEnterCoupon = () => {
    setApplyCoupon("applied");
  };

  const [level] = useState(() => location.state?.level);
  const [industry] = useState(() => location.state?.industry);
  const [specialization] = useState(() => location.state?.specialization);
  const [selectedDate] = useState(() => location.state?.selectedDate);
  const [selectedState, setSelectedState] = useState<any>("");
  const [tax, setTax] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  // const [streetNo, setStreetNo] = useState("");
  // const [streetName, setStreetName] = useState("");
  // const [city, setCity] = useState("");
  // const [unitNo, setUnitNo] = useState("");
  // const [province, setProvince] = useState("");
  // const [postalCode, setPostalCode] = useState("");
  const [orderId, setOrderId] = useState("");
  const [stripePaymentIntent, setStripePaymentIntent] = useState("");
  const [slotDetails] = useState(() => location.state?.slot);
  const [paymentPopup, setPaymentPopup] = useState(false);
  // const { state } = useLocation()
  const [phoneNumberError, setPhoneNumberError] = useState<string>("");
  const [phoneIsValid, setPhoneIsValid] = useState(false);
  const [emailError, setEmailError] = useState<string>("");
  const [stateError, setStateError] = useState<string>("");
  // const [streetNoError, setStreetNoError] = useState<string>("");
  // const [streetNameError, setStreetNameError] = useState<string>("");
  // const [unitNoError, setUnitNoError] = useState<string>("");
  // const [postalCodeError, setPostalCodeError] = useState<string>("");

  // const [cityError, setCityError] = useState<string>("");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponCodeError, setCouponCodeError] = useState("");
  const [applyCouponLoader, setApplyCouponLoader] = useState(false);
  const [discountPrice, setDiscountPrice] = useState(0);
  const [couponDescription, setCouponDescription] = useState("");

  const [isMobilePayInfo, setIsMobilePayInfo] = useState(false);
  const [stripeSecret, setStripeSecret] = useState("a");
  const [stripePaymentPopup, setStripePaymentPopup] = useState(false);
  const [discountPopper, setDiscountPopper] = useState(false);
  const initPaymentRazorPay = () => {
    if (!handleVerification(email, selectedState?.stateName)) {
      return;
    }
    setPaymentLoading(true);

    const body = {
      orderId: orderId,
      email: email,
      phoneNumber: phoneNumber,
      countryCode: selectedCountry.countryCode,
      state: selectedState ? selectedState.stateName : "",
      paymentMethod: "Razorpay",
      billingAddress: null,
    };

    axios
      .post(ENDPOINTS.INITIATE_ORDER, body)
      .then((res) => {
        const options = {
          key: "rzp_test_kVs9xJVLdmumag", // Enter the Key ID generated from the Dashboard
          currency: "INR",
          name: "Interview Better", //your business name
          description: "Test Transaction",
          order_id: res.data.paymentIntentId,

          image:
            "https://tngone-image-bucket.s3.us-east-2.amazonaws.com/Dev/IB/Logo/IB.svg",
          // order_id: orderId, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
          prefill: {
            //We recommend using the prefill parameter to auto-fill customer's contact information especially their phone number
            //your customer's name
            email: email,
            contact: phoneNumber, //Provide the customer's phone number for better conversion rates
          },
          modal: {
            ondismiss: function () {
              setPaymentPopup(false);
              // This function will be called when the Razorpay modal is closed
            },
            escape: false, // Prevents closing on pressing ESC key
            animation: false, // Disables default animations
          },
          handler: handlePaymentRespone,
          config: {
            display: {
              blocks: {
                banks: {
                  name: "All payment methods",
                  instruments: [
                    {
                      method: "upi",
                    },
                    {
                      method: "card",
                    },

                    {
                      method: "netbanking",
                    },
                  ],
                },
              },
              sequence: ["block.banks"],
              preferences: {
                show_default_blocks: false,
              },
            },
          },
          notes: {
            address: "Razorpay Corporate Office",
          },
          theme: {
            color: "#00b152",
          },
        };
        setPaymentPopup(true);
        // @ts-ignore
        const rzp1 = new window.Razorpay(options);
        rzp1.open();
      })
      .finally(() => {
        setPaymentLoading(false);
      });
  };
  const initPaymentStripe = () => {
    if (!handleVerification(email, selectedState?.stateName)) {
      return;
    }
    setPaymentLoading(true);
    const body = {
      orderId: orderId,
      email: email,
      phoneNumber: phoneNumber,
      countryCode: selectedCountry.countryCode,
      state: selectedState ? selectedState.stateName : "",
      paymentMethod: "stripe",
      // billingAddress: {
      //   streetNumber: streetNo,
      //   streetName: streetName,
      //   unitNumber: unitNo,
      //   city: city,
      //   state: province,
      //   zipCode: postalCode,
      //   country: selectedCountry.countryName,
      // },
    };

    axios
      .post(ENDPOINTS.INITIATE_ORDER, body)
      .then((res) => {
        setStripeSecret(res.data.clientSecret);
        setStripePaymentIntent(res.data.paymentIntentId);
        setStripePaymentPopup(true);
      })
      .finally(() => {
        setPaymentLoading(false);
      });
  };
  useEffect(() => {
    handleCreateOrder();
  }, []);
  useEffect(() => {
    if (selectedState) {
      handleStateChange();
    }
    setStateError("");
  }, [selectedState]);
  useEffect(() => {
    if (discountPopper) {
      setTimeout(() => {
        setDiscountPopper(false);
      }, 6000);
    }
  }, [discountPopper]);
  const handleCreateOrder = () => {
    const body = {
      timezone: location?.state?.timezone,
      slotId: slotDetails.slotId,
      date: selectedDate?.toISOString().split("T")[0] + "T00:00:00.000Z",
      industryId: industry.industryId,
      stackId: specialization.stackId,
      price: slotDetails.referencePice,
      country: selectedCountry.countryName.toUpperCase(),
    };
    axios.post(ENDPOINTS.CREATE_ORDER, body).then((res) => {
      setOrderId(res.data.orderId);
      setTax(res.data.taxAmount);
      setTotalPrice(res.data.totalAmount);
    });
  };
  const handleStateChange = () => {
    const body = {
      orderId: orderId,
      state: selectedState?.stateName,
    };
    axios.post(ENDPOINTS.CHECKOUT_ORDER, body).then((res) => {
      setTax(res.data.taxAmount);
      setTotalPrice(res.data.totalPrice);
    });
  };
  const handlePaymentRespone = async (response: any) => {
    const razorpayContainer = document.querySelector(
      ".razorpay-container"
    ) as HTMLElement;
    if (razorpayContainer) {
      razorpayContainer.style.display = "none";
    }

    const body = {
      orderId: orderId,
      razorpay_payment_id: response.razorpay_payment_id,
      razorpayazorpay_order_id: response.razorpay_order_id,
      razorpay_signature: response.razorpay_signature,
    };
    // console.log(body, "body");
    // return;
    axios.post(ENDPOINTS.VERIFY_SIGNATURE, body).then((res) => {
      if (res.data.isSuccess) {
        handleNavigate(response.razorpay_payment_id, "");
      }
    });
  };
  //errors
  const handlePhoneNoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumberError("");

    const input = e.target.value.replace(/\D/g, ""); // Remove non-digit characters

    const formattedNumber = formatPhoneNumber(
      input,
      selectedCountry.regionName.slice(0, 2)
    );

    if (formattedNumber !== null) {
      setPhoneNumber(formattedNumber.formattedNumber);
      setPhoneIsValid(formattedNumber.isValid);
    } else {
      setPhoneNumber(input); // Keep the raw input for further attempts
    }
  };

  const handleVerification = (email: string, state: string) => {
    const isValidEmail =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let valid = true;
    if (!email) {
      setEmailError("Please enter your email");
      valid = false;
    } else {
      if (!isValidEmail.test(email)) {
        setEmailError("please enter a valid email");
        valid = false;
      }
    }
    if (!phoneIsValid) {
      setPhoneNumberError("Please enter a valid phone number");
      valid = false;
    }

    if (!state && selectedCountry.countryName == "INDIA") {
      setStateError("Please choose your state");
      valid = false;
    }
    // if (!streetNo && selectedCountry.countryName != "INDIA") {
    //   setStreetNoError("Enter street number");
    //   valid = false;
    // } else {
    //   setStreetNoError("");
    // }

    // if (!streetName && selectedCountry.countryName != "INDIA") {
    //   setStreetNameError("Enter street name");
    //   valid = false;
    // } else {
    //   setStreetNameError("");
    // }
    // if (!unitNo && selectedCountry.countryName != "INDIA") {
    //   setUnitNoError("Enter unit number");
    //   valid = false;
    // } else {
    //   setUnitNoError("");
    // }
    // if (!city && selectedCountry.countryName != "INDIA") {
    //   setCityError("Enter city");
    //   valid = false;
    // } else {
    //   setCityError("");
    // }
    // if (!postalCode && selectedCountry.countryName != "INDIA") {
    //   setPostalCodeError("Enter postal code");
    //   valid = false;
    // } else {
    //   setPostalCodeError("");
    // }

    return valid;
  };

  const handleApplyCoupon = () => {
    if (!couponCode) {
      setCouponCodeError("Enter coupon code");
      return;
    }
    setApplyCouponLoader(true);
    const body = {
      orderId: orderId,
      state: selectedState.stateName,
      slotId: slotDetails.slotId,
      couponCode: couponCode,
      basePrice: totalPrice,
      date: selectedDate?.toISOString().split("T")[0] + "T00:00:00.000Z",
    };
    axios
      .post(ENDPOINTS.APPLY_PROMOCODE, body)
      .then((res) => {
        setApplyCouponLoader(false);
        if (res.data.isCouponValid) {
          setTotalPrice(res.data.amountToBePay);
          setApplyCoupon("valid");
          setCouponDescription(res.data.couponText);
          setDiscountPrice(res.data.offerAmount);
          setDiscountPopper(true);
          setTax(res.data.taxAmount);
        } else {
          setCouponCodeError(res.data.message);
        }
      })
      .catch(() => {
        setApplyCouponLoader(false);
      });
  };
  const handleNextPageForMobile = () => {
    if (handleVerification(email, selectedState?.stateName)) {
      setIsMobilePayInfo(true);
    }
  };

  const handleNavigate = (razorpayId: any, stripeId: any) => {
    navigate(PATHS.PaymentSuccess, {
      state: {
        orderId: orderId,
        razorpayPaymentId: razorpayId,
        paymentIntentId: stripeId,
        specialization: specialization,
        selectedDate: selectedDate,
        time: slotDetails.time,
        industry: industry,
        totalPrice: totalPrice || slotDetails.referencePice,
        timezone: location.state.timezone,
      },
    });
  };
  const handleRemoveCoupon = () => {
    setApplyCouponLoader(true);
    const body = {
      orderId: orderId,
      state: selectedState.stateName,
    };
    axios
      .post(ENDPOINTS.REMOVE_PROMOCODE, body)
      .then((res) => {
        setTotalPrice(res.data.amountToBePaid);
        setCouponCode("");
        setApplyCoupon("applied");
        setDiscountPrice(0);
        setTax(res.data.taxAmount);
      })
      .finally(() => {
        setApplyCouponLoader(false);
      });
  };
  return (
    <>
      <StripeModal
        orderId={orderId}
        handleNavigate={handleNavigate}
        paymentIntetntId={stripePaymentIntent}
        confirmModalPopUp={stripePaymentPopup}
        setConfirmModalPopUp={setStripePaymentPopup}
        clientSecret={stripeSecret}
        totalPrice={totalPrice || slotDetails.referencePice}
      ></StripeModal>
      {paymentPopup && <SVGLoader></SVGLoader>}

      {/* <PopperAnimation
        confirmModalPopUp={discountPopper}
        setConfirmModalPopUp={setDiscountPopper}
      ></PopperAnimation> */}
      {discountPopper && (
        <ConfettiComponent
          confirmModalPopUp={discountPopper}
        ></ConfettiComponent>
      )}

      <div className="h-[100%] w-full">
        <div className="h-full w-[58rem] mobile:w-full  dark:text-white text-black mx-auto">
          <div className={`hidden mobile:block`}>
            <Stepper
              isMobilePayInfo={isMobilePayInfo}
              setIsMobilePayInfo={setIsMobilePayInfo}
              startText="Billing Information"
              endText="Checkout"
            />
          </div>
          <div className="flex ">
            <div
              className={`flex basis-[40%] mobile:basis-[100%] mobile:${
                isMobilePayInfo ? "hidden" : "block"
              } flex-col text-[1.3rem] pr-[2.1rem] h-full  mobile:p-3 mobile:pb-24`}
            >
              <div className="mt-[1.3rem] mobile:mt-0">
                <span className="text-[1.4rem] mobile:text-[1.11111rem] font-medium ">
                  Billing Information
                </span>
              </div>
              <div className="mt-[.96rem] mobile:mt-0 w-full">
                <>
                  <div className="">
                    <span className="text-[.6rem] font-[600] dark:text-white/[.8] text-[#191919]">
                      State
                    </span>
                  </div>
                  <StateSelect
                    state={selectedState}
                    setState={setSelectedState}
                  ></StateSelect>
                  {stateError && (
                    <div className="h-fit flex text-start mt-[.2rem]">
                      <span className="text-[#FF5454] text-[.57rem]">
                        {stateError}
                      </span>
                    </div>
                  )}
                </>
              </div>
              <div className="w-full">
                <div>
                  <span className="text-[.6rem] font-[600] dark:text-white/[.8] text-[#191919]">
                    Email
                  </span>
                </div>
                <div className="mt-[.1rem] border-[1px] dark:border-white border-[#7D7D7D] w-full h-[2.6rem] rounded-[.6rem] relative p-[.57rem] pr-[.69rem] flex justify-between items-center">
                  <input
                    placeholder="Please enter your Email"
                    value={email}
                    className="dark:bg-dark-background dark:text-white text-black text-[.7rem] focus:border-0 focus:outline-none w-full placeholder:text-gray-400 placeholder:font-[600]"
                    onChange={(e) => {
                      setEmail(e.target.value), setEmailError("");
                    }}
                    autoComplete="new-password"
                  />
                </div>
                {emailError && (
                  <div className="h-fit flex text-start mt-[.2rem]">
                    <span className="text-[#FF5454] text-[.57rem]">
                      {emailError}
                    </span>
                  </div>
                )}
              </div>
              <div className="w-full">
                <span className="text-[.6rem] font-[600] dark:text-white/[.8] text-[#191919]">
                  Phone Number
                </span>
              </div>

              <div className="mt-[.1rem] border-[1px] dark:border-white border-[#7D7D7D] w-full h-[2.6rem] rounded-[.6rem] relative p-[.57rem] pr-[.69rem] flex justify-between items-center">
                <div className="text-[.7rem] font-semibold">
                  {selectedCountry?.countryCode}
                </div>
                <div className="border border-[#7D7D7D] mx-2 h-full"></div>
                <input
                  placeholder="Please enter your phone number"
                  value={phoneNumber}
                  className="dark:bg-dark-background dark:text-white text-black text-[.7rem] focus:border-0 focus:outline-none w-full placeholder:text-gray-400 placeholder:font-[600]"
                  onChange={handlePhoneNoChange}
                  autoComplete="new-password"
                />
              </div>
              {phoneNumberError && (
                <div className="h-fit flex text-start mt-[.2rem]">
                  <span className="text-[#FF5454] text-[.57rem]">
                    {phoneNumberError}
                  </span>
                </div>
              )}
              {/* {selectedCountry.countryName !== "INDIA" && (
                <>
                  <div className="w-full">
                    <div>
                      <span className="text-[.6rem] font-[600] dark:text-white/[.8] text-[#191919]">
                        Street no.
                      </span>
                    </div>
                    <div className="mt-[.1rem] border-[1px] dark:border-white border-[#7D7D7D] w-full h-[2.6rem] rounded-[.6rem] relative p-[.57rem] pr-[.69rem] flex justify-between items-center">
                      <input
                        placeholder="Please enter your street number"
                        value={streetNo}
                        className="dark:bg-dark-background dark:text-white text-black text-[.7rem] focus:border-0 focus:outline-none w-full placeholder:text-gray-400 placeholder:font-[600]"
                        onChange={(e) => {
                          setStreetNo(e.target.value), setStateError("");
                        }}
                      />
                    </div>
                    {streetNoError && (
                      <div className="h-fit flex text-start mt-[.2rem]">
                        <span className="text-[#FF5454] text-[.57rem]">
                          {streetNoError}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="w-full">
                    <div>
                      <span className="text-[.6rem] font-[600] dark:text-white/[.8] text-[#191919]">
                        Street name
                      </span>
                    </div>
                    <div className="mt-[.1rem] border-[1px] dark:border-white border-[#7D7D7D] w-full h-[2.6rem] rounded-[.6rem] relative p-[.57rem] pr-[.69rem] flex justify-between items-center">
                      <input
                        placeholder="Please enter your street name"
                        value={streetName}
                        className="dark:bg-dark-background dark:text-white text-black text-[.7rem] focus:border-0 focus:outline-none w-full placeholder:text-gray-400 placeholder:font-[600]"
                        onChange={(e) => {
                          setStreetName(e.target.value), setStreetNameError("");
                        }}
                      />
                    </div>
                    {streetNameError && (
                      <div className="h-fit flex text-start mt-[.2rem]">
                        <span className="text-[#FF5454] text-[.57rem]">
                          {streetNameError}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="w-full">
                    <div>
                      <span className="text-[.6rem] font-[600] dark:text-white/[.8] text-[#191919]">
                        Unit no.
                      </span>
                    </div>
                    <div className="mt-[.1rem] border-[1px] dark:border-white border-[#7D7D7D] w-full h-[2.6rem] rounded-[.6rem] relative p-[.57rem] pr-[.69rem] flex justify-between items-center">
                      <input
                        placeholder="Please enter your unit number"
                        value={unitNo}
                        className="dark:bg-dark-background dark:text-white text-black text-[.7rem] focus:border-0 focus:outline-none w-full placeholder:text-gray-400 placeholder:font-[600]"
                        onChange={(e) => {
                          setUnitNo(e.target.value), setUnitNoError("");
                        }}
                      />
                    </div>
                    {unitNoError && (
                      <div className="h-fit flex text-start mt-[.2rem]">
                        <span className="text-[#FF5454] text-[.57rem]">
                          {unitNoError}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="w-full">
                    <div>
                      <span className="text-[.6rem] font-[600] dark:text-white/[.8] text-[#191919]">
                        city
                      </span>
                    </div>
                    <div className="mt-[.1rem] border-[1px] dark:border-white border-[#7D7D7D] w-full h-[2.6rem] rounded-[.6rem] relative p-[.57rem] pr-[.69rem] flex justify-between items-center">
                      <input
                        placeholder="Please enter your city"
                        value={city}
                        className="dark:bg-dark-background dark:text-white text-black text-[.7rem] focus:border-0 focus:outline-none w-full placeholder:text-gray-400 placeholder:font-[600]"
                        onChange={(e) => {
                          setCity(e.target.value), setCityError("");
                        }}
                      />
                    </div>
                    {cityError && (
                      <div className="h-fit flex text-start mt-[.2rem]">
                        <span className="text-[#FF5454] text-[.57rem]">
                          {cityError}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className=" w-full">
                    <div>
                      <span className="text-[.6rem] font-[600] dark:text-white/[.8] text-[#191919]">
                        Postal Code
                      </span>
                    </div>
                    <div className="mt-[.1rem] border-[1px] dark:border-white border-[#7D7D7D] w-full h-[2.6rem] rounded-[.6rem] relative p-[.57rem] pr-[.69rem] flex justify-between items-center">
                      <input
                        placeholder="Please enter your postal code"
                        value={postalCode}
                        className="dark:bg-dark-background dark:text-white text-black text-[.7rem] focus:border-0 focus:outline-none w-full placeholder:text-gray-400 placeholder:font-[600]"
                        onChange={(e) => {
                          setPostalCode(e.target.value), setPostalCodeError("");
                        }}
                      />
                    </div>
                    {postalCodeError && (
                      <div className="h-fit flex text-start mt-[.2rem]">
                        <span className="text-[#FF5454] text-[.57rem]">
                          {postalCodeError}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className=" w-full">
                    <div>
                      <span className="text-[.6rem] font-[600] dark:text-white/[.8] text-[#191919]">
                        Province
                      </span>
                    </div>
                    <div className="mt-[.1rem] border-[1px] dark:border-white border-[#7D7D7D] w-full h-[2.6rem] rounded-[.6rem] relative p-[.57rem] pr-[.69rem] flex justify-between items-center">
                      <input
                        placeholder="Please enter your province"
                        value={province}
                        className="dark:bg-dark-background dark:text-white text-black text-[.7rem] focus:border-0 focus:outline-none w-full placeholder:text-gray-400 placeholder:font-[600]"
                        onChange={(e) => {
                          setProvince(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                </>
              )} */}
            </div>
            <div
              className={`fixed bg-white dark:bg-black bottom-0 hidden shadow-[0_0_15px_5px_rgba(0,0,0,0.1)] backdrop-filter rounded-lg mobile:${
                isMobilePayInfo ? "hidden" : "block"
              } py-2 px-3 w-full`}
            >
              <div
                className="w-full h-[42px] bg-[#00B152] text-white flex justify-center items-center rounded-[30px] "
                onClick={handleNextPageForMobile}
              >
                Next
              </div>
            </div>
            <div
              className={`mobile:${
                isMobilePayInfo ? "block" : "hidden"
              } flex basis-[60%] mobile:basis-full min-h-[90vh] dark:bg-[#313131] mobile:dark:bg-black mobile:bg-white bg-[#F6F6F6] text-black dark:text-white pt-[1.7rem] mobile:pt-1 pl-[1.22rem] pr-[3.52rem] pb-[5.65rem] mobile:px-3 mobile:pb-[7.5rem] flex-col`}
            >
              <div>
                <span className="text-[1.4rem] font-[500]">Checkout</span>
              </div>
              <div className="dark:bg-[#464646] bg-white mobile:bg-[#F3F1F1] mobile:dark:bg-[#464646] p-[1rem] mt-[.7rem] w-full rounded-[.78rem] hidden mobile:block">
                <div>
                  <span className="text-[1.2rem] font-[500]">
                    Profile Details
                  </span>
                </div>
                {selectedState?.key && (
                  <>
                    <div className="dark:bg-[#ffffff3d] bg-[#242424]/[6%]  h-[.1rem] w-full mt-[.65rem]"></div>
                    <div className="flex justify-between mt-[.83rem]">
                      <div>
                        <span className="text-[.86rem] font-[400]">State</span>
                      </div>
                      <div>
                        <span className="text-[.86rem] font-[700]">
                          {" "}
                          {capitalizeWords(selectedState?.key)}
                        </span>
                      </div>
                    </div>
                  </>
                )}
                <div className="dark:bg-[#ffffff3d] bg-[#242424]/[6%]  h-[.1rem] w-full mt-[.65rem]"></div>
                <div className="flex justify-between mt-[.83rem]">
                  <div>
                    <span className="text-[.86rem] font-[400]">Email</span>
                  </div>
                  <div>
                    <span className="text-[.86rem] font-[700]">{email}</span>
                  </div>
                </div>
                <div className="dark:bg-[#ffffff3d] bg-[#242424]/[6%]  h-[.1rem] w-full mt-[.65rem]"></div>

                <div className="flex justify-between mt-[.83rem]">
                  <div>
                    <span className="text-[.86rem] font-[400]">
                      Phone Number
                    </span>
                  </div>
                  <div>
                    <span className="text-[.86rem] font-[700]">
                      {phoneNumber}
                    </span>
                  </div>
                </div>
                <div className="dark:bg-[#ffffff3d] bg-[#242424]/[6%]  h-[.1rem] w-full mt-[.65rem]"></div>
                {/* {selectedCountry.countryName !== "INDIA" && (
                  <>
                    <div className="flex justify-between mt-[.83rem]">
                      <div>
                        <span className="text-[.86rem] font-[400]">
                          Street no.
                        </span>
                      </div>
                      <div>
                        <span className="text-[.86rem] font-[700]">
                          {streetNo}
                        </span>
                      </div>
                    </div>
                    <div className="dark:bg-[#ffffff3d] bg-[#242424]/[6%]  h-[.1rem] w-full mt-[.65rem]"></div>
                    <div className="flex justify-between mt-[.83rem]">
                      <div>
                        <span className="text-[.86rem] font-[400]">
                          Street Name
                        </span>
                      </div>
                      <div>
                        <span className="text-[.86rem] font-[700]">
                          {streetName}
                        </span>
                      </div>
                    </div>
                    <div className="dark:bg-[#ffffff3d] bg-[#242424]/[6%]  h-[.1rem] w-full mt-[.65rem]"></div>
                    <div className="flex justify-between mt-[.83rem]">
                      <div>
                        <span className="text-[.86rem] font-[400]">
                          Unit Number
                        </span>
                      </div>
                      <div>
                        <span className="text-[.86rem] font-[700]">
                          {unitNo}
                        </span>
                      </div>
                    </div>
                    <div className="dark:bg-[#ffffff3d] bg-[#242424]/[6%]  h-[.1rem] w-full mt-[.65rem]"></div>
                    <div className="flex justify-between mt-[.83rem]">
                      <div>
                        <span className="text-[.86rem] font-[400]">City</span>
                      </div>
                      <div>
                        <span className="text-[.86rem] font-[700]">{city}</span>
                      </div>
                    </div>
                    <div className="dark:bg-[#ffffff3d] bg-[#242424]/[6%]  h-[.1rem] w-full mt-[.65rem]"></div>
                    <div className="flex justify-between mt-[.83rem]">
                      <div>
                        <span className="text-[.86rem] font-[400]">
                          Postal Code
                        </span>
                      </div>
                      <div>
                        <span className="text-[.86rem] font-[700]">
                          {postalCode}
                        </span>
                      </div>
                    </div>
                    <div className="dark:bg-[#ffffff3d] bg-[#242424]/[6%]  h-[.1rem] w-full mt-[.65rem]"></div>
                    {province && (
                      <>
                        <div className="flex justify-between mt-[.83rem]">
                          <div>
                            <span className="text-[.86rem] font-[400]">
                              Province
                            </span>
                          </div>
                          <div>
                            <span className="text-[.86rem] font-[700]">
                              {province}
                            </span>
                          </div>
                        </div>
                        <div className="dark:bg-[#ffffff3d] bg-[#242424]/[6%]  h-[.1rem] w-full mt-[.65rem]"></div>
                      </>
                    )}
                  </>
                )} */}
              </div>
              <div className="dark:bg-[#464646] bg-white mobile:bg-[#F3F1F1] mobile:dark:bg-[#464646] p-[1rem] mt-[1.26rem] mobile:mt-[.7rem] w-full rounded-[.78rem]">
                <div>
                  <span className="text-[1.2rem] font-[500]">
                    Package Details
                  </span>
                </div>
                <div className="dark:bg-[#ffffff3d] bg-[#242424]/[6%] h-[.1rem] w-full mt-[.65rem]"></div>
                <div className="mt-[.83rem]">
                  <div>
                    <span className="text-[.86rem] font-[400]">
                      Selected Package
                    </span>
                  </div>
                  <div className="">
                    <div className="mt-[.6rem] text-[.6rem] mobile:text-[.7rem] p-2  border-2 dark:border-[#727272] dark:bg-[#7575752E] border-[#242424]/[6%] bg-[#F3F1F1] rounded-[18px]">
                      <p>{capitalizeWords(level)}</p>
                      <p className="my-1">{industry?.industry}</p>
                      {specialization?.stack}
                    </div>
                  </div>
                </div>
                <div className="dark:bg-[#ffffff3d] bg-[#242424]/[6%]  h-[.1rem] w-full mt-[.65rem]"></div>
                <div className="flex justify-between mt-[.83rem]">
                  <div>
                    <span className="text-[.86rem] font-[400]">Duration</span>
                  </div>
                  <div>
                    <span className="text-[.86rem] font-[600]">
                      {" "}
                      {slotDetails.duration}
                    </span>
                  </div>
                </div>
                <div className="dark:bg-[#ffffff3d] bg-[#242424]/[6%] h-[.1rem] w-full mt-[.65rem]"></div>

                <div className="flex justify-between mt-[.83rem]">
                  <div>
                    <span className="text-[.86rem] font-[400]">Date</span>
                  </div>
                  <div>
                    <span className="text-[.86rem] font-[600]">
                      {FormattedDateForCheckout(
                        selectedDate,
                        selectedCountry.currencyCulture
                      )}{" "}
                    </span>
                  </div>
                </div>
                <div className="dark:bg-[#ffffff3d] bg-[#242424]/[6%]  h-[.1rem] w-full mt-[.65rem]"></div>
                <div className="flex justify-between mt-[.83rem]">
                  <div>
                    <span className="text-[.86rem] font-[400]">Time</span>
                  </div>
                  <div>
                    <span className="text-[.86rem] font-[600]">
                      {slotDetails.time}
                    </span>
                  </div>
                </div>
                <div className="dark:bg-[#ffffff3d] bg-[#242424]/[6%]  h-[.1rem] w-full mt-[.65rem]"></div>
                <div className="flex justify-between mt-[.83rem]">
                  <div>
                    <span className="text-[.86rem] font-[400]">Price</span>
                  </div>
                  <div>
                    <span className="text-[.86rem] font-[700]">
                      {formatCurrency(
                        slotDetails.referencePice,
                        selectedCountry
                      )}
                    </span>
                  </div>
                </div>
                <div className="dark:bg-[#ffffff3d] bg-[#242424]/[6%]  h-[.1rem] w-full mt-[.65rem]"></div>
              </div>
              <>
                {" "}
                {tax ? (
                  <>
                    <div className="dark:bg-[#464646] bg-white mobile:bg-[#F3F1F1] mobile:dark:bg-[#464646] p-[1rem] mt-[.7rem] w-full rounded-[.78rem]">
                      <div>
                        <span className="text-[1.2rem] font-[500]">
                          Price Details
                        </span>
                      </div>
                      <div className="dark:bg-[#ffffff3d] bg-[#242424]/[6%]  h-[.1rem] w-full mt-[.65rem]"></div>
                      <div className="flex justify-between mt-[.83rem]">
                        <div>
                          <span className="text-[.86rem] font-[400]">
                            Sub Total
                          </span>
                        </div>
                        <div>
                          <span className="text-[.86rem] font-[700]">
                            {" "}
                            {formatCurrency(
                              slotDetails.referencePice,
                              selectedCountry
                            )}
                          </span>
                        </div>
                      </div>
                      <div className="dark:bg-[#ffffff3d] bg-[#242424]/[6%]  h-[.1rem] w-full mt-[.65rem]"></div>
                      {discountPrice != 0 && (
                        <>
                          <div className="flex justify-between mt-[.83rem]">
                            <div>
                              <span className="text-[.86rem] font-[400]">
                                Offer Discount
                              </span>
                            </div>
                            <div>
                              <span className="text-[.86rem] font-[700]">
                                {formatCurrency(discountPrice, selectedCountry)}
                              </span>
                            </div>
                          </div>
                          <div className="dark:bg-[#ffffff3d] bg-[#242424]/[6%]  h-[.1rem] w-full mt-[.65rem]"></div>
                        </>
                      )}
                      <div className="flex justify-between mt-[.83rem]">
                        <div>
                          <span className="text-[.86rem] font-[400]">
                            {" "}
                            {selectedCountry.taxName}
                          </span>
                        </div>
                        <div>
                          <span className="text-[.86rem] font-[700]">
                            {formatCurrency(tax, selectedCountry)}
                          </span>
                        </div>
                      </div>

                      <div className="dark:bg-[#ffffff3d] bg-[#242424]/[6%]  h-[.1rem] w-full mt-[.65rem]"></div>

                      <div className="flex justify-between mt-[.83rem]">
                        <div>
                          <span className="text-[.86rem] font-[400]">
                            Total Amount
                          </span>
                        </div>
                        <div>
                          <span className="text-[.86rem] font-[700]">
                            {formatCurrency(totalPrice, selectedCountry)}
                          </span>
                        </div>
                      </div>
                      <div className="dark:bg-[#ffffff3d] bg-[#242424]/[6%]  h-[.1rem] w-full mt-[.65rem]"></div>
                    </div>
                  </>
                ) : null}
              </>
              <div className=" dark:bg-[#464646] bg-white mobile:bg-[#F3F1F1] mobile:dark:bg-[#464646] w-full rounded-[.52rem] mt-[.7rem] flex flex-col justify-center items-center cursor-pointer overflow-hidden">
                {applyCoupon == "applied" ? (
                  <>
                    <div className="w-full h-full p-2 flex gap-[1.17rem] ">
                      <input
                        value={couponCode}
                        placeholder="Enter your coupon code"
                        className="p-[.6rem] bg-[#ACFFD2]/[8%] border border-dashed outline-none border-[#00B152] text-[0.6087rem] w-full rounded"
                        onChange={(e) => {
                          setCouponCode(e.target.value);
                          setCouponCodeError("");
                        }}
                      />
                      <button
                        onClick={handleApplyCoupon}
                        disabled={
                          selectedCountry.countryName == "INDIA"
                            ? selectedState
                              ? false
                              : true
                            : false
                        }
                        title={
                          selectedCountry.countryName == "INDIA"
                            ? selectedState
                              ? ""
                              : "Please select state to apply coupon"
                            : ""
                        }
                        className={`w-[5.91304rem] h-[1.95652rem] text-white text-[0.6087rem] bg-black rounded-full ${
                          selectedCountry.countryName == "INDIA"
                            ? selectedState
                              ? "cursor-pointer"
                              : "cursor-not-allowed bg-gray-600"
                            : "cursor-pointer"
                        }`}
                      >
                        <svg
                          role="status"
                          className={`inline w-4 h-4 me-3 text-white animate-spin ${
                            applyCouponLoader ? "" : "hidden"
                          }`}
                          viewBox="0 0 100 101"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="#E5E7EB"
                          />
                          <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentColor"
                          />
                        </svg>
                        Apply
                      </button>
                    </div>
                    {couponCodeError && (
                      <div className="text-red-500 text-[0.6087rem] w-[95%]">
                        <div>{couponCodeError}</div>
                      </div>
                    )}
                  </>
                ) : applyCoupon == "valid" ? (
                  <div className="w-full h-full flex justify-between items-center px-[1rem] py-[.7rem] text-[0.69565rem] bg-[#abffd238]">
                    <div className="dark:text-white text-black font-semibold w-[60%]">
                      {couponDescription}
                      <div className="font-normal">
                        Coupon :{" "}
                        <span className="font-semibold">{couponCode}</span>
                      </div>
                    </div>
                    <div onClick={handleRemoveCoupon}>
                      {
                        <svg
                          role="status"
                          className={`inline w-4 h-4 me-3 dark:text-white text-black animate-spin ${
                            applyCouponLoader ? "" : "hidden"
                          }`}
                          viewBox="0 0 100 101"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="#E5E7EB"
                          />
                          <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentColor"
                          />
                        </svg>
                      }
                      <span className="text-[.5rem] font-[600] underline underline-offset-2 dark:text-white text-black opacity-80">
                        Remove coupon code
                      </span>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={handleEnterCoupon}
                    className="cursor-pointer py-[.5rem]"
                  >
                    <span className="text-[#0094FF] text-[.6rem]">
                      Do you have a coupon?
                    </span>
                  </div>
                )}
              </div>

              <div
                className="mobile:block mobile:fixed mobile:w-full bottom-0 left-[50%] mobile:translate-x-[-50%] mobile:dark:bg-[#2F2A2A] mobile:bg-white mobile:pb-[2.5rem] mobile:px-3 
                mobile:shadow-[0_0_15px_5px_rgba(0,0,0,0.1)] backdrop-filter backdrop-blur-sm mobile:rounded-lg"
              >
                <div
                  className="bg-primary h-[3.1rem] w-full rounded-[1.27rem] mt-[.7rem] flex justify-center items-center cursor-pointer"
                  onClick={
                    selectedCountry.paymentMethod == "Razorpay"
                      ? initPaymentRazorPay
                      : initPaymentStripe
                  }
                >
                  <div>
                    <svg
                      role="status"
                      className={`inline w-4 h-4 me-3 text-white animate-spin ${
                        paymentLoading ? "" : "hidden"
                      }`}
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="#E5E7EB"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentColor"
                      />
                    </svg>

                    <span className=" text-[1rem] font-[700] text-white">
                      Proceed to pay
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-[.7rem] text-center font-[400] mobile:text-[.65rem] mobile:fixed bottom-0 mobile:px-3 mobile:pb-[0.1rem]">
                <span>
                  By completing this purchase, you agree to our
                  <span className="text-primary">
                    {" "}
                    Terms of Service{" "}
                  </span> and{" "}
                  <span className="text-primary"> Privacy Policy </span>{" "}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CheckOut;
