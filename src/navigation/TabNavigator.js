import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ExploreScreen from "../screens/Explore/ExploreScreen";
import HomeScreen from "../screens/Home/HomeScreen";
import LibraryScreen from "../screens/Library/LibraryScreen";
import ProfileScreen from "../screens/Profile/ProfileScreen";

export default function TabNavigator() {
  const tab = createBottomTabNavigator();

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
          backgroundColor: "#112116",
          borderTopColor: "#20DF601A",
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
