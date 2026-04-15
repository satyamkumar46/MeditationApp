import { Ionicons } from "@expo/vector-icons";
import {
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CustomTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          bottom: Platform.OS === "ios" ? insets.bottom + 10 : 16,
        },
      ]}
    >
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;

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

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity key={index} onPress={onPress} style={styles.tab}>
            <Ionicons
              name={iconname}
              size={24}
              color={isFocused ? "#20DF60" : "#20DF6066"}
            />
            <Text
              style={[
                styles.label,
                { color: isFocused ? "#20DF60" : "#20DF6066" },
              ]}
            >
              {route.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 16,
    right: 16,
    height: 65,
    backgroundColor: "#0b2d1f",
    borderRadius: 32,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",

    // Shadow (iOS)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,

    // Elevation (Android)
    elevation: 10,
  },

  tab: {
    flex: 1,
    alignItems: "center",
  },
  label: {
    fontSize: 10,
    marginTop: 2,
  },
});
