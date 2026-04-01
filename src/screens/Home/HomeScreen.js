import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Platform,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import Fontisto from "react-native-vector-icons/Fontisto";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useSelector } from "react-redux";
import useSounds from "../../hooks/useSounds";
import { moderateScale, scale, verticalScale } from "../../utility/helpers";

const getGreeting = () => {
  const hours = new Date().getHours();

  if (hours < 12) {
    return "Good morning";
  }
  if (hours < 18) return "Good Afternoon";

  return "Good Evening";
};

const CATEGORY_ICONS = {
  Mindfulness: "leaf-outline",
  Relax: "water-outline",
  "Nature Sound": "earth-outline",
  Sleep: "cloudy-night-outline",
  Breathwork: "fitness-outline",
  "Quick Reset": "flash-outline",
  Guided: "compass-outline",
  Ambient: "musical-notes-outline",
  Binaural: "headset-outline",
};

const getCategoryIcon = (catname) => {
  return CATEGORY_ICONS[catname] || "ellipse-outline";
};


const HomeScreen = ({ navigation }) => {
  const [greet, setGreet] = useState(getGreeting());

  const name = useSelector((state) => state.user.name);
  const profileImage = useSelector((state) => state.user.profileImage);
  const { allTracks, categories, loading, refetch } = useSounds();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setGreet(getGreeting());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#112116" />
        <ActivityIndicator size="large" color="#20DF60" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#112116" />

      {/* top header */}
      <View style={styles.topHeader}>
        <View style={styles.headerContainer}>
          <Image
            source={
              profileImage
                ? { uri: profileImage }
                : require("../../assest/images/face.jpg")
            }
            style={styles.avatarStyle}
          />
          <View style={styles.textContainer}>
            <Text style={styles.greet}>WELCOME</Text>
            <Text style={styles.greet2}>{greet},</Text>
            <Text style={styles.nameTxt}>{name}</Text>
          </View>
          <View style={styles.icons}>
            <TouchableOpacity style={styles.bellIcon}>
              <TouchableOpacity
                style={styles.bellIconCircle}
                onPress={() => navigation.navigate("Timer")}
              >
                <MaterialCommunityIcons
                  name="clock-time-four-outline"
                  size={moderateScale(22)}
                  style={styles.iconsStyle}
                />
              </TouchableOpacity>
            </TouchableOpacity>

            <TouchableOpacity style={styles.bellIcon}>
              <View style={styles.bellIconCircle}>
                <Fontisto
                  name="bell"
                  size={moderateScale(21)}
                  style={styles.iconsStyle}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#20DF60"
            colors={["#20DF60"]}
            progressBackgroundColor="#1a3a25"
          />
        }
      >
        {/* feature section */}
        <View style={styles.featuredSection}>
          <Image
            source={require("../../assest/images/Background.png")}
            style={styles.backgroundImage}
            resizeMode="cover"
          />

          <View style={styles.content}>
            <View style={styles.fheadingContainer}>
              <View style={styles.activeBtn}></View>
              <Text style={styles.headingText}>FEATURED SESSION</Text>
            </View>

            <View style={styles.mainHeading}>
              <Text style={styles.mainHeadingText}>Daily Calm</Text>
            </View>
            <View style={styles.mainHeadingSummaryContainer}>
              <Text style={styles.mainHeadingSummary}>
                Start your day with a focused mindfulness practice designed to
                center your thoughts and reduce morning anxiety.
              </Text>
            </View>

            <View style={styles.bottomContainer}>
              <MaterialCommunityIcons
                name="clock-time-four-outline"
                size={moderateScale(22)}
                style={styles.iconsStyle}
              />
              <Text style={styles.time}>10 min</Text>
              <View style={styles.activeBtn}></View>
              <Text style={styles.quote}>Mindfulness</Text>

              <TouchableOpacity style={styles.btnContainer}>
                <View style={styles.btn}>
                  <Feather
                    name="play"
                    size={moderateScale(16)}
                    color={"#112116"}
                  />
                  <Text style={styles.playText}>Play Now</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* quick stats */}
        <View style={styles.quickStatsContainer}>
          <View style={styles.quickStats}>
            <Ionicons name="happy-outline" color="#20DF60" size={24} />
            <Text style={styles.quickStatsText}>How are you feeling?</Text>
          </View>

          <View style={styles.StreakStats}>
            <MaterialCommunityIcons
              name="lightning-bolt-outline"
              color="#20DF60"
              size={24}
            />
            <Text style={styles.quickStatsText}>3 Day Streak</Text>
          </View>
        </View>

        {/* recommended */}
        <View style={styles.recommendedSection}>
          <View style={styles.recommendedHeader}>
            <Text style={styles.recommendedTitle}>Recommended for you</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("Recommended")}
            >
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recommendedScroll}
          >
            {allTracks.slice(0, 5).map((track) => (
              <TouchableOpacity
                key={track._id}
                style={styles.recommendedCard}
                onPress={() => navigation.navigate("Player", { track })}
              >
                <View style={styles.recommendedImageContainer}>
                  <Image
                    source={{ uri: track.thumbnail }}
                    style={styles.recommendedImage}
                    resizeMode="cover"
                  />
                  <View style={styles.recommendedBadge}>
                    <Text style={styles.recommendedBadgeText}>
                      {track.catname?.toUpperCase()}
                    </Text>
                  </View>
                </View>
                <Text style={styles.recommendedCardTitle} numberOfLines={1}>
                  {track.title}
                </Text>
                <View style={styles.recommendedMeta}>
                  <MaterialCommunityIcons
                    name="clock-time-four-outline"
                    size={moderateScale(14)}
                    color="#20DF6099"
                  />
                  <Text style={styles.recommendedDuration}>
                    {track.duration}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* explore category */}
        <View style={styles.exploreHeader}>
          <Text style={styles.exploreText}>Explore Categories</Text>
        </View>

        <View style={styles.exploreContainer}>
          {categories
            .reduce((rows, category, idx) => {
              if (idx % 2 === 0) {
                rows.push([category]);
              } else {
                rows[rows.length - 1].push(category);
              }
              return rows;
            }, [])
            .map((row, rowIdx) => (
              <View
                key={rowIdx}
                style={
                  rowIdx === 0
                    ? styles.firstSecondContainer
                    : styles.thirdFourthContainer
                }
              >
                {row.map((category) => (
                  <TouchableOpacity
                    key={category._id}
                    style={styles.firstContainer}
                    onPress={() =>
                      navigation.navigate("CategoryDetail", {
                        category: category.catname,
                        categoryData: category,
                      })
                    }
                  >
                    <Ionicons
                      name={getCategoryIcon(category.catname)}
                      color="#20DF60"
                      size={24}
                      style={styles.anxietyImage}
                    />
                    <Text style={styles.AnxietyText}>{category.catname}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#112116",
  },
  topHeader: {
    paddingTop: Platform.OS === "ios" ? verticalScale(60) : verticalScale(60),
    paddingHorizontal: scale(20),
    paddingBottom: verticalScale(15),
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
    paddingLeft: scale(12),
  },
  avatarStyle: {
    height: moderateScale(50),
    width: moderateScale(50),
    borderRadius: moderateScale(21),
  },
  greet: {
    color: "#20DF60B3",
    fontSize: moderateScale(13),
    fontWeight: "500",
    letterSpacing: 0.6,
    lineHeight: moderateScale(16),
  },
  greet2: {
    color: "#F1F5F9",
    fontWeight: "bold",
    fontSize: moderateScale(18),
    lineHeight: moderateScale(24),
  },
  nameTxt: {
    color: "#F1F5F9",
    fontWeight: "bold",
    fontSize: moderateScale(18),
    lineHeight: moderateScale(24),
  },
  icons: {
    flexDirection: "row",
    gap: scale(10),
  },
  iconsStyle: {
    color: "#20DF60",
  },
  bellIcon: {
    justifyContent: "center",
    alignItems: "center",
  },
  bellIconCircle: {
    height: moderateScale(46),
    width: moderateScale(46),
    borderRadius: moderateScale(23),
    backgroundColor: "#20DF6026",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    paddingBottom: verticalScale(30),
  },
  featuredSection: {
    marginHorizontal: scale(16),
    borderColor: "#20DF6099",
    borderWidth: 1,
    borderRadius: moderateScale(10),
    overflow: "hidden",
  },
  backgroundImage: {
    width: "100%",
    height: verticalScale(200),
  },
  content: {
    paddingHorizontal: scale(15),
    paddingTop: verticalScale(12),
    paddingBottom: verticalScale(15),
  },
  fheadingContainer: {
    flexDirection: "row",
    gap: scale(8),
    alignItems: "center",
    marginBottom: verticalScale(6),
  },
  activeBtn: {
    backgroundColor: "#20DF60",
    height: moderateScale(8),
    width: moderateScale(8),
    borderRadius: moderateScale(4),
  },
  headingText: {
    fontSize: moderateScale(11),
    fontWeight: "bold",
    letterSpacing: 1.2,
    color: "#20DF60",
  },
  mainHeading: {
    marginBottom: verticalScale(4),
  },
  mainHeadingText: {
    fontWeight: "bold",
    fontSize: moderateScale(22),
    letterSpacing: -0.6,
    lineHeight: moderateScale(28),
    color: "#FFFFFF",
  },
  mainHeadingSummaryContainer: {
    marginBottom: verticalScale(10),
  },
  mainHeadingSummary: {
    color: "#CBD5E1",
    fontSize: moderateScale(14),
    lineHeight: moderateScale(21),
  },
  bottomContainer: {
    flexDirection: "row",
    gap: scale(8),
    alignItems: "center",
    flexWrap: "wrap",
  },
  time: {
    color: "#20DF60",
    fontSize: moderateScale(13),
  },
  quote: {
    color: "#20DF60",
    fontSize: moderateScale(13),
  },
  btnContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  btn: {
    height: moderateScale(38),
    paddingHorizontal: scale(16),
    backgroundColor: "#20DF60",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: moderateScale(25),
    gap: scale(6),
  },
  playText: {
    color: "#112116",
    fontSize: moderateScale(14),
    fontWeight: "bold",
  },
  quickStatsContainer: {
    marginHorizontal: scale(16),
    height: verticalScale(70),
    paddingTop: verticalScale(20),
    flexDirection: "row",
    gap: scale(10),
  },
  quickStats: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#20DF604D",
    borderRadius: moderateScale(25),
    width: scale(200),
    paddingHorizontal: scale(15),
    gap: scale(10),
  },
  quickStatsText: {
    color: "#F1F5F9",
    fontWeight: "medium",
    fontSize: moderateScale(13),
  },
  StreakStats: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#20DF604D",
    borderRadius: moderateScale(25),
    paddingHorizontal: scale(15),
    gap: scale(10),
  },
  recommendedSection: {
    marginTop: verticalScale(20),
    paddingBottom: verticalScale(5),
  },
  recommendedHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: scale(16),
    marginBottom: verticalScale(14),
  },
  recommendedTitle: {
    fontSize: moderateScale(20),
    fontWeight: "bold",
    color: "#F1F5F9",
    letterSpacing: 0.3,
  },
  seeAllText: {
    fontSize: moderateScale(14),
    color: "#20DF60",
    fontWeight: "600",
  },
  recommendedScroll: {
    paddingLeft: scale(16),
    paddingRight: scale(8),
  },
  recommendedCard: {
    width: scale(155),
    marginRight: scale(12),
  },
  recommendedImageContainer: {
    width: scale(155),
    height: verticalScale(140),
    borderRadius: moderateScale(14),
    overflow: "hidden",
    position: "relative",
  },
  recommendedImage: {
    width: "100%",
    height: "100%",
  },
  recommendedBadge: {
    position: "absolute",
    bottom: moderateScale(8),
    left: moderateScale(8),
    backgroundColor: "#112116CC",
    borderWidth: 1,
    borderColor: "#20DF6066",
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(3),
    borderRadius: moderateScale(6),
  },
  recommendedBadgeText: {
    color: "#20DF60",
    fontSize: moderateScale(10),
    fontWeight: "bold",
    letterSpacing: 1,
  },
  recommendedCardTitle: {
    color: "#F1F5F9",
    fontSize: moderateScale(15),
    fontWeight: "bold",
    marginTop: verticalScale(8),
  },
  recommendedMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(4),
    marginTop: verticalScale(4),
  },
  recommendedDuration: {
    color: "#20DF6099",
    fontSize: moderateScale(12),
  },
  exploreHeader: {
    marginHorizontal: scale(16),
    paddingTop: verticalScale(20),
    height: verticalScale(60),
  },
  exploreText: {
    fontSize: moderateScale(20),
    letterSpacing: 0.45,
    color: "#fff",
    fontWeight: "bold",
  },
  exploreContainer: {
    marginHorizontal: scale(16),
    paddingBottom: verticalScale(20),
  },
  firstContainer: {
    borderColor: "#20DF600D",
    borderWidth: 1,
    flexDirection: "row",
    height: verticalScale(70),
    flex: 1,
    borderRadius: moderateScale(12),
    backgroundColor: "#064E3B1A",
    alignItems: "center",
    gap: moderateScale(30),
  },
  anxietyImage: {
    height: verticalScale(25),
    width: scale(25),
    left: scale(20),
  },
  AnxietyText: {
    color: "#F1F5F9",
    fontWeight: "bold",
    fontSize: moderateScale(18),
  },
  firstSecondContainer: {
    flexDirection: "row",
    gap: scale(10),
  },
  thirdFourthContainer: {
    flexDirection: "row",
    gap: scale(10),
    paddingTop: verticalScale(10),
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#112116",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#20DF60",
    fontSize: moderateScale(14),
    fontWeight: "600",
    marginTop: verticalScale(12),
    letterSpacing: 0.5,
  },
});
