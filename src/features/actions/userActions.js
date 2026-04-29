import { getUserFromCache, saveUserToCache } from "../../utility/cache";
import { fetchUsersFromApi, fetchUserStats } from "../../services/userService";
import { setUser } from "../slices/userSlice";

export const loadUserStatsFromCache = () => async (dispatch) => {
  try {
    const cached = await getUserFromCache();
    if (cached) {
      dispatch(setUser(cached));
      return true; // cache hit
    }
    return false; // no cache yet (first launch)
  } catch (error) {
    console.log("Cache read error", error);
    return false;
  }
};

/**
 * Step 2 — fetch fresh data from the API in the background,
 * update Redux and persist to cache so the next load is instant.
 */
export const loadUserStats = () => async (dispatch) => {
  try {
    const [profileRes, statsRes] = await Promise.all([
      fetchUsersFromApi(),
      fetchUserStats(),
    ]);

    const profileUser = profileRes?.data?.user || {};
    const statsUser   = statsRes?.data?.user   || {};

    const merged = {
      name:      profileUser.name,
      photo:     profileUser.photo,
      bio:       profileUser.bio,
      following: profileUser.following,
      streak:  statsUser.streak  ?? profileUser.streak  ?? 0,
      session: statsUser.session ?? profileUser.session ?? 0,
      minutes: statsUser.minutes ?? profileUser.minutes ?? 0,
    };

    if (profileRes?.success) {
      dispatch(setUser(merged));
      // Persist the latest data so next screen-focus loads instantly
      await saveUserToCache(merged);
    }
  } catch (error) {
    console.log("Error loading user stats", error);
  }
};
