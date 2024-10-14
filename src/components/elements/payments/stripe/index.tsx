import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import ReactDOM from "react-dom";
import { useDarkModeStore } from "../../../../theme/store";
import CardForm from "./cardCheckout";
import ExpressCheckoutPage from "./expressCheckoutPage";

interface ConfirmModalProps {
  confirmModalPopUp: boolean;
  clientSecret: string;
  setConfirmModalPopUp: React.Dispatch<React.SetStateAction<boolean>>;
  totalPrice: any;
  handleNavigate: any;
  paymentIntetntId: string;
  orderId: any;
}

export default function StripeModal({
  confirmModalPopUp,
  setConfirmModalPopUp,
  paymentIntetntId,
  orderId,
  totalPrice,
  handleNavigate,
  clientSecret,
}: ConfirmModalProps) {
  if (!confirmModalPopUp) return null;
  const stripePromise = loadStripe(
    "pk_test_51PWGOARr31f4HmfJ1Fd5iE0iDSd9u8vZhjsxVI8o6DkeG4hynBZhyozqeBzzmj5suM4xuVLLF8u2sFlcd8hqiY3S00Hg1ynsfP"
  );
  const { isDarkMode } = useDarkModeStore();
  const options: any = {
    // passing the client secret obtained from the server
    clientSecret: clientSecret,
    appearance: {
      theme: isDarkMode ? "night" : "stripe",
      labels: "floating",
    },
  };
  console.log(paymentIntetntId, "totalPriceValue");
  if (clientSecret === "") return null;
  return ReactDOM.createPortal(
    <div className="fixed z-50 inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="h-fit w-[27rem] mobile:h-full mobile:w-full rounded-[.74rem]  p-[1px] flex">
        <div className="bg-white dark:bg-[#1F1F1F] h-full pt-[70px] relative flex-1 rounded-[.8rem] mobile:rounded-none p-[20px]  overflow-x-hidden">
          <div
            className="  absolute top-[.87rem] right-[.87rem] w-full flex justify-end mb-4"
            onClick={() => setConfirmModalPopUp(false)}
          >
            <img
              src={
                isDarkMode
                  ? "/icons/darkMode/close.svg"
                  : "/icons/lightMode/close.svg"
              }
              alt=""
              className="cursor-pointer w-[1rem] h-auto"
            />
          </div>

          <Elements stripe={stripePromise} options={options}>
            <ExpressCheckoutPage></ExpressCheckoutPage>
            {/* <CheckoutForm
              totalPrice={totalPrice}
              orderId={orderId}
              handleNavigate={handleNavigate}
              paymentIntetntId={paymentIntetntId}
            ></CheckoutForm> */}
            <div className="flex mt-[2rem] mb-[2rem] items-center w-full justify-center ">
              <div className="h-[1px] bg-[#444444] w-[30%] "></div>
              <div className="mx-[20px] flex">
                <span className="text-[.7rem]  text-[#6D6D6D]">
                  Or pay with card
                </span>
              </div>
              <div className="h-[1px] bg-[#444444] w-[30%] "></div>
            </div>

            <CardForm
              clientSecret={clientSecret}
              totalPrice={totalPrice}
              orderId={orderId}
              handleNavigate={handleNavigate}
              paymentIntentId={paymentIntetntId}
            ></CardForm>
          </Elements>
        </div>
      </div>
    </div>,
    document.body
  );
}
