import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useRef } from "react";
import { Animated } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ExploreScreen from "../screens/Explore/ExploreScreen";
import HomeScreen from "../screens/Home/HomeScreen";
import LibraryScreen from "../screens/Library/LibraryScreen";
import ProfileScreen from "../screens/Profile/ProfileScreen";
import CustomTabBar from "./CustomTabBar";

const tab = createBottomTabNavigator();

export default function TabNavigator({ setSession }) {
  const insets = useSafeAreaInsets();

  const MARGIN = 16;

  const scrollY = useRef(new Animated.Value(0)).current;

  return (
    <tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} scrollY={scrollY} />}
      screenOptions={{ headerShown: false }}
    >
      <tab.Screen
        name="Home"
        options={{
          headerShown: false,
        }}
      >
        {(props) => <HomeScreen {...props} scrollY={scrollY} />}
      </tab.Screen>

      <tab.Screen
        name="Explore"
        options={{
          headerShown: false,
        }}
      >
        {(props) => <ExploreScreen {...props} scrollY={scrollY} />}
      </tab.Screen>

      <tab.Screen
        name="Library"
        component={LibraryScreen}
        options={{
          headerShown: false,
        }}
      />

      <tab.Screen
        name="Profile"
        options={{
          headerShown: false,
        }}
      >
        {(props) => <ProfileScreen {...props} setSession={setSession} />}
      </tab.Screen>
    </tab.Navigator>
  );
}
