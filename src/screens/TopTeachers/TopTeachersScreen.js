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
import Ionicons from "react-native-vector-icons/Ionicons";
import useTeachers from "../../hooks/useTeachers";
import { moderateScale, scale, verticalScale } from "../../utility/helpers";

const CATEGORIES = [
  "All",
  "Mindfulness",
  "Zen Master",
  "Breathwork",
  "Sleep Expert",
];

const TopTeachersScreen = ({ navigation }) => {
  const { teachers, loading, error } = useTeachers();

  if (loading) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="#20DF60" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#112116" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Ionicons
            name="arrow-back"
            size={moderateScale(24)}
            color="#20DF60"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Top Teachers</Text>
      </View>

      {/* Featured Teacher Hero */}
      {teachers.length > 0 && (
        <View style={styles.heroCard}>
          <Image
            source={{ uri: teachers[0].image }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.heroOverlay} />
          <View style={styles.heroContent}>
            <View style={styles.masterclassBadge}>
              <Text style={styles.masterclassText}>MASTERCLASS</Text>
            </View>
            <Text style={styles.heroName}>{teachers[0].name}</Text>
            <Text style={styles.heroMeta}>
              {teachers[0].expertise} • {teachers[0].session} Sessions
            </Text>
            <View style={styles.heroBottom}>
              <TouchableOpacity
                style={styles.viewProfileBtn}
                onPress={() =>
                  navigation.navigate("TeacherProfile", {
                    teacher: teachers[0],
                  })
                }
              >
                <Text style={styles.viewProfileText}>View Profile</Text>
              </TouchableOpacity>
              <View style={styles.avatarStack}>
                {teachers.slice(1, 3).map((t, idx) => (
                  <View
                    key={t._id}
                    style={[
                      styles.stackAvatar,
                      {
                        zIndex: 3 - idx,
                        marginLeft: idx > 0 ? scale(-10) : 0,
                      },
                    ]}
                  >
                    <Image
                      source={{ uri: t.image }}
                      style={styles.stackAvatarImg}
                    />
                  </View>
                ))}
                <View style={styles.stackCount}>
                  <Text style={styles.stackCountText}>
                    +{teachers.length - 3}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* All Instructors */}
      <View style={styles.instructorsHeader}>
        <Text style={styles.instructorsTitle}>All Instructors</Text>
      </View>

      {/* Categories */}
      <View style={styles.categoriesSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesScroll}
        >
          {CATEGORIES.map((cat, idx) => ( 
            <TouchableOpacity
              key={idx}
              style={[ 
                styles.categoryChip,
                idx === 0 && styles.categoryChipActive,
              ]}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  idx === 0 && styles.categoryChipTextActive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Instructor list */}
        <View style={styles.instructorList}>
          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Failed to load teachers</Text>
            </View>
          ) : (
            teachers.map((teacher) => (
              <TouchableOpacity
                key={teacher._id}
                style={styles.instructorCard}
                onPress={() =>
                  navigation.navigate("TeacherProfile", { teacher })
                }
              >
                <View style={styles.instructorAvatar}>
                  <Image
                    source={{ uri: teacher.image }}
                    style={styles.instructorImg}
                  />
                </View>
                <View style={styles.instructorInfo}>
                  <Text style={styles.instructorName}>{teacher.name}</Text>
                  <Text style={styles.instructorSpecialty}>
                    {teacher.expertise}
                  </Text>
                  <View style={styles.ratingRow}>
                    <Ionicons
                      name="star"
                      size={moderateScale(14)}
                      color="#FBBF24"
                    />
                    <Text style={styles.ratingText}>{teacher.rating}</Text>
                    <Text style={styles.studentsText}>
                      {teacher.students} Students
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.arrowBtn}
                  onPress={() =>
                    navigation.navigate("TeacherProfile", { teacher })
                  }
                >
                  <Ionicons
                    name="chevron-forward"
                    size={moderateScale(20)}
                    color="#20DF60"
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default TopTeachersScreen;

const styles = StyleSheet.create({
  loadingScreen: {
    flex: 1,
    backgroundColor: "#112116",
    justifyContent: "center",
    alignItems: "center",
  },
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
    marginTop: verticalScale(8),
  },
  heroImage: {
    width: "100%",
    height: verticalScale(240),
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(17, 33, 22, 0.4)",
  },
  heroContent: {
    position: "absolute",
    bottom: verticalScale(16),
    left: scale(16),
    right: scale(16),
  },
  masterclassBadge: {
    backgroundColor: "#20DF6033",
    borderWidth: 1,
    borderColor: "#20DF6066",
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(4),
    borderRadius: moderateScale(20),
    alignSelf: "flex-start",
    marginBottom: verticalScale(8),
  },
  masterclassText: {
    color: "#20DF60",
    fontSize: moderateScale(11),
    fontWeight: "bold",
    letterSpacing: 1.2,
  },
  heroName: {
    color: "#FFFFFF",
    fontSize: moderateScale(24),
    fontWeight: "bold",
    letterSpacing: -0.5,
    lineHeight: moderateScale(30),
  },
  heroMeta: {
    color: "#CBD5E1",
    fontSize: moderateScale(14),
    marginTop: verticalScale(2),
  },
  heroBottom: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: verticalScale(12),
    gap: scale(14),
  },
  viewProfileBtn: {
    backgroundColor: "#20DF60",
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(8),
    borderRadius: moderateScale(20),
  },
  viewProfileText: {
    color: "#112116",
    fontSize: moderateScale(14),
    fontWeight: "bold",
  },
  avatarStack: {
    flexDirection: "row",
    alignItems: "center",
  },
  stackAvatar: {
    width: moderateScale(32),
    height: moderateScale(32),
    borderRadius: moderateScale(16),
    borderWidth: 2,
    borderColor: "#112116",
    overflow: "hidden",
  },
  stackAvatarImg: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  stackCount: {
    marginLeft: scale(-6),
    backgroundColor: "#20DF6033",
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(2),
    borderRadius: moderateScale(10),
  },
  stackCountText: {
    color: "#20DF60",
    fontSize: moderateScale(12),
    fontWeight: "bold",
  },
  instructorsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: scale(16),
    marginTop: verticalScale(24),
  },
  instructorsTitle: {
    fontSize: moderateScale(20),
    fontWeight: "bold",
    color: "#F1F5F9",
  },
  instructorList: {
    marginTop: verticalScale(12),
    paddingHorizontal: scale(16),
  },
  errorContainer: {
    paddingVertical: verticalScale(20),
    alignItems: "center",
  },
  errorText: {
    color: "#FF6B6B",
    fontSize: moderateScale(14),
  },
  instructorCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: verticalScale(14),
    borderBottomWidth: 1,
    borderBottomColor: "#20DF600D",
  },
  instructorAvatar: {
    position: "relative",
  },
  instructorImg: {
    width: moderateScale(56),
    height: moderateScale(56),
    borderRadius: moderateScale(28),
  },
  instructorInfo: {
    flex: 1,
    marginLeft: scale(14),
  },
  instructorName: {
    fontSize: moderateScale(16),
    fontWeight: "bold",
    color: "#F1F5F9",
    lineHeight: moderateScale(22),
  },
  instructorSpecialty: {
    fontSize: moderateScale(13),
    color: "#94A3B8",
    marginTop: verticalScale(1),
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(4),
    marginTop: verticalScale(4),
  },
  ratingText: {
    fontSize: moderateScale(13),
    color: "#20DF60",
    fontWeight: "600",
  },
  studentsText: {
    fontSize: moderateScale(12),
    color: "#94A3B8",
    marginLeft: scale(6),
  },
  arrowBtn: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: "#20DF601A",
    justifyContent: "center",
    alignItems: "center",
  },
  categoriesSection: {
    marginTop: verticalScale(28),
    paddingHorizontal: scale(16),
  },
  categoriesTitle: {
    fontSize: moderateScale(13),
    fontWeight: "bold",
    letterSpacing: 1.2,
    color: "#20DF60",
    marginBottom: verticalScale(12),
  },
  categoriesScroll: {
    flexDirection: "row",
  },
  categoryChip: {
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(8),
    borderRadius: moderateScale(20),
    borderWidth: 1,
    borderColor: "#20DF6033",
    backgroundColor: "transparent",
    marginRight: scale(8),
  },
  categoryChipActive: {
    backgroundColor: "#20DF601A",
    borderColor: "#20DF60",
  },
  categoryChipText: {
    fontSize: moderateScale(13),
    color: "#94A3B8",
    fontWeight: "500",
  },
  categoryChipTextActive: {
    color: "#20DF60",
  },
});
