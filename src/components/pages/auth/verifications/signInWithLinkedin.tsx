import axios from "axios";
import { useLinkedIn } from "react-linkedin-login-oauth2";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../../../authStore/store";
import { PATHS } from "../../../../router";
import { ENDPOINTS } from "../../../../services/urls";
import SVGLoader from "../../../elements/loader/svgLoader2";
import { useState } from "react";

function SignInWithLinkedin() {
    const { setUserId, setToken, setUserType, setUserEmail } = useAuthStore();
    const [loader, setLoader] = useState(false);
    const navigate = useNavigate();
    const LINKEDIN_CLIENT_ID = '86m9lru2ec9nxd';
    const LINKEDIN_REDIRECT_URI = `${window.location.origin}/linkedin`;

    const { linkedInLogin } = useLinkedIn({
        clientId: LINKEDIN_CLIENT_ID,
        redirectUri: LINKEDIN_REDIRECT_URI,
        onSuccess: (code) => {
            setLoader(true);
            axios.get(ENDPOINTS.SIGN_IN_WITH_LINKEDIN + `/${code}`).then((response) => {
                setLoader(false);
                if (response.data.success) {
                    console.log(response);
                    setUserId(response.data.userId);
                    setToken(response.data.token);
                    setUserType(response.data.userType);
                    setUserEmail(response.data.email);
                    navigate(PATHS.dashboard);
                }
            }).catch((error) => {
                console.log(error);
                setLoader(false);
            })
        },
        scope: "email openid profile",
        onError: (error) => {
            console.log(error);
        },
    });
    return (
        <>
            <div className="w-full h-[2.2rem] bg-white text-black rounded-lg shadow-lg border flex justify-center items-center text-[.8rem] gap-2" role="button" onClick={() => {
                linkedInLogin()
            }}>
                <div>
                    <img src="/icons/linkedInIcon.svg" alt="" />
                </div>
                <div>
                    Sign in with LinkedIn
                </div>
            </div>
            {loader && <SVGLoader />}
        </>
    )
}

export default SignInWithLinkedin