import AsyncStorage from "@react-native-async-storage/async-storage";

const USER_CACHE_KEYS = [
  "USER_DATA",
  "TODAY_MINUTES",
  "TODAY_DATE",
  "DAILY_GOAL_MINUTES",
];

export const saveUserToCache = async (user) => {
  try {
    await AsyncStorage.setItem("USER_DATA", JSON.stringify(user));
  } catch (error) {
    console.log("Cache save error", error);
  }
};

export const getUserFromCache = async () => {
  try {
    const data = await AsyncStorage.getItem("USER_DATA"); // fixed: was "DATA"
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.log("Cache read error", error);
    return null;
  }
};

/** Call on logout or new signup to wipe all user-specific local data */
export const clearUserCache = async () => {
  try {
    await AsyncStorage.multiRemove(USER_CACHE_KEYS);
  } catch (error) {
    console.log("Cache clear error", error);
  }
};
