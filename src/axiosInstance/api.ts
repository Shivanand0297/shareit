import axios from "axios";
import { store } from "@/store"
import { resetAllData } from "@/store/actions/loginActions";

// initialize axios
const api = axios.create({
  baseURL: `${
    process.env.VITE_APP_ENV === "dev"
      ? process.env.VITE_APP_API_DEV_URL
      : process.env.VITE_APP_API_BASE_URL
  }/api/v1`,
  headers: {
    common: {
      Authorization: `Bearer ${localStorage.getItem("accessToken") ?? ""}`,
    },
  },
  withCredentials: true,
});

// interseptor for session expired
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (err) => {
    if (
        err.response?.data?.error === "Unauthorized" &&
        err.response?.status === 401
    ) {
        localStorage.clear();
        store.dispatch(resetAllData());
    }
    return Promise.reject(err);
  }
);

export default api;
