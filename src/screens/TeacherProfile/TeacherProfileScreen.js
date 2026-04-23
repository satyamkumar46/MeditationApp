import {
  ActivityIndicator,
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
import { useDispatch, useSelector } from "react-redux";
import { toggleFollowTeacher } from "../../features/slices/userSlice";
import useSounds from "../../hooks/useSounds";
import { followUser } from "../../services/userService";
import { moderateScale, scale, verticalScale } from "../../utility/helpers";

const TeacherProfileScreen = ({ navigation, route }) => {
  const teacher = route?.params?.teacher;
  const { allTracks, loading: tracksLoading } = useSounds();

  const dispatch = useDispatch();

  // Filter tracks that belong to this teacher (by matching teacher name)
  const teacherTracks = allTracks.filter(
    (track) =>
      track.teacher?.name?.toLowerCase() === teacher?.name?.toLowerCase(),
  );

  const followingTeachers = useSelector(
    (state) => state.user.followingTeachers,
  );

  const isFollowing = followingTeachers.includes(teacher?._id);

  const handleFollow = () => {

    const res= await followUser(teacher._id);

    if(res.success){
      dispatch(toggleFollowTeacher(teacher._id));
    }
    
  };

  const stats = [
    { label: "RATING", value: teacher?.rating?.toString() || "N/A" },
    { label: "STUDENTS", value: teacher?.students || "N/A" },
    { label: "SESSIONS", value: teacher?.session || "N/A" },
  ];

  const tags = teacher?.expertise
    ? teacher.expertise.split(",").map((t) => t.trim())
    : ["Meditation"];

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
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Image
            source={
              teacher?.image
                ? { uri: teacher.image }
                : require("../../../assets/images/loader.png")
            }
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
            <View style={styles.headerRight}></View>
          </View>

          {/* Teacher info */}
          <View style={styles.heroContent}>
            <View style={styles.zenBadge}>
              <Text style={styles.zenBadgeText}>
                {tags[0]?.toUpperCase() || "MEDITATION"}
              </Text>
            </View>
            <Text style={styles.teacherName}>
              {teacher?.name || "Unknown Teacher"}
            </Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={moderateScale(16)} color="#FBBF24" />
              <Text style={styles.ratingText}>
                {teacher?.rating || "N/A"} ({teacher?.reviews || "No reviews"})
              </Text>
            </View>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          {stats.map((stat, idx) => (
            <View
              key={stat.label}
              style={[
                styles.statCard,
                idx < stats.length - 1 && { marginRight: scale(8) },
              ]}
            >
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[
              styles.followBtn,
              isFollowing && { backgroundColor: "#20DF60" },
            ]}
            onPress={handleFollow}
          >
            <Ionicons
              name={isFollowing ? "checkmark" : "person-add-outline"}
              size={moderateScale(18)}
              color={isFollowing ? "#112116" : "#20DF60"}
            />
            <Text
              style={[
                styles.followBtnText,
                isFollowing && { color: "#112116" },
              ]}
            >
              {isFollowing ? "Following" : "Follow"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Bio */}
        <View style={styles.bioSection}>
          <Text style={styles.bioTitle}>Expertise & Bio</Text>
          <Text style={styles.bioText}>
            {teacher?.bio || "No bio available for this teacher."}
          </Text>
          <View style={styles.tagsRow}>
            {tags.map((tag) => (
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
          </View>

          {tracksLoading ? (
            <View style={styles.sessionsLoadingContainer}>
              <ActivityIndicator size="small" color="#20DF60" />
              <Text style={styles.sessionsLoadingText}>
                Loading sessions...
              </Text>
            </View>
          ) : teacherTracks.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.sessionsScroll}
            >
              {teacherTracks.map((track) => (
                <TouchableOpacity
                  key={track._id}
                  style={styles.sessionCard}
                  onPress={() => navigation.navigate("Player", { track })}
                >
                  <View style={styles.sessionImageContainer}>
                    <Image
                      source={
                        track.thumbnail
                          ? { uri: track.thumbnail }
                          : require("../../../assets/images/loader.png")
                      }
                      style={styles.sessionImage}
                      resizeMode="cover"
                    />
                    <View style={styles.sessionDurationBadge}>
                      <Text style={styles.sessionDurationText}>
                        {track.duration || "N/A"}
                      </Text>
                    </View>
                    {/* Play overlay icon */}
                    <View style={styles.sessionPlayOverlay}>
                      <View style={styles.sessionPlayCircle}>
                        <Feather
                          name="play"
                          size={moderateScale(14)}
                          color="#112116"
                        />
                      </View>
                    </View>
                  </View>
                  <Text style={styles.sessionTitle} numberOfLines={1}>
                    {track.title}
                  </Text>
                  <View style={styles.sessionMetaRow}>
                    <Text style={styles.sessionMeta} numberOfLines={1}>
                      {track.catname}
                    </Text>
                    <View style={styles.sessionMetaDot} />
                    <Text style={styles.sessionTeacherName} numberOfLines={1}>
                      {teacher?.name || "Unknown"}
                    </Text>
                  </View>
                  <View style={styles.sessionTrackRow}>
                    <Ionicons
                      name="musical-notes-outline"
                      size={moderateScale(12)}
                      color="#20DF6099"
                    />
                    <Text style={styles.sessionTrackLabel}>
                      Track {teacherTracks.indexOf(track) + 1} of{" "}
                      {teacherTracks.length}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            // Fallback: show some allTracks if no teacher-specific match
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.sessionsScroll}
            >
              {allTracks.slice(0, 4).map((track) => (
                <TouchableOpacity
                  key={track._id}
                  style={styles.sessionCard}
                  onPress={() => navigation.navigate("Player", { track })}
                >
                  <View style={styles.sessionImageContainer}>
                    <Image
                      source={
                        track.thumbnail
                          ? { uri: track.thumbnail }
                          : require("../../../assets/images/loader.png")
                      }
                      style={styles.sessionImage}
                      resizeMode="cover"
                    />
                    <View style={styles.sessionDurationBadge}>
                      <Text style={styles.sessionDurationText}>
                        {track.duration || "N/A"}
                      </Text>
                    </View>
                    <View style={styles.sessionPlayOverlay}>
                      <View style={styles.sessionPlayCircle}>
                        <Feather
                          name="play"
                          size={moderateScale(14)}
                          color="#112116"
                        />
                      </View>
                    </View>
                  </View>
                  <Text style={styles.sessionTitle} numberOfLines={1}>
                    {track.title}
                  </Text>
                  <View style={styles.sessionMetaRow}>
                    <Text style={styles.sessionMeta} numberOfLines={1}>
                      {track.catname}
                    </Text>
                    <View style={styles.sessionMetaDot} />
                    <Text style={styles.sessionTeacherName} numberOfLines={1}>
                      {teacher?.name || "Unknown"}
                    </Text>
                  </View>
                  <View style={styles.sessionTrackRow}>
                    <Ionicons
                      name="musical-notes-outline"
                      size={moderateScale(12)}
                      color="#20DF6099"
                    />
                    <Text style={styles.sessionTrackLabel}>
                      Track {allTracks.slice(0, 4).indexOf(track) + 1}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
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
    flex: 1,
  },
  sessionMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: verticalScale(3),
    gap: scale(6),
  },
  sessionMetaDot: {
    width: moderateScale(4),
    height: moderateScale(4),
    borderRadius: moderateScale(2),
    backgroundColor: "#20DF6066",
  },
  sessionTeacherName: {
    color: "#20DF60",
    fontSize: moderateScale(12),
    fontWeight: "600",
    flex: 1,
  },
  sessionTrackRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(4),
    marginTop: verticalScale(4),
  },
  sessionTrackLabel: {
    color: "#20DF6099",
    fontSize: moderateScale(11),
    fontWeight: "500",
  },
  sessionPlayOverlay: {
    position: "absolute",
    bottom: moderateScale(10),
    left: moderateScale(10),
  },
  sessionPlayCircle: {
    width: moderateScale(30),
    height: moderateScale(30),
    borderRadius: moderateScale(15),
    backgroundColor: "#20DF60",
    justifyContent: "center",
    alignItems: "center",
  },
  sessionsLoadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: scale(10),
    paddingVertical: verticalScale(30),
    paddingHorizontal: scale(16),
  },
  sessionsLoadingText: {
    color: "#94A3B8",
    fontSize: moderateScale(13),
    fontWeight: "500",
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
