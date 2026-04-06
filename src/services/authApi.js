import apiClient from "../api/apiClient";
import { ENDPOINTS } from "../api/endpoints";

export const sendOtp = async (email) => {
  return await apiClient.post(ENDPOINTS.AUTH.SEND_OTP, {
    email,
  });
};

export const verifyOtp = async (email, otp) => {
  return await apiClient.post(ENDPOINTS.AUTH.LIST, {
    email,
    otp,
  });
};

export const resetPassword = async (email, password) => {
  return await apiClient.post(ENDPOINTS.AUTH.LIST, {
    email,
    password,
  });
};
