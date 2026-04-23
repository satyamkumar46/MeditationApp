import apiClient from "../api/apiClient";
import { removeToken, saveToken } from "../utility/storage";

export const signup = async ({ name, email, password }) => {
  try {
    const res = await apiClient.post("/auth/signup", {
      name,
      email,
      password,
    });

    if (res.data.token) {
      await saveToken(res.data.token);
    }

    return res;
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const login = async ({ email, password }) => {
  try {
    const res = await apiClient.post("/auth/login", {
      email,
      password,
    });

    if (res.data.token) {
      await saveToken(res.data.token);
    }

    return res;
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const googleLogin = async (firebaseToken) => {
  try {
    const res = await apiClient.post(
      "/auth/firebase",
      {},
      {
        headers: {
          Authorization: `Bearer ${firebaseToken}`,
        },
      },
    );

    if (res.data.token) {
      await saveToken(res.data.token);
    }

    return res;
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const logout = async () => {
  try {
    await apiClient.post("/auth/logout");
    await removeToken();
    return { success: true };
  } catch (error) {
    await removeToken();
    return { success: false, message: error.message };
  }
};
