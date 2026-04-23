import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Provider, useDispatch } from "react-redux";
import { resetUser, setUser } from "./src/features/slices/userSlice";
import { store } from "./src/features/store/Store";
import StackNavigator from "./src/navigation/StackNavigator";
import { getProfile } from "./src/services/authService";
import { fetchUsersFromApi, fetchUserStats } from "./src/services/userService";
import { getUserFromCache, saveUserToCache } from "./src/utility/cache";
import { getToken } from "./src/utility/storage";

function AppContent() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const initApp = async () => {
      try {
        const token = await getToken();

        if (!token) {
          setSession(false);
          return;
        }

        const CachedUser = await getUserFromCache();
        if (cachedUser) {
          dispatch(setUser(cachedUser));
          setSession(true);
        }

        const [profileRes, statsRes] = await Promise.all([
          getProfile(),
          fetchUserStats(),
        ]);

        if (profileRes?.success && statsRes?.success) {
          const userData = {
            name: profileRes.user.name,
            photo: profileRes.user.photo,
            bio: profileRes.user.bio,
            following: profileRes.user.following,

            streak: statsRes.user.streak,
            session: statsRes.user.session,
            minutes: statsRes.user.minutes,
          };

          dispatch(setUser(userData));
          await saveUserToCache(userData);
          setSession(true);
        } else {
          dispatch(resetUser());
          setSession(false);
        }
      } catch (error) {
        dispatch(resetUser());
        setSession(false);
      } finally {
        setLoading(false);
      }
    };

    initApp();
  }, []);

  useEffect(() => {
    const loadUser = async () => {
      const cachedUser = await getUserFromCache();

      dispatch(setUser(cachedUser));

      const res = await fetchUsersFromApi();

      if (res.success) {
        dispatch(setUser(res.user));
        await saveUserToCache(res.user);
      }
    };

    loadUser();
  }, []);

  useEffect(() => {
    const checkFirstLaunch = async () => {
      const value = await AsyncStorage.getItem("hasLaunched");

      if (value === null) {
        await AsyncStorage.setItem("hasLaunched", "true");
        setIsFirstLaunch(true);
      } else {
        setIsFirstLaunch(false);
      }
    };

    checkFirstLaunch();
  }, []);

  if (session === null) return null;

  return (
    <NavigationContainer>
      <StackNavigator
        session={session}
        setSession={setSession}
        isFirstLaunch={isFirstLaunch}
      />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}
