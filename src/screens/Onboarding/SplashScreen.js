import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef } from "react";
import {
  Animated,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getScreenWidth } from "../../utility/helpers";

const width = getScreenWidth();

const SplashScreen = ({ navigation }) => {
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const ringRotation = useRef(new Animated.Value(0)).current;
  const ringPulse = useRef(new Animated.Value(1)).current;
  const buttonSlide = useRef(new Animated.Value(50)).current;
  const buttonFade = useRef(new Animated.Value(0)).current;
  const iconScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Staggered entrance animations
    Animated.sequence([
      // Image area fades in and scales up
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]),
      // Text slides up
      Animated.parallel([
        Animated.timing(slideUpAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      // Buttons slide up
      Animated.parallel([
        Animated.timing(buttonSlide, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(buttonFade, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      // Icon pops in
      Animated.spring(iconScale, {
        toValue: 1,
        tension: 100,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous ring rotation
    Animated.loop(
      Animated.timing(ringRotation, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
      }),
    ).start();

    // Continuous ring pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(ringPulse, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(ringPulse, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const rotateInterpolation = ringRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a1a0f" />

      {/* Top forest image section with gradient overlay */}
      <View style={styles.topSection}>
        <LinearGradient
          colors={["#0a1a0f", "#0d2614", "#0a1a0f"]}
          style={styles.topGradient}
        >
          {/* Ring wrapper - positions lotus icon relative to the rings */}
          <View style={styles.ringWrapper}>
            {/* Outer glow rings */}
            <Animated.View
              style={[
                styles.outerRing,
                {
                  opacity: fadeAnim,
                  transform: [{ scale: scaleAnim }, { scale: ringPulse }],
                },
              ]}
            >
              {/* Middle ring */}
              <View style={styles.middleRing}>
                {/* Inner ring with dashed effect */}
                <Animated.View
                  style={[
                    styles.dashedRing,
                    {
                      transform: [{ rotate: rotateInterpolation }],
                    },
                  ]}
                >
                  {/* Dashed ring dots */}
                  {Array.from({ length: 60 }).map((_, i) => (
                    <View
                      key={i}
                      style={[
                        styles.ringDot,
                        {
                          transform: [
                            { rotate: `${i * 6}deg` },
                            { translateY: -(width * 0.35) },
                          ],
                          opacity: i % 3 === 0 ? 0.6 : 0.2,
                        },
                      ]}
                    />
                  ))}
                </Animated.View>

                {/* Circular avatar image */}
                <View style={styles.avatarContainer}>
                  <Image
                    source={require("../../assest/images/SplashScreen-avatar.png")}
                    style={styles.avatarImage}
                    resizeMode="cover"
                  />
                </View>
              </View>
            </Animated.View>

            {/* Lotus icon - positioned above the ring at bottom-right */}
            <Animated.View
              style={[
                styles.lotusIconContainer,
                {
                  transform: [{ scale: iconScale }],
                },
              ]}
            >
              <View style={styles.lotusIconCircle}>
                <Image
                  source={require("../../assest/images/SplashScree-Icon.png")}
                  style={styles.lotusIcon}
                  resizeMode="contain"
                />
              </View>
            </Animated.View>
          </View>
        </LinearGradient>
      </View>

      {/* Bottom section with text and buttons */}
      <View style={styles.bottomSection}>
        {/* Title text */}
        <Animated.View
          style={[
            styles.textContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }],
            },
          ]}
        >
          <Text style={styles.titleWhite}>Breathe in,</Text>
          <Text style={styles.titleGreen}>peace out</Text>
          <Text style={styles.subtitle}>
            Your journey to a calmer mind{"\n"}and a lighter soul starts here.
          </Text>
        </Animated.View>

        {/* Buttons */}
        <Animated.View
          style={[
            styles.buttonContainer,
            {
              opacity: buttonFade,
              transform: [{ translateY: buttonSlide }],
            },
          ]}
        >
          {/* Get Started Button */}
          <TouchableOpacity
            style={styles.getStartedButton}
            activeOpacity={0.85}
            onPress={() => navigation.navigate("Onboarding")}
          >
            <LinearGradient
              colors={["#2aed4a", "#1bc83a", "#15a830"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.getStartedGradient}
            >
              <Text style={styles.getStartedText}>Get Started</Text>
              <Text style={styles.arrowIcon}> →</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Log In Button */}
          <TouchableOpacity
            style={styles.logInButton}
            activeOpacity={0.85}
            onPress={() => navigation.navigate("Sign In")}
          >
            <Text style={styles.logInText}>Log In</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a1a0f",
  },
  topSection: {
    flex: 1.1,
    justifyContent: "center",
    alignItems: "center",
  },
  topGradient: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 20,
  },
  outerRing: {
    width: width * 0.78,
    height: width * 0.78,
    borderRadius: width * 0.39,
    borderWidth: 1.5,
    borderColor: "rgba(30, 180, 60, 0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  middleRing: {
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: width * 0.35,
    borderWidth: 1,
    borderColor: "rgba(30, 180, 60, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  dashedRing: {
    position: "absolute",
    width: width * 0.7,
    height: width * 0.7,
    justifyContent: "center",
    alignItems: "center",
  },
  ringDot: {
    position: "absolute",
    width: 2,
    height: 2,
    borderRadius: 1,
    backgroundColor: "#1eb43c",
  },
  ringWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
  avatarContainer: {
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: width * 0.291,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "rgba(30, 180, 60, 0.4)",
    elevation: 10,
    shadowColor: "#1eb43c",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    paddingTop: 25,
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  lotusIconContainer: {
    position: "absolute",
    bottom: 1,
    right: width * 0.05,
    zIndex: 20,
  },
  lotusIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#1ed760",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#1ed760",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  lotusIcon: {
    width: 26,
    height: 26,
    tintColor: "#0a1a0f",
  },
  bottomSection: {
    flex: 0.9,
    paddingHorizontal: 30,
    justifyContent: "space-between",
    paddingBottom: 40,
  },
  textContainer: {
    alignItems: "center",
    marginTop: 10,
  },
  titleWhite: {
    fontSize: 32,
    fontWeight: "800",
    color: "#ffffff",
    letterSpacing: 0.5,
  },
  titleGreen: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1ed760",
    fontStyle: "italic",
    letterSpacing: 0.5,
    marginTop: -2,
  },
  subtitle: {
    fontSize: 15,
    color: "rgba(150, 200, 160, 0.7)",
    textAlign: "center",
    marginTop: 14,
    lineHeight: 22,
    letterSpacing: 0.3,
  },
  buttonContainer: {
    gap: 12,
    marginTop: 20,
  },
  getStartedButton: {
    borderRadius: 30,
    overflow: "hidden",
    elevation: 6,
    shadowColor: "#1ed760",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  getStartedGradient: {
    paddingVertical: 16,
    borderRadius: 30,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  getStartedText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0a1a0f",
    letterSpacing: 0.5,
  },
  arrowIcon: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0a1a0f",
    marginLeft: 2,
  },
  logInButton: {
    paddingVertical: 16,
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
  },
  logInText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#ffffff",
    letterSpacing: 0.5,
  },
});
