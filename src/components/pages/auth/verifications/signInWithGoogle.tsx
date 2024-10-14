import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../../../authStore/store";
import { PATHS } from "../../../../router";
import { ENDPOINTS } from "../../../../services/urls";
import SVGLoader from "../../../elements/loader/svgLoader2";

function SignInWithGoogle() {
  const navigate = useNavigate();
  const { setUserId, setToken, setUserType, setUserEmail } = useAuthStore();
  const [loader,setLoader] = useState(false);
  const login = useGoogleLogin({
    onSuccess: tokenResponse => {
      setLoader(true);
      const body = {
        token: tokenResponse.access_token,
        signUpType: "GOOGLE",
        fullName: ""
      }
      axios.post(ENDPOINTS.SIGN_IN_WITH_GOOGLE, body)
        .then((response) => {
          setLoader(false);
          setUserId(response.data.userId);
          setToken(response.data.token);
          setUserType(response.data.userType);
          setUserEmail(response.data.email);
          navigate(PATHS.dashboard);
        }).catch((error) => {
          console.log(error);
          setLoader(false);
        })
    },
    onError: () => {
      console.log('Login Failed');
    }
  })
  return (
    <>
    {loader && <SVGLoader/>}
    <div>
      <div className="w-full h-[2.2rem] bg-white text-black rounded-lg shadow-md border flex justify-center items-center text-[.8rem] gap-2" role="button" onClick={() => {
        login()
      }}>
        <div>
          <img src="/icons/googleIcon.svg" alt="" />
        </div>
        <div>
          Sign in with Google
        </div>
      </div>
    </div>
    </>
  )
}

export default SignInWithGoogle