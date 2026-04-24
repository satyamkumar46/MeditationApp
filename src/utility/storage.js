import * as SecureStore from "expo-secure-store";

export const saveToken = async (token) => {
  return await SecureStore.setItemAsync("token", token);
};

export const getToken = async () => {
  return await SecureStore.getItemAsync("token");
};

export const removeToken = async () => {
  return await SecureStore.deleteItemAsync("token");
};
