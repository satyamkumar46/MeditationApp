import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ExploreScreen from "../screens/Explore/ExploreScreen";
import HomeScreen from "../screens/Home/HomeScreen";
import LibraryScreen from "../screens/Library/LibraryScreen";
import ProfileScreen from "../screens/Profile/ProfileScreen";

const tab = createBottomTabNavigator();

export default function TabNavigator() {
  const insets = useSafeAreaInsets();

  const MARGIN = 16;

  return (
    <tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconname;

          if (route.name === "Home") {
            iconname = "home-outline";
          }

          if (route.name === "Explore") {
            iconname = "compass-outline";
          }

          if (route.name === "Library") {
            iconname = "book-outline";
          }

          if (route.name === "Profile") {
            iconname = "person-outline";
          }
          return <Ionicons name={iconname} size={size} color={color} />;
        },
        tabBarStyle: {
          backgroundColor: "#0b2d1f",
          borderTopWidth: 0,
          position: "absolute",
          left: MARGIN,
          right: MARGIN,
          bottom: Platform.OS === "ios" ? insets.bottom + 10 : 16,
          elevation: 12,
          borderRadius: 32,
          height: 65,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.3,
          shadowRadius: 10,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          marginTop: 1,
          marginBottom: 0,
        },
        tabBarItemStyle: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        },
        tabBarIconStyle: {
          marginTop: 0,
          marginBottom: 0,
        },
        tabBarInactiveTintColor: "#20DF6066",
        tabBarActiveTintColor: "#20DF60",
      })}
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
