import { LinearGradient } from "expo-linear-gradient";
import { useRef, useState } from "react";
import {
  Animated,
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getScreenWidth, scale, verticalScale, moderateScale } from "../../utility/helpers";

const SCREEN_WIDTH = getScreenWidth();

const ONBOARDING_DATA = [
  {
    id: "1",
    headerType: "brand", // Shows "Lumina" header
    image: require("../../assest/images/onboarding-forest.png"),
    imageStyle: "fullWidth",
    title: "Find Your Calm",
    description:
      "Discover a vast library of guided meditations, sleep sounds, and mindfulness exercises tailored to your needs.",
    buttonText: "Next →",
    buttonAction: "next",
  },
  {
    id: "2",
    headerType: "onboarding", // Shows back arrow + "Onboarding"
    image: require("../../assest/images/onboarding-progress.png"),
    imageStyle: "card",
    title: "Track Your Progress",
    description:
      "Stay motivated with personalized streaks, session history, and mindful minutes tracking.",
    buttonText: "Next",
    buttonAction: "next",
  },
  {
    id: "3",
    headerType: "onboarding",
    image: require("../../assest/images/onboarding-personalized.png"),
    imageStyle: "rounded",
    title: "Personalized For You",
    description:
      "Choose topics that matter to you, from stress relief to deep sleep, for a truly custom experience.",
    buttonText: "Get Started",
    buttonAction: "getStarted",
  },
];

const OnboardingScreen = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  const goToNext = () => {
    if (currentIndex < ONBOARDING_DATA.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex - 1,
        animated: true,
      });
    }
  };

  const handleButtonPress = (action) => {
    if (action === "next") {
      goToNext();
    } else if (action === "getStarted") {
      navigation.navigate("Sign In");
    }
  };

  const handleSkip = () => {
    navigation.navigate("Sign In");
  };

  const renderDots = () => (
    <View style={styles.dotsContainer}>
      {ONBOARDING_DATA.map((_, index) => {
        const inputRange = [
          (index - 1) * SCREEN_WIDTH,
          index * SCREEN_WIDTH,
          (index + 1) * SCREEN_WIDTH,
        ];

        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [moderateScale(8), moderateScale(24), moderateScale(8)],
          extrapolate: "clamp",
        });

        const dotOpacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.4, 1, 0.4],
          extrapolate: "clamp",
        });

        return (
          <Animated.View
            key={index}
            style={[
              styles.dot,
              {
                width: dotWidth,
                opacity: dotOpacity,
              },
            ]}
          />
        );
      })}
    </View>
  );

  const renderItem = ({ item, index }) => (
    <View style={styles.slide}>
      {/* Header */}
      {item.headerType === "brand" ? (
        <View style={styles.brandHeader}>
          <View style={styles.brandLogoRow}>
            {/* <Image
              source={require("../../assest/images/SplashScree-Icon.png")}
              style={styles.brandLogoIcon}
              resizeMode="contain"
            />
            <Text style={styles.brandName}>Lumina</Text> */}
          </View>
          <TouchableOpacity onPress={handleSkip}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.onboardingHeader}>
          <TouchableOpacity onPress={goToPrev} style={styles.backBtn}>
            {/* <Ionicons
              name="arrow-back"
              size={moderateScale(22)}
              color="#F1F5F9"
            /> */}
          </TouchableOpacity>
          {/* <Text style={styles.onboardingHeaderTitle}>Onboarding</Text> */}
          <TouchableOpacity onPress={handleSkip}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Image Section */}
      <View style={styles.imageSection}>
        {item.imageStyle === "fullWidth" ? (
          <Image
            source={item.image}
            style={styles.fullWidthImage}
            resizeMode="cover"
          />
        ) : item.imageStyle === "card" ? (
          <View style={styles.cardImageContainer}>
            <Image
              source={item.image}
              style={styles.cardImage}
              resizeMode="contain"
            />
          </View>
        ) : (
          <View style={styles.roundedImageContainer}>
            <Image
              source={item.image}
              style={styles.roundedImage}
              resizeMode="cover"
            />
          </View>
        )}
      </View>

      {/* Dots */}
      {renderDots()}

      {/* Content */}
      <View style={styles.contentSection}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>

      {/* Button */}
      <View style={styles.buttonSection}>
        <TouchableOpacity
          style={styles.mainButton}
          activeOpacity={0.85}
          onPress={() => handleButtonPress(item.buttonAction)}
        >
          <LinearGradient
            colors={["#2aed4a", "#1bc83a", "#15a830"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.mainButtonGradient}
          >
            <Text style={styles.mainButtonText}>{item.buttonText}</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Footer Links */}
        <View style={styles.footerLinks}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Sign In")}>
            <Text style={styles.footerLink}>Log In</Text>
          </TouchableOpacity>
          {index < 2 && (
            <>
              <Text style={styles.footerSeparator}> </Text>
              <Text style={styles.footerText}> </Text>
            </>
          )}
        </View>

        {index === 0 && (
          <View style={styles.footerLinks}>
            <Text style={styles.footerText}>New here? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
              <Text style={styles.footerLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a1a0f" />
      <Animated.FlatList
        ref={flatListRef}
        data={ONBOARDING_DATA}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false },
        )}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        bounces={false}
      />
    </View>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a1a0f",
  },
  slide: {
    width: SCREEN_WIDTH,
    flex: 1,
    backgroundColor: "#0a1a0f",
  },

  // ── Brand Header (Screen 1) ──
  brandHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: Platform.OS === "ios" ? verticalScale(60) : verticalScale(45),
    paddingHorizontal: scale(20),
    paddingBottom: verticalScale(10),
  },
  brandLogoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(8),
  },
  brandLogoIcon: {
    width: moderateScale(28),
    height: moderateScale(28),
    tintColor: "#20DF60",
  },
  brandName: {
    color: "#F1F5F9",
    fontSize: moderateScale(18),
    fontWeight: "bold",
  },
  skipText: {
    color: "#20DF60",
    fontSize: moderateScale(15),
    fontWeight: "600",
  },

  // ── Onboarding Header (Screens 2 & 3) ──
  onboardingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: Platform.OS === "ios" ? verticalScale(60) : verticalScale(45),
    paddingHorizontal: scale(20),
    paddingBottom: verticalScale(10),
  },
  backBtn: {
    width: moderateScale(40),
    height: moderateScale(40),
    justifyContent: "center",
    alignItems: "center",
  },
  onboardingHeaderTitle: {
    color: "#F1F5F9",
    fontSize: moderateScale(18),
    fontWeight: "bold",
  },

  // ── Image Section ──
  imageSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: scale(20),
  },
  fullWidthImage: {
    width: SCREEN_WIDTH - scale(40),
    height: "100%",
    borderRadius: moderateScale(16),
  },
  cardImageContainer: {
    width: SCREEN_WIDTH - scale(60),
    height: verticalScale(280),
    borderRadius: moderateScale(16),
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#20DF6033",
    backgroundColor: "#112116",
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  roundedImageContainer: {
    width: SCREEN_WIDTH - scale(60),
    height: verticalScale(300),
    borderRadius: moderateScale(16),
    overflow: "hidden",
  },
  roundedImage: {
    width: "100%",
    height: "100%",
  },

  // ── Dots ──
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: verticalScale(20),
    gap: scale(6),
  },
  dot: {
    height: moderateScale(8),
    borderRadius: moderateScale(4),
    backgroundColor: "#20DF60",
  },

  // ── Content ──
  contentSection: {
    paddingHorizontal: scale(30),
    alignItems: "center",
  },
  title: {
    color: "#F1F5F9",
    fontSize: moderateScale(26),
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: verticalScale(12),
    fontStyle: "italic",
  },
  description: {
    color: "rgba(150, 200, 160, 0.7)",
    fontSize: moderateScale(14),
    textAlign: "center",
    lineHeight: moderateScale(22),
    letterSpacing: 0.3,
  },

  // ── Button Section ──
  buttonSection: {
    paddingHorizontal: scale(30),
    paddingBottom: verticalScale(30),
    paddingTop: verticalScale(24),
  },
  mainButton: {
    borderRadius: moderateScale(30),
    overflow: "hidden",
    elevation: 6,
    shadowColor: "#1ed760",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  mainButtonGradient: {
    paddingVertical: verticalScale(16),
    borderRadius: moderateScale(30),
    justifyContent: "center",
    alignItems: "center",
  },
  mainButtonText: {
    fontSize: moderateScale(16),
    fontWeight: "700",
    color: "#0a1a0f",
    letterSpacing: 0.5,
  },
  footerLinks: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: verticalScale(14),
  },
  footerText: {
    color: "rgba(150, 200, 160, 0.5)",
    fontSize: moderateScale(13),
  },
  footerLink: {
    color: "#20DF60",
    fontSize: moderateScale(13),
    fontWeight: "bold",
  },
  footerSeparator: {
    color: "rgba(150, 200, 160, 0.5)",
    fontSize: moderateScale(13),
  },
});
