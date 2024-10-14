import { useEffect } from "react";
import useAuthStore, { AuthState } from "../authStore/store";
import { authKeyName } from "../services/constants";
import axios from "axios";
import useRefreshToken from "../services/requests/refreshtoken";
const axiosIntercepted = axios.create({
  headers: { "Content-Type": "application/json" },
});

export const axiosBase = axios.create({
  headers: { "Content-Type": "application/json" },
});
const useAxiosAuthKey = () => {
  const refresh = useRefreshToken();
  const accessToken = useAuthStore((state: AuthState) => state.token);

  useEffect(() => {
    const requestIntercept = axiosIntercepted.interceptors.request.use(
      (config) => {
        if (!config.headers[authKeyName]) {
          config.headers[authKeyName] = `${accessToken}`;
        }
        return config;
      },
      // eslint-disable-next-line no-undef
      (error: any) => Promise.reject(error)
    );

    const responseIntercept = axiosIntercepted.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (
          [403, 412].includes(error?.response?.status) &&
          !prevRequest?.sent
        ) {
          prevRequest.sent = true;
          const newRefreshToken = await refresh();
          if (!newRefreshToken) {
            return null;
          }
          prevRequest.headers[authKeyName] = `${newRefreshToken}`;
          return axiosIntercepted(prevRequest);
        }
        // eslint-disable-next-line no-undef
        return Promise.reject(error);
      }
    );

    return () => {
      axiosIntercepted.interceptors.request.eject(requestIntercept);
      axiosIntercepted.interceptors.response.eject(responseIntercept);
    };
  }, [accessToken, refresh]);

  return axiosIntercepted;
};

export default useAxiosAuthKey;
