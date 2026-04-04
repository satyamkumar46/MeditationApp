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
import Ionicons from "react-native-vector-icons/Ionicons";
import { moderateScale, scale, verticalScale } from "../../utility/helpers";

const SLEEP_STORIES = [
  {
    id: 1,
    title: "The Midnight Rain",
    duration: "24 min",
    category: "Soundscape",
    image: require("../../../assets/images/loader.png"),
  },
  {
    id: 2,
    title: "Valley of Echoes",
    duration: "45 min",
    category: "Guided Story",
    image: require("../../../assets/images/loader.png"),
  },
  {
    id: 3,
    title: "Celestial Drift",
    duration: "30 min",
    category: "Ambient Music",
    image: require("../../../assets/images/loader.png"),
  },
];

const SleepScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Section with Background */}
        <View style={styles.heroSection}>
          <Image
            source={require("../../../assets/images/loader.png")}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.heroOverlay} />

          {/* Header over image */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backBtn}
            >
              <Ionicons
                name="arrow-back"
                size={moderateScale(24)}
                color="#F1F5F9"
              />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Sleep</Text>
          </View>

          {/* Hero content */}
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>Deep Sleep</Text>
            <Text style={styles.heroSubtitle}>
              Quiet your mind and prepare for{"\n"}restorative rest in the
              forest sanctuary.
            </Text>
            <TouchableOpacity style={styles.driftBtn}>
              <Text style={styles.driftBtnText}>Drift Away</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Sleep Stories */}
        <View style={styles.storiesSection}>
          <View style={styles.storiesHeader}>
            <Text style={styles.storiesTitle}>Sleep Stories</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {SLEEP_STORIES.map((story) => (
            <TouchableOpacity key={story.id} style={styles.storyCard}>
              <Image source={story.image} style={styles.storyImage} />
              <View style={styles.storyInfo}>
                <Text style={styles.storyTitle}>{story.title}</Text>
                <Text style={styles.storyMeta}>
                  {story.duration} • {story.category}
                </Text>
              </View>
              <TouchableOpacity style={styles.playBtn}>
                <Feather name="play" size={moderateScale(18)} color="#20DF60" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tonight's Goal */}
        <View style={styles.goalCard}>
          <Text style={styles.goalLabel}>TONIGHT'S GOAL</Text>
          <Text style={styles.goalTitle}>Total stillness in 8 minutes</Text>
          <Text style={styles.goalSubtitle}>
            Your sleep consistency is up by 12% this week. Keep the streak
            going.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default SleepScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#112116",
  },
  scrollContent: {
    paddingBottom: verticalScale(40),
  },
  heroSection: {
    height: verticalScale(420),
    position: "relative",
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(17, 33, 22, 0.45)",
  },
  header: {
    position: "absolute",
    top: Platform.OS === "ios" ? verticalScale(55) : verticalScale(40),
    left: scale(16),
    right: scale(16),
    flexDirection: "row",
    alignItems: "center",
    gap: scale(12),
  },
  backBtn: {
    width: moderateScale(36),
    height: moderateScale(36),
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: moderateScale(20),
    fontWeight: "bold",
    color: "#F1F5F9",
  },
  heroContent: {
    position: "absolute",
    bottom: verticalScale(30),
    left: scale(16),
    right: scale(16),
    alignItems: "center",
  },
  heroTitle: {
    fontSize: moderateScale(36),
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    letterSpacing: -1,
  },
  heroSubtitle: {
    fontSize: moderateScale(15),
    color: "#CBD5E1",
    textAlign: "center",
    marginTop: verticalScale(10),
    lineHeight: moderateScale(22),
  },
  driftBtn: {
    marginTop: verticalScale(18),
    backgroundColor: "#20DF60",
    paddingHorizontal: scale(30),
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(25),
  },
  driftBtnText: {
    color: "#112116",
    fontSize: moderateScale(16),
    fontWeight: "bold",
  },
  storiesSection: {
    marginTop: verticalScale(20),
    paddingHorizontal: scale(16),
  },
  storiesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: verticalScale(14),
  },
  storiesTitle: {
    fontSize: moderateScale(20),
    fontWeight: "bold",
    color: "#F1F5F9",
  },
  viewAllText: {
    fontSize: moderateScale(14),
    color: "#20DF60",
    fontWeight: "600",
  },
  storyCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#20DF600D",
    borderRadius: moderateScale(14),
    borderWidth: 1,
    borderColor: "#20DF601A",
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(12),
    marginBottom: verticalScale(10),
  },
  storyImage: {
    width: moderateScale(56),
    height: moderateScale(56),
    borderRadius: moderateScale(12),
  },
  storyInfo: {
    flex: 1,
    marginLeft: scale(14),
  },
  storyTitle: {
    fontSize: moderateScale(16),
    fontWeight: "bold",
    color: "#F1F5F9",
    lineHeight: moderateScale(22),
  },
  storyMeta: {
    fontSize: moderateScale(13),
    color: "#94A3B8",
    marginTop: verticalScale(2),
  },
  playBtn: {
    width: moderateScale(42),
    height: moderateScale(42),
    borderRadius: moderateScale(21),
    backgroundColor: "#20DF601A",
    justifyContent: "center",
    alignItems: "center",
  },
  goalCard: {
    marginHorizontal: scale(16),
    marginTop: verticalScale(24),
    backgroundColor: "#20DF600D",
    borderRadius: moderateScale(14),
    borderWidth: 1,
    borderColor: "#20DF601A",
    paddingVertical: verticalScale(18),
    paddingHorizontal: scale(18),
  },
  goalLabel: {
    fontSize: moderateScale(11),
    color: "#20DF60",
    fontWeight: "bold",
    letterSpacing: 1.2,
    marginBottom: verticalScale(6),
  },
  goalTitle: {
    fontSize: moderateScale(18),
    fontWeight: "bold",
    color: "#F1F5F9",
    lineHeight: moderateScale(24),
  },
  goalSubtitle: {
    fontSize: moderateScale(14),
    color: "#94A3B8",
    marginTop: verticalScale(6),
    lineHeight: moderateScale(20),
  },
});
