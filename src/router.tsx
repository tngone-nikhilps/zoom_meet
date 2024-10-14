/* eslint-disable react-refresh/only-export-components */
// Layouts
import { createBrowserRouter } from "react-router-dom";

import AuthLayout from "./components/layouts/auth";
import { authGuard, returnGuard } from "./guards";

import DashboardLayout from "./components/layouts/dashboard";
import CheckOut from "./components/pages/auth/checkout";
import ChooseIndustry from "./components/pages/auth/chooseIndustry";
import ChooseLevel from "./components/pages/auth/chooseLevel";

import LoginPage from "./components/pages/auth/login";

import SignUp from "./components/pages/auth/signup";
import Dashboard from "./components/pages/dashboard";
import ChooseSpecialization from "./components/pages/auth/chooseSpecialization";
import ChooseSlots from "./components/pages/auth/chooseSlots";
import MyInterviews from "./components/pages/dashboard/myInterviews";
import MyPerformance from "./components/pages/dashboard/myPerformance";
import Academy from "./components/pages/dashboard/academy";
import PurchaseAndPayment from "./components/pages/dashboard/purchaseAndPayments";
import ReferralAndEarnings from "./components/pages/dashboard/referralAndEarnings";
import { LinkedInCallback } from "react-linkedin-login-oauth2";
import PaymentSuccess from "./components/pages/auth/paymentSuccess";
import OtpVerification from "./components/pages/auth/verifications/otpVerification";
import VideoPreview from "./components/pages/preview";

// All pages loaded lazily, to keep the initial JS bundle to a minimum size
//unauthorized

export const PATHS = {
  chooseLevel: "/",
  chooseIndustry: "/choose-industry",
  chooseSpecialization: "/choose-specialization",
  chooseSlots: "/choose-slots",
  checkOut: "/check-out",
  PaymentSuccess: "/payment-success",
  login: "/login",
  signup: "/sign-up",
  otpVerify: "/otp-verify",

  dashboard: "/dashboard",
  myInterviews: "/dashboard/my-interviews",
  myPerformance: "/dashboard/my-performance",
  academy: "/dashboard/academy",
  purchaseAndPayment: "/dashboard/purchase-and-payment",
  referralAndEarnings: "/dashboard/referral-and-earnings",
  videoPreview: "/videoPreview",
};
// const AuthLayout = lazy(() => import("./components/layouts/auth"));
// const Login = lazy(() => import("./components/pages/auth/login"));
// const ChangePassword = lazy(
//   () => import("./components/pages/auth/chnagePassword")
// );
// const ForgotPassword = lazy(
//   () => import("./components/pages/auth/forgotPassword")
// );
// const OTPVerification = lazy(() => import("./components/pages/auth/otpVerify"));
// //authorized
// const DashboardLayout = lazy(() => import("./components/layouts/dashboard"));
// const Pages = lazy(() => import("./components/pages/dashboard/page"));
// const AddPage = lazy(() => import("./components/pages/dashboard/page/addPage"));
// const Menus = lazy(() => import("./components/pages/dashboard/menus"));
const router = createBrowserRouter([
  {
    id: "root",
    path: "/",
    Component: AuthLayout,
    // loader: returnGuard,
    children: [
      {
        index: true,

        element: <ChooseLevel />,
        // loader: returnGuard,
      },
      {
        path: PATHS.chooseIndustry,
        element: <ChooseIndustry />,
      },
      {
        path: PATHS.chooseSpecialization,
        element: <ChooseSpecialization />,
      },
      {
        path: PATHS.chooseSlots,
        element: <ChooseSlots />,
      },
      {
        path: PATHS.checkOut,
        element: <CheckOut />,
      },
      {
        path: "/payment-success",
        element: <PaymentSuccess />,
      },
    ],
  },
  {
    path: PATHS.dashboard,
    Component: DashboardLayout,
    loader: authGuard,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: PATHS.myInterviews,
        element: <MyInterviews />,
      },
      {
        path: PATHS.myPerformance,
        element: <MyPerformance />,
      },
      {
        path: PATHS.academy,
        element: <Academy />,
      },
      {
        path: PATHS.purchaseAndPayment,
        element: <PurchaseAndPayment />,
      },
      {
        path: PATHS.referralAndEarnings,
        element: <ReferralAndEarnings />,
      },
    ],
  },
  {
    path: PATHS.login,
    element: <LoginPage />,
    loader: returnGuard,
  },
  {
    path: PATHS.otpVerify,
    element: <OtpVerification />,
    loader: returnGuard,
  },
  {
    path: PATHS.signup,
    element: <SignUp />,
    loader: returnGuard,
  },
  {
    path: "/success",
    element: <SignUp />,
    loader: returnGuard,
  },
  {
    path: "/linkedin",
    element: <LinkedInCallback />,
  },
  {
    path: "/videoPreview",
    element: <VideoPreview />,
  },

  // {
  //   id: "dashboard",
  //   path: "/dashboard",
  //   Component: DashboardLayout,
  //   loader: (args) => roleGuard([UserRole.Admin], args),

  //   children: [
  //     // {
  //     //   index: true,
  //     //   // action: loginLoader,
  //     // loader: authGuard,
  //     //   element: pages,
  //     // },
  //     {
  //       path: "pages",
  //       // action: loginLoader,
  //       Component: Pages,
  //     },
  //     {
  //       path: "pages/addPage",
  //       Component: AddPage,
  //     },
  //     {
  //       path: "menus",
  //       Component: Menus,
  //     },
  //     {
  //       path: "menus/addMenu",
  //       Component: AddMenu,
  //     },
  //     {
  //       path: "menus/editMenu/:menuId",
  //       Component: EditMenu,
  //     },
  //   ],
  // },
]);

export default router;
