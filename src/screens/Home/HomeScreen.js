import {
  Image,
  Platform,
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
import { scale, verticalScale, moderateScale } from "../../utility/helpers";

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#112116" />

      {/* top header */}
      <View style={styles.topHeader}>
        <View style={styles.headerContainer}>
          <Image
            source={require("../../assest/images/face.jpg")}
            style={styles.avatarStyle}
          />
          <View style={styles.textContainer}>
            <Text style={styles.greet}>WELCOME</Text>
            <Text style={styles.greet2}>Good morning,</Text>
            <Text style={styles.nameTxt}>Satyam</Text>
          </View>
          <View style={styles.icons}>
            <TouchableOpacity style={styles.bellIcon}>
              <TouchableOpacity style={styles.bellIconCircle}>
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
        <View></View>

        {/* explore category */}
        <View style={styles.exploreHeader}>
          <Text style={styles.exploreText}>Explore Categories</Text>
        </View>

        <View style={styles.exploreContainer}>
          <View style={styles.firstSecondContainer}>
            <TouchableOpacity style={styles.firstContainer}>
              <Image
                source={require("../../assest/images/profiling.png")}
                style={styles.anxietyImage}
              />
              <Text style={styles.AnxietyText}>Anxiety</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.firstContainer}>
              <Image
                source={require("../../assest/images/person-logo.png")}
                style={styles.anxietyImage}
              />
              <Text style={styles.AnxietyText}>Zen</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.thirdFourthContainer}>
            <TouchableOpacity style={styles.firstContainer}>
              <Feather
                name="heart"
                color="#20DF60"
                size={24}
                style={styles.anxietyImage}
              />
              <Text style={styles.AnxietyText}>Self-Love</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.firstContainer}>
              <Ionicons
                name="cloudy-night-outline"
                color="#20DF60"
                size={24}
                style={styles.anxietyImage}
              />
              <Text style={styles.AnxietyText}>Sleep</Text>
            </TouchableOpacity>
          </View>
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
    height: moderateScale(42),
    width: moderateScale(42),
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
    height: verticalScale(130),
  },
  firstContainer: {
    borderColor: "#20DF600D",
    borderWidth: 1,
    flexDirection: "row",
    height: verticalScale(70),
    width: scale(170),
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
});
