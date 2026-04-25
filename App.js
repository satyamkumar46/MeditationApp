import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider, useDispatch } from "react-redux";
import { resetUser, setUser } from "./src/features/slices/userSlice";
import { store } from "./src/features/store/Store";
import StackNavigator from "./src/navigation/StackNavigator";
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
        console.log("TOKEN:", token);

        if (!token) {
          setSession(false);
          setLoading(false);
          return;
        }

        const CachedUser = await getUserFromCache();
        if (CachedUser) {
          dispatch(setUser(CachedUser));
          setSession(true);
        }

        const [profileRes, statsRes] = await Promise.all([
          fetchUsersFromApi(),
          fetchUserStats(),
        ]);

        console.log("PROFILE RES:", profileRes);
        console.log("STATS RES:", statsRes);

        if (profileRes?.success && profileRes?.data?.user) {
          const profileUser = profileRes.data.user;
          const statsUser = statsRes?.data?.user || {};

          const userData = {
            name: profileUser.name,
            photo: profileUser.photo,
            bio: profileUser.bio,
            following: profileUser.following,
            streak: statsUser.streak ?? profileUser.streak ?? 0,
            session: statsUser.session ?? profileUser.session ?? 0,
            minutes: statsUser.minutes ?? profileUser.minutes ?? 0,
          };

          dispatch(setUser(userData));
          console.log("FINAL USER DATA:", userData);
          await saveUserToCache(userData);
          setSession(true);
        } else {
          console.log("API failed, but keeping user logged in");
          // Keep session alive if cached user was already loaded
        }
      } catch (error) {
        dispatch(resetUser());
      } finally {
        setLoading(false);
      }
    };

    initApp();
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

  if (loading) return null;

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StackNavigator
          session={session}
          setSession={setSession}
          isFirstLaunch={isFirstLaunch}
        />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}
