const BASE_URLS: any = {
  DEV: "https://dev.api.qyxyp.interviewbetter.io",
  QA: "https://qa.api.qyxyp.interviewbetter.io",
  UAT: "https://demo.api.qyxyp.interviewbetter.io",
  STAGING: "",
  PRODUCTION: "",
  LOCAL: "https://dev.api.qyxyp.interviewbetter.io",
};

// Define service paths
const SERVICES = {
  AUTH: "auth",
  SCHEDULER: "scheduler",
  ADMIN: "mission-control",
  CUSTOMER: "customer",
  ORDER: "orders",
  PAYMENT: "payments",
};

// Function to generate service URLs
const generateServiceUrls = (environment: any) => {
  const baseUrl = BASE_URLS[environment];
  return Object.fromEntries(
    Object.entries(SERVICES).map(([key, path]) => [key, `${baseUrl}/${path}`])
  );
};

// Set the current environment
const CURRENT_ENVIRONMENT = "DEV";

// Generate service URLs for the current environment
const SERVICES_URLS = generateServiceUrls(CURRENT_ENVIRONMENT);
export const ENDPOINTS = {
  //Authorized
  USER_SIGNUP: SERVICES_URLS.AUTH + "/api/Auth/SignUp",
  USER_LOGIN: SERVICES_URLS.AUTH + "/api/Auth/AuthenticateUser",
  OTP_VERIFY: SERVICES_URLS.AUTH + "/api/Auth/VerifyOtp",
  REFRESH_TOKEN: SERVICES_URLS.AUTH + "/api/Auth/RefreshToken",
  SIGN_IN_WITH_GOOGLE: SERVICES_URLS.AUTH + "/api/Auth/SocialMediaLogin",
  SIGN_IN_WITH_LINKEDIN: SERVICES_URLS.AUTH + "/api/Auth/SignUpThroughLinkedIn",
  //unAuthorized
  //customer service
  GET_ALL_COUNTRY_CODE: SERVICES_URLS.CUSTOMER + "/api/Lookup/GetCountryLookUp",
  GET_ALL_UPCOMING_INTERVIEWS:
    SERVICES_URLS.CUSTOMER + "/api/Interviewee/GetUpcomingInterviews",
  GENERATE_INVOICE: SERVICES_URLS.CUSTOMER + "/api/Interviewee/GenerateInvoice",
  //unAuthorized
  //CUSTOMER SERVICE
  GET_ALL_LOOKUP: SERVICES_URLS.CUSTOMER + "/api/Lookup/GetAllLookUp",
  GET_ALL_LEVELS: SERVICES_URLS.CUSTOMER + "/api/Lookup/GetAllLevels",
  GET_ALL_TRENDING_SPECIALIZATIONS:
    SERVICES_URLS.CUSTOMER + "/api/Interviewee/TrendingStack/",
  GET_COUNTRY_DETAILS: SERVICES_URLS.CUSTOMER + "/api/Lookup/GetCountryLookUp",
  GET_ALL_CONFIGS: SERVICES_URLS.CUSTOMER + "/api/Lookup/GetAllConfig",
  //ADMIN SERVICE
  GETALL_INDUSTRIES:
    SERVICES_URLS.ADMIN + "/api/Configuration/GetAllIndustries",
  GETALL_SPECIALIZATIONS:
    SERVICES_URLS.ADMIN + "/api/Configuration/GetAllStacks",
  GET_STACK: SERVICES_URLS.ADMIN + "/api/Configuration/GetStack",
  SEARCH_STACK: SERVICES_URLS.ADMIN + "/api/Configuration/SearchStack",
  //SCHEDULER SERVICE
  GET_SLOTS: SERVICES_URLS.SCHEDULER + "/api/Availability/GetSlots",
  //ORDER SERVICE
  CREATE_ORDER: SERVICES_URLS.ORDER + "/api/Order/CreateOrder",
  CHECKOUT_ORDER: SERVICES_URLS.ORDER + "/api/Order/CheckOut",
  INITIATE_ORDER: SERVICES_URLS.ORDER + "/api/Order/IntiateOrder",
  APPLY_PROMOCODE: SERVICES_URLS.ORDER + "/api/Order/ApplyCoupon",
  REMOVE_PROMOCODE: SERVICES_URLS.ORDER + "/api/Order/RemoveCoupon",
  //PAYMENT SERVICE
  VERIFY_SIGNATURE: SERVICES_URLS.PAYMENT + "/api/RazorPay/VerifySignature",
  GET_PAYMENT_DETAILS: SERVICES_URLS.PAYMENT + "/api/RazorPay/PaymentDetails",
  MARK_ORDER_COMPLETE: SERVICES_URLS.PAYMENT + "/api/Stripe/MarkOrderComplete",
};
