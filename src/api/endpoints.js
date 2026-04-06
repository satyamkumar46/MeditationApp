/**
 * API Endpoints
 *
 * All API endpoint paths in one place.
 * Organized by feature/resource for easy maintenance.
 */

export const ENDPOINTS = {
  TEACHERS: {
    LIST: "/teachers",
    GET_BY_ID: (id) => `/teachers/${id}`,
  },
  SOUNDS: {
    LIST: "/sounds",
  },
  AUTH: {
    LIST: "/auth",
    SEND_OTP: "/auth/send-otp",
  },
};
