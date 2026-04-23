import { fetchUserStats } from "../../services/userService";
import { setUser } from "../slices/userSlice";

export const loadUserStats = () => async (dispatch) => {
  try {
    const res = await fetchUserStats();

    if (res?.success && res.user) {
      dispatch(setUser(res.user));
    }
  } catch (error) {
    console.log("Error loading user stats", err);
  }
};
