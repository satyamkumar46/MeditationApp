import { NavigationContainer } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Provider, useDispatch } from "react-redux";
import {
  resetUser,
  setName,
  setProfileImage,
  setStreakData,
} from "./src/features/slices/userSlice";
import { store } from "./src/features/store/Store";
import StackNavigator from "./src/navigation/StackNavigator";
import { fetchStreak } from "./src/services/streakService";
import { supabase } from "./src/utility/supabase";

function AppContent() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  // Fetch and restore user profile + streak to Redux
  const restoreUserProfile = async (userId) => {
    try {
      // Fetch profile
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (!error && profile) {
        dispatch(setName(profile.name || ""));
        dispatch(setProfileImage(profile.image_url || null));
        console.log("Auto-login: profile restored for", profile.name);
      }

      // Fetch streak data
      const streakData = await fetchStreak();
      dispatch(
        setStreakData({
          streakCount: streakData.streak_count || 0,
          totalSessions: streakData.total_sessions || 0,
          totalMinutes: streakData.total_minutes || 0,
        })
      );
    } catch (err) {
      console.log("Auto-login: failed to restore profile", err.message);
    }
  };

  useEffect(() => {
    checkSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        setSession(newSession);
        if (_event === "SIGNED_OUT") {
          dispatch(resetUser());
        } else if (newSession?.user) {
          await restoreUserProfile(newSession.user.id);
        }
      },
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const checkSession = async () => {
    try {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);

      // If session exists, restore user profile + streak to Redux
      if (data.session?.user) {
        await restoreUserProfile(data.session.user.id);
      }
    } catch (err) {
      console.log("Session check failed:", err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#112116" />
        <ActivityIndicator size="large" color="#20DF60" />
        <Text style={styles.loadingText}>Serenity</Text>
        <Text style={styles.loadingSubText}>Finding your calm...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StackNavigator session={session} />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: "#112116",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  loadingText: {
    color: "#20DF60",
    fontSize: 28,
    fontWeight: "bold",
    letterSpacing: 1,
    marginTop: 16,
  },
  loadingSubText: {
    color: "#94A3B8",
    fontSize: 14,
    fontWeight: "500",
  },
});

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

