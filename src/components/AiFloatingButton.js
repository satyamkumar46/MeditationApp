import { Feather } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { moderateScale } from "../utility/helpers";

export default function AiFloatingButton({ onPress }) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.outerCircle}>
        <LinearGradient
          colors={["#4FACFE", "#00F2FE"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.innerCircle}
        >
          <Feather name="message-circle" size={20} color="#fff" />
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: moderateScale(170),
    right: moderateScale(20),
    zIndex: 100,
  },
  outerCircle: {
    height: moderateScale(65),
    width: moderateScale(65),
    borderRadius: moderateScale(32),
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },

    elevation: 6,
  },
  innerCircle: {
    height: moderateScale(50),
    width: moderateScale(50),
    borderRadius: moderateScale(25),
    justifyContent: "center",
    alignItems: "center",
  },
});
