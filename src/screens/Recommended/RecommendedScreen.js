import { useState } from "react";
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
import useSounds from "../../hooks/useSounds";
import { moderateScale, scale, verticalScale } from "../../utility/helpers";

const RecommendedScreen = ({ navigation }) => {
  const { allTracks, categories, loading, error } = useSounds();
  const [selectedCategory, setSelectedCategory] = useState("All");

  if (loading) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="#20DF60" />
      </View>
    );
  }

  const categoryList = [
    { _id: "all", catname: "All", tracks: allTracks },
    ...categories,
  ];

  const filteredTracks =
    selectedCategory === "All"
      ? allTracks
      : allTracks.filter((track) => track.catname === selectedCategory);

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
        <Text style={styles.headerTitle}>Recommended</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Card */}
        {allTracks.length > 0 && (
          <TouchableOpacity
            style={styles.heroCard}
            onPress={() =>
              navigation.navigate("Player", { track: allTracks[0] })
            }
          >
            <Image
              source={{ uri: allTracks[0].thumbnail }}
              style={styles.heroImage}
              resizeMode="cover"
            />
            <View style={styles.heroOverlay} />
            <View style={styles.heroContent}>
              <View style={styles.dailyFocusBadge}>
                <Text style={styles.dailyFocusText}>DAILY FOCUS</Text>
              </View>
              <Text style={styles.heroTitle}>{allTracks[0].title}</Text>
              <Text style={styles.heroSubtitle}>
                {allTracks[0].duration} • {allTracks[0].catname}
              </Text>
            </View>
          </TouchableOpacity>
        )}

        {/* Category Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryFilter}
        >
          {categoryList.map((cat) => {
            const isActive = selectedCategory === cat.catname;

            return (
              <TouchableOpacity
                key={cat._id}
                activeOpacity={0.7}
                style={[
                  styles.categoryChip,
                  isActive && styles.activeCategoryChip,
                ]}
                onPress={() => setSelectedCategory(cat.catname)}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    isActive && styles.activeCategoryChipText,
                  ]}
                >
                  {cat.catname}
                </Text>

                <View
                  style={[
                    styles.categoryChipCount,
                    isActive && styles.activeCategoryChipCount,
                  ]}
                >
                  <Text
                    style={[
                      styles.categoryChipCountText,
                      isActive && styles.activeCategoryChipCountText,
                    ]}
                  >
                    {cat.tracks?.length || 0}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Session List */}
        <View style={styles.sessionList}>
          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Failed to load sounds</Text>
            </View>
          ) : (
            filteredTracks.map((track) => (
              <TouchableOpacity
                key={track._id}
                style={styles.sessionCard}
                onPress={() => navigation.navigate("Player", { track })}
              >
                <Image
                  source={{ uri: track.thumbnail }}
                  style={styles.sessionImage}
                />
                <View style={styles.sessionInfo}>
                  <Text style={styles.sessionTitle} numberOfLines={1}>
                    {track.title}
                  </Text>
                  <Text style={styles.sessionMeta}>
                    {track.duration} • {track.catname}
                  </Text>
                  {track.teacher && (
                    <View style={styles.teacherRow}>
                      <Image
                        source={{ uri: track.teacher.image }}
                        style={styles.teacherMiniAvatar}
                      />
                      <Text style={styles.teacherMiniName}>
                        {track.teacher.name}
                      </Text>
                    </View>
                  )}
                </View>
                <View style={styles.sessionRight}>
                  <Text style={styles.sessionTag}>
                    {track.catname?.substring(0, 5).toUpperCase()}
                  </Text>
                  <TouchableOpacity
                    style={styles.playIconBtn}
                    onPress={() => navigation.navigate("Player", { track })}
                  >
                    <Feather
                      name="play"
                      size={moderateScale(16)}
                      color="#20DF60"
                    />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default RecommendedScreen;

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
  categoryFilter: {
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(16),
    gap: scale(8),
  },
  activeCategoryChip: {
    backgroundColor: "#20DF60",
    borderColor: "#20DF60",
  },

  activeCategoryChipText: {
    color: "#112116",
  },

  activeCategoryChipCount: {
    backgroundColor: "#112116",
  },

  activeCategoryChipCountText: {
    color: "#20DF60",
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#20DF600D",
    borderWidth: 1,
    borderColor: "#20DF6033",
    paddingHorizontal: scale(14),
    paddingVertical: verticalScale(8),
    borderRadius: moderateScale(20),
    gap: scale(8),
  },
  categoryChipText: {
    color: "#F1F5F9",
    fontSize: moderateScale(13),
    fontWeight: "500",
  },
  categoryChipCount: {
    backgroundColor: "#20DF601A",
    width: moderateScale(22),
    height: moderateScale(22),
    borderRadius: moderateScale(11),
    justifyContent: "center",
    alignItems: "center",
  },
  categoryChipCountText: {
    color: "#20DF60",
    fontSize: moderateScale(11),
    fontWeight: "bold",
  },
  sessionList: {
    paddingHorizontal: scale(16),
    gap: verticalScale(4),
  },
  errorContainer: {
    paddingVertical: verticalScale(20),
    alignItems: "center",
  },
  errorText: {
    color: "#FF6B6B",
    fontSize: moderateScale(14),
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
    borderRadius: moderateScale(10),
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
  teacherRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(6),
    marginTop: verticalScale(4),
  },
  teacherMiniAvatar: {
    width: moderateScale(18),
    height: moderateScale(18),
    borderRadius: moderateScale(9),
  },
  teacherMiniName: {
    color: "#94A3B8",
    fontSize: moderateScale(11),
    fontWeight: "500",
  },
  sessionRight: {
    alignItems: "center",
    gap: verticalScale(6),
  },
  sessionTag: {
    color: "#20DF60",
    fontSize: moderateScale(10),
    fontWeight: "bold",
    letterSpacing: 1,
  },
  playIconBtn: {
    width: moderateScale(34),
    height: moderateScale(34),
    borderRadius: moderateScale(17),
    backgroundColor: "#20DF601A",
    justifyContent: "center",
    alignItems: "center",
  },
});
