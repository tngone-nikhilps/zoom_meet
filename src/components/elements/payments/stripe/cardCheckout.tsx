import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { StripeElementStyle } from "@stripe/stripe-js";
import axios from "axios";
import { FormEvent, useState } from "react";
import useConfigStore from "../../../../configStore/store";
import { formatCurrency } from "../../../../services/helpers/helper";
import { ENDPOINTS } from "../../../../services/urls";
import { useDarkMode } from "../../../../theme/useDarkMode";

const PaymentForm = ({
  orderId,
  totalPrice,
  clientSecret,
  handleNavigate,
  paymentIntentId,
}: any) => {
  const { isDarkMode } = useDarkMode();
  const elementStyle: StripeElementStyle = {
    base: {
      fontSize: "16px",
      color: isDarkMode ? "#ffffff" : " #32325d",
      fontFamily: "Arial, sans-serif",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  };
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [cardComplete, setCardComplete] = useState<boolean>(false);
  const [processing, setProcessing] = useState<boolean>(false);
  const { selectedCountry } = useConfigStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event: any) => {
    setError(event.error ? event.error.message : "");
    setCardComplete(event.complete);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    if (!stripe || !elements) {
      setError("Stripe.js hasn't loaded yet. Please try again.");
      setIsLoading(false);
      return;
    }

    if (!cardComplete) {
      setError("Please enter valid card details.");
      setIsLoading(false);
      return;
    }

    if (error) {
      elements.getElement(CardElement)?.focus();
      setIsLoading(false);
      return;
    }

    setProcessing(true);

    const cardElement = elements.getElement(CardElement);
    if (cardElement) {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });

      if (error) {
        setError(error.message ?? "An unknown error occurred");
        setProcessing(false);
        setIsLoading(false);
        return;
      }

      if (paymentMethod) {
        const result = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: "Jenny Rosen",
            },
          },
        });

        if (result.error) {
          setError(result.error.message ?? "Payment failed");
          setProcessing(false);
          setIsLoading(false);
        } else {
          if (result.paymentIntent.status === "succeeded") {
            markOrderComplete();
          }
        }
      }
    }
    setProcessing(false);
  };
  console.log(paymentIntentId, "paymentIntentId");
  const markOrderComplete = () => {
    const body = {
      orderId: orderId,
    };
    axios
      .post(ENDPOINTS.MARK_ORDER_COMPLETE, body)
      .then(() => {
        handleNavigate("", paymentIntentId);
        setProcessing(false);
      })
      .catch((error) => {
        setError(
          error.message ??
            "Failed to mark order as complete. Please contact support."
        );
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <span className="dark:text-white">Card Information</span>
      </div>
      <div className="h-fit mt-[10px] rounded-[20px] w-full">
        <div className="h-[2.6rem] w-full border-[1px] mt-[.43rem] border-[#7D7D7D] rounded-[.36rem] px-[20px] pt-[16px]">
          <CardElement
            options={{
              style: elementStyle,
              hidePostalCode: true,
            }}
            onChange={handleChange}
          />
        </div>
      </div>
      {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full h-[50px] bg-primary text-white mt-[30px] rounded-[1.2rem] text-[0.7rem]"
      >
        <svg
          role="status"
          className={`inline w-4 h-4 me-3 text-white animate-spin ${
            isLoading ? "" : "hidden"
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
          Pay {formatCurrency(totalPrice, selectedCountry)}
        </span>
      </button>
    </form>
  );
};

export default PaymentForm;
