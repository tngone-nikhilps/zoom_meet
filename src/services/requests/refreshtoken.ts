import { ENDPOINTS } from "../urls";

import useAuthStore, { AuthState } from "../../authStore/store";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const axiosBase = axios.create({
  headers: { "Content-Type": "application/json" },
});
const useRefreshToken = () => {
  const accessToken = useAuthStore((state: AuthState) => state.token);
  const setaccessToken = useAuthStore((state: AuthState) => state.setToken);
  const navigate = useNavigate();

  const refresh = async () => {
    const response = await axiosBase.post(ENDPOINTS.REFRESH_TOKEN, {
      authToken: accessToken,
    });
    let newRefreshToken: string | null = null;
    if (!response.data.success || response.data.isReAuthRequired) {
      useAuthStore.persist.clearStorage();
      navigate("/");
    } else {
      setaccessToken(response.data.token);
    }

    //on any page you want

    return newRefreshToken;
  };
  return refresh;
};

export default useRefreshToken;
