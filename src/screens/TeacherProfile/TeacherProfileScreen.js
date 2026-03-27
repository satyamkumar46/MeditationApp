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
import Feather from "react-native-vector-icons/Feather";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { scale, verticalScale, moderateScale } from "../../utility/helpers";

const STATS = [
  { label: "YEARS EXP", value: "15+" },
  { label: "STUDENTS", value: "12k+" },
  { label: "SESSIONS", value: "400+" },
];

const TAGS = ["Zen Meditation", "Mindfulness", "Breathwork"];

const SESSIONS = [
  {
    id: 1,
    title: "Morning Stillness",
    meta: "Guided • Foundational Zen",
    duration: "12 MIN",
    image: require("../../assest/images/forest-hero.png"),
  },
  {
    id: 2,
    title: "Zen Focus",
    meta: "Deep Work • Mental Clarity",
    duration: "18 MIN",
    image: require("../../assest/images/zen-stones.png"),
  },
];

const TeacherProfileScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Image
            source={require("../../assest/images/teacher-hero.png")}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.heroOverlay} />

          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.headerBtn}
            >
              <Ionicons
                name="arrow-back"
                size={moderateScale(22)}
                color="#F1F5F9"
              />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Teacher Profile</Text>
            <View style={styles.headerRight}>
              <TouchableOpacity style={styles.headerBtn}>
                <Feather
                  name="share-2"
                  size={moderateScale(20)}
                  color="#F1F5F9"
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerBtn}>
                <MaterialCommunityIcons
                  name="dots-vertical"
                  size={moderateScale(22)}
                  color="#F1F5F9"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Teacher info */}
          <View style={styles.heroContent}>
            <View style={styles.zenBadge}>
              <Text style={styles.zenBadgeText}>ZEN MASTER</Text>
            </View>
            <Text style={styles.teacherName}>Dr. Aris Thorne</Text>
            <View style={styles.ratingRow}>
              <Ionicons
                name="star"
                size={moderateScale(16)}
                color="#FBBF24"
              />
              <Text style={styles.ratingText}>4.9 (2.4k reviews)</Text>
            </View>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          {STATS.map((stat, idx) => (
            <View
              key={stat.label}
              style={[
                styles.statCard,
                idx < STATS.length - 1 && { marginRight: scale(8) },
              ]}
            >
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.followBtn}>
            <Ionicons
              name="person-add-outline"
              size={moderateScale(18)}
              color="#20DF60"
            />
            <Text style={styles.followBtnText}>Follow</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.messageBtn}>
            <Ionicons
              name="chatbubble-outline"
              size={moderateScale(18)}
              color="#F1F5F9"
            />
            <Text style={styles.messageBtnText}>Message</Text>
          </TouchableOpacity>
        </View>

        {/* Bio */}
        <View style={styles.bioSection}>
          <Text style={styles.bioTitle}>Expertise & Bio</Text>
          <Text style={styles.bioText}>
            Dr. Aris Thorne is a globally recognized pioneer in modern Zen
            mindfulness. With a PhD in Cognitive Psychology and over a decade of
            monastic training, he bridges the gap between ancient Eastern wisdom
            and contemporary neurological science. His sessions focus on
            achieving deep "lucid stillness" amidst the chaos of digital life.
          </Text>
          <View style={styles.tagsRow}>
            {TAGS.map((tag) => (
              <View key={tag} style={styles.tagChip}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Top Sessions */}
        <View style={styles.sessionsSection}>
          <View style={styles.sessionsHeader}>
            <Text style={styles.sessionsTitle}>Top Sessions</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>VIEW ALL</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.sessionsScroll}
          >
            {SESSIONS.map((session) => (
              <TouchableOpacity key={session.id} style={styles.sessionCard}>
                <View style={styles.sessionImageContainer}>
                  <Image
                    source={session.image}
                    style={styles.sessionImage}
                    resizeMode="cover"
                  />
                  <View style={styles.sessionDurationBadge}>
                    <Text style={styles.sessionDurationText}>
                      {session.duration}
                    </Text>
                  </View>
                </View>
                <Text style={styles.sessionTitle}>{session.title}</Text>
                <Text style={styles.sessionMeta}>{session.meta}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Upcoming Live */}
        <View style={styles.liveSection}>
          <Text style={styles.liveTitle}>Upcoming Live</Text>
          <View style={styles.liveCard}>
            <View style={styles.liveDateBox}>
              <Text style={styles.liveDateMonth}>OCT</Text>
              <Text style={styles.liveDateDay}>24</Text>
            </View>
            <View style={styles.liveInfo}>
              <Text style={styles.liveEventTitle}>Full Moon Meditation</Text>
              <Text style={styles.liveEventMeta}>
                Live Session • 8:00 PM EST
              </Text>
              <View style={styles.liveJoinedRow}>
                <View style={styles.liveJoinedDot} />
                <Text style={styles.liveJoinedText}>340 JOINED</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.liveBellBtn}>
              <Ionicons
                name="notifications-outline"
                size={moderateScale(20)}
                color="#F1F5F9"
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default TeacherProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#112116",
  },
  scrollContent: {
    paddingBottom: verticalScale(40),
  },
  heroSection: {
    height: verticalScale(340),
    position: "relative",
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(17, 33, 22, 0.5)",
  },
  header: {
    position: "absolute",
    top: Platform.OS === "ios" ? verticalScale(55) : verticalScale(40),
    left: scale(16),
    right: scale(16),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerBtn: {
    width: moderateScale(36),
    height: moderateScale(36),
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: moderateScale(18),
    fontWeight: "bold",
    color: "#F1F5F9",
  },
  headerRight: {
    flexDirection: "row",
    gap: scale(4),
  },
  heroContent: {
    position: "absolute",
    bottom: verticalScale(20),
    left: scale(16),
    right: scale(16),
  },
  zenBadge: {
    backgroundColor: "#20DF6033",
    borderWidth: 1,
    borderColor: "#20DF6066",
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(4),
    borderRadius: moderateScale(20),
    alignSelf: "flex-start",
    marginBottom: verticalScale(8),
  },
  zenBadgeText: {
    color: "#20DF60",
    fontSize: moderateScale(11),
    fontWeight: "bold",
    letterSpacing: 1.2,
  },
  teacherName: {
    color: "#FFFFFF",
    fontSize: moderateScale(28),
    fontWeight: "bold",
    letterSpacing: -0.5,
    lineHeight: moderateScale(34),
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(6),
    marginTop: verticalScale(6),
  },
  ratingText: {
    color: "#F1F5F9",
    fontSize: moderateScale(14),
    fontWeight: "600",
  },
  statsRow: {
    flexDirection: "row",
    paddingHorizontal: scale(16),
    marginTop: verticalScale(16),
  },
  statCard: {
    flex: 1,
    backgroundColor: "#0D3320",
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: "#20DF6033",
    paddingVertical: verticalScale(14),
    alignItems: "center",
  },
  statValue: {
    color: "#F1F5F9",
    fontSize: moderateScale(20),
    fontWeight: "bold",
  },
  statLabel: {
    color: "#94A3B8",
    fontSize: moderateScale(11),
    fontWeight: "600",
    letterSpacing: 0.5,
    marginTop: verticalScale(4),
  },
  actionRow: {
    flexDirection: "row",
    paddingHorizontal: scale(16),
    marginTop: verticalScale(16),
    gap: scale(10),
  },
  followBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: verticalScale(44),
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: "#20DF6066",
    gap: scale(8),
  },
  followBtnText: {
    color: "#20DF60",
    fontSize: moderateScale(15),
    fontWeight: "bold",
  },
  messageBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: verticalScale(44),
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: "#20DF6033",
    gap: scale(8),
  },
  messageBtnText: {
    color: "#F1F5F9",
    fontSize: moderateScale(15),
    fontWeight: "bold",
  },
  bioSection: {
    paddingHorizontal: scale(16),
    marginTop: verticalScale(24),
  },
  bioTitle: {
    color: "#F1F5F9",
    fontSize: moderateScale(18),
    fontWeight: "bold",
    marginBottom: verticalScale(10),
  },
  bioText: {
    color: "#CBD5E1",
    fontSize: moderateScale(14),
    lineHeight: moderateScale(22),
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: scale(8),
    marginTop: verticalScale(14),
  },
  tagChip: {
    backgroundColor: "#20DF600D",
    borderWidth: 1,
    borderColor: "#20DF6033",
    paddingHorizontal: scale(14),
    paddingVertical: verticalScale(6),
    borderRadius: moderateScale(20),
  },
  tagText: {
    color: "#CBD5E1",
    fontSize: moderateScale(13),
    fontWeight: "500",
  },
  sessionsSection: {
    marginTop: verticalScale(28),
  },
  sessionsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: scale(16),
    marginBottom: verticalScale(14),
  },
  sessionsTitle: {
    color: "#F1F5F9",
    fontSize: moderateScale(18),
    fontWeight: "bold",
  },
  viewAllText: {
    color: "#20DF60",
    fontSize: moderateScale(13),
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  sessionsScroll: {
    paddingLeft: scale(16),
    paddingRight: scale(8),
  },
  sessionCard: {
    width: scale(180),
    marginRight: scale(12),
  },
  sessionImageContainer: {
    width: scale(180),
    height: verticalScale(120),
    borderRadius: moderateScale(14),
    overflow: "hidden",
    position: "relative",
  },
  sessionImage: {
    width: "100%",
    height: "100%",
  },
  sessionDurationBadge: {
    position: "absolute",
    top: moderateScale(10),
    right: moderateScale(10),
    backgroundColor: "#112116CC",
    borderWidth: 1,
    borderColor: "#20DF6066",
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(3),
    borderRadius: moderateScale(8),
  },
  sessionDurationText: {
    color: "#20DF60",
    fontSize: moderateScale(11),
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  sessionTitle: {
    color: "#F1F5F9",
    fontSize: moderateScale(15),
    fontWeight: "bold",
    marginTop: verticalScale(8),
  },
  sessionMeta: {
    color: "#94A3B8",
    fontSize: moderateScale(12),
    marginTop: verticalScale(3),
  },
  liveSection: {
    paddingHorizontal: scale(16),
    marginTop: verticalScale(28),
  },
  liveTitle: {
    color: "#F1F5F9",
    fontSize: moderateScale(18),
    fontWeight: "bold",
    marginBottom: verticalScale(14),
  },
  liveCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#20DF600D",
    borderRadius: moderateScale(14),
    borderWidth: 1,
    borderColor: "#20DF601A",
    paddingVertical: verticalScale(14),
    paddingHorizontal: scale(14),
  },
  liveDateBox: {
    width: moderateScale(52),
    height: moderateScale(52),
    borderRadius: moderateScale(12),
    backgroundColor: "#20DF601A",
    justifyContent: "center",
    alignItems: "center",
  },
  liveDateMonth: {
    color: "#20DF60",
    fontSize: moderateScale(11),
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  liveDateDay: {
    color: "#F1F5F9",
    fontSize: moderateScale(22),
    fontWeight: "bold",
    lineHeight: moderateScale(26),
  },
  liveInfo: {
    flex: 1,
    marginLeft: scale(14),
  },
  liveEventTitle: {
    color: "#F1F5F9",
    fontSize: moderateScale(15),
    fontWeight: "bold",
  },
  liveEventMeta: {
    color: "#94A3B8",
    fontSize: moderateScale(12),
    marginTop: verticalScale(2),
  },
  liveJoinedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(6),
    marginTop: verticalScale(4),
  },
  liveJoinedDot: {
    width: moderateScale(8),
    height: moderateScale(8),
    borderRadius: moderateScale(4),
    backgroundColor: "#20DF60",
  },
  liveJoinedText: {
    color: "#20DF60",
    fontSize: moderateScale(11),
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  liveBellBtn: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: "#20DF601A",
    justifyContent: "center",
    alignItems: "center",
  },
});
