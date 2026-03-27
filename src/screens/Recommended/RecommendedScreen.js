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
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { scale, verticalScale, moderateScale } from "../../utility/helpers";

const SESSIONS = [
  {
    id: 1,
    title: "Deep Focus",
    duration: "15 min",
    category: "Deep Work Beats",
    tag: "FOCUS",
    image: require("../../assest/images/morning-calm-image.png"),
  },
  {
    id: 2,
    title: "Ocean Breathing",
    duration: "10 min",
    category: "Breathwork",
    tag: "REST",
    image: require("../../assest/images/mountain-image.png"),
  },
  {
    id: 3,
    title: "Restorative Flow",
    duration: "20 min",
    category: "Mindful Movement",
    tag: "ZEN",
    image: require("../../assest/images/cozy-image.png"),
  },
  {
    id: 4,
    title: "Grounding Roots",
    duration: "8 min",
    category: "Quick Reset",
    tag: "STABILITY",
    image: require("../../assest/images/deep-wood-image.png"),
  },
  {
    id: 5,
    title: "Ethereal Morning",
    duration: "18 min",
    category: "Ambient Journey",
    tag: "SPIRIT",
    image: require("../../assest/images/evening-wind-image.png"),
  },
];

const RecommendedScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#112116" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={moderateScale(24)} color="#20DF60" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Recommended</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Card */}
        <View style={styles.heroCard}>
          <Image
            source={require("../../assest/images/forest-hero.png")}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.heroOverlay} />
          <View style={styles.heroContent}>
            <View style={styles.dailyFocusBadge}>
              <Text style={styles.dailyFocusText}>DAILY FOCUS</Text>
            </View>
            <Text style={styles.heroTitle}>Morning Stillness</Text>
            <Text style={styles.heroSubtitle}>12 min • Guided Meditation</Text>
          </View>
        </View>

        {/* Session List */}
        <View style={styles.sessionList}>
          {SESSIONS.map((session) => (
            <TouchableOpacity key={session.id} style={styles.sessionCard}>
              <Image source={session.image} style={styles.sessionImage} />
              <View style={styles.sessionInfo}>
                <Text style={styles.sessionTitle}>{session.title}</Text>
                <Text style={styles.sessionMeta}>
                  {session.duration} • {session.category}
                </Text>
              </View>
              <View style={styles.sessionRight}>
                <Text style={styles.sessionTag}>{session.tag}</Text>
                <Ionicons
                  name="chevron-forward"
                  size={moderateScale(20)}
                  color="#20DF60"
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default RecommendedScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#112116",
  },
  header: {
    paddingTop: Platform.OS === "ios" ? verticalScale(60) : verticalScale(45),
    paddingHorizontal: scale(16),
    paddingBottom: verticalScale(12),
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
    fontSize: moderateScale(24),
    fontWeight: "bold",
    color: "#20DF60",
  },
  scrollContent: {
    paddingBottom: verticalScale(40),
  },
  heroCard: {
    marginHorizontal: scale(16),
    borderRadius: moderateScale(16),
    overflow: "hidden",
    marginTop: verticalScale(10),
  },
  heroImage: {
    width: "100%",
    height: verticalScale(200),
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(17, 33, 22, 0.35)",
  },
  heroContent: {
    position: "absolute",
    bottom: verticalScale(16),
    left: scale(16),
    right: scale(16),
  },
  dailyFocusBadge: {
    backgroundColor: "#20DF6033",
    borderWidth: 1,
    borderColor: "#20DF6066",
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(4),
    borderRadius: moderateScale(20),
    alignSelf: "flex-start",
    marginBottom: verticalScale(8),
  },
  dailyFocusText: {
    color: "#20DF60",
    fontSize: moderateScale(11),
    fontWeight: "bold",
    letterSpacing: 1.2,
  },
  heroTitle: {
    color: "#FFFFFF",
    fontSize: moderateScale(26),
    fontWeight: "bold",
    letterSpacing: -0.5,
    lineHeight: moderateScale(32),
  },
  heroSubtitle: {
    color: "#CBD5E1",
    fontSize: moderateScale(14),
    marginTop: verticalScale(4),
  },
  sessionList: {
    marginTop: verticalScale(24),
    paddingHorizontal: scale(16),
    gap: verticalScale(6),
  },
  sessionCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: verticalScale(14),
    borderBottomWidth: 1,
    borderBottomColor: "#20DF600D",
  },
  sessionImage: {
    width: moderateScale(56),
    height: moderateScale(56),
    borderRadius: moderateScale(28),
  },
  sessionInfo: {
    flex: 1,
    marginLeft: scale(14),
  },
  sessionTitle: {
    color: "#F1F5F9",
    fontSize: moderateScale(16),
    fontWeight: "bold",
    lineHeight: moderateScale(22),
  },
  sessionMeta: {
    color: "#94A3B8",
    fontSize: moderateScale(13),
    marginTop: verticalScale(2),
  },
  sessionRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(8),
  },
  sessionTag: {
    color: "#20DF60",
    fontSize: moderateScale(12),
    fontWeight: "bold",
    letterSpacing: 1,
  },
});
