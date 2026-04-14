import apiClient from "../api/apiClient";
import { ENDPOINTS } from "../api/endpoints";

export const sendOtp = async (email) => {
  return await apiClient.post(ENDPOINTS.AUTH.SEND_OTP, {
    email,
  });
};

