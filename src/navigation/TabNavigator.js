import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ExploreScreen from "../screens/Explore/ExploreScreen";
import HomeScreen from "../screens/Home/HomeScreen";
import LibraryScreen from "../screens/Library/LibraryScreen";
import ProfileScreen from "../screens/Profile/ProfileScreen";
import CustomTabBar from "./CustomTabBar";

const tab = createBottomTabNavigator();

export default function TabNavigator() {
  const insets = useSafeAreaInsets();

  const MARGIN = 16;

  return (
    <tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
        }}
      />

      <tab.Screen
        name="Explore"
        component={ExploreScreen}
        options={{
          headerShown: false,
        }}
      />

      <tab.Screen
        name="Library"
        component={LibraryScreen}
        options={{
          headerShown: false,
        }}
      />

      <tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerShown: false,
        }}
      />
    </tab.Navigator>
  );
}
