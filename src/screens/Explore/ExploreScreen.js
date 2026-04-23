import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";
import useSounds from "../../hooks/useSounds";
import useTeachers from "../../hooks/useTeachers";
import { moderateScale, scale, verticalScale } from "../../utility/helpers";

const ExploreScreen = ({ navigation }) => {
  const {
    teachers,
    loading: teachersLoading,
    error,
    refetch: refetchTeachers,
  } = useTeachers();
  const {
    allTracks,
    categories,
    loading: soundsLoading,
    refetch: refetchSounds,
  } = useSounds();
  const [activeTeacherId, setActiveTeacherId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const loading = teachersLoading || soundsLoading;

  const handleTeacherPress = (teacherId) => {
    setActiveTeacherId(teacherId);
    const teacher = teachers.find((t) => t._id === teacherId);
    navigation.navigate("TeacherProfile", { teacher });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchTeachers?.(), refetchSounds?.()]);
    setRefreshing(false);
  };

  // ========== SEARCH FILTERING ==========
  const query = searchQuery.trim().toLowerCase();
  const isSearching = query.length > 0;

  const filteredTracks = useMemo(() => {
    if (!isSearching) return [];
    return allTracks.filter(
      (t) =>
        t.title?.toLowerCase().includes(query) ||
        t.catname?.toLowerCase().includes(query) ||
        t.teacher?.name?.toLowerCase().includes(query),
    );
  }, [query, allTracks]);

  const filteredTeachers = useMemo(() => {
    if (!isSearching) return [];
    return teachers.filter((t) => t.name?.toLowerCase().includes(query));
  }, [query, teachers]);

  const filteredCategories = useMemo(() => {
    if (!isSearching) return [];
    return categories.filter((c) => c.catname?.toLowerCase().includes(query));
  }, [query, categories]);

  const hasResults =
    filteredTracks.length > 0 ||
    filteredTeachers.length > 0 ||
    filteredCategories.length > 0;

  if (loading) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="#20DF60" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* header section */}
      <View style={styles.headerContainer}>
        {/* header text */}
        <View style={styles.headerTextContainer}>
          <View style={styles.headerTextContainerSecond}>
            <Text style={styles.headerText}>Explore</Text>
          </View>
        </View>

        {/* search bar */}
        <View style={styles.searchBarContainer}>
          {/* icon */}
          <View style={styles.searchIconContainer}>
            <Ionicons name="search-sharp" color="#94A3B8" size={24} />
          </View>
          <TextInput
            placeholder="Search meditations, music, teachers"
            style={[
              styles.searchPlaceholder,
              { color: isSearching ? "#F1F5F9" : "#20DF6066" },
            ]}
            placeholderTextColor={"#20DF6066"}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            autoCorrect={false}
          />
          {isSearching && (
            <TouchableOpacity
              style={styles.clearSearchBtn}
              onPress={() => setSearchQuery("")}
            >
              <Ionicons name="close-circle" size={20} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* content section */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.contentSection}
        keyboardShouldPersistTaps="handled"
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
        {/* ========== SEARCH RESULTS ========== */}
        {isSearching ? (
          <View style={styles.searchResultsContainer}>
            {!hasResults ? (
              <View style={styles.noResultsContainer}>
                <Ionicons
                  name="search-outline"
                  size={moderateScale(48)}
                  color="#20DF6033"
                />
                <Text style={styles.noResultsTitle}>No results found</Text>
                <Text style={styles.noResultsSubtitle}>
                  Try a different search term
                </Text>
              </View>
            ) : (
              <>
                {/* Matching Teachers */}
                {filteredTeachers.length > 0 && (
                  <View style={styles.searchSection}>
                    <Text style={styles.searchSectionTitle}>
                      TEACHERS ({filteredTeachers.length})
                    </Text>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={{ gap: scale(12) }}
                    >
                      {filteredTeachers.map((teacher) => (
                        <Pressable
                          key={teacher._id}
                          style={styles.searchTeacherCard}
                          onPress={() => handleTeacherPress(teacher._id)}
                        >
                          <Image
                            source={{ uri: teacher.image }}
                            style={styles.searchTeacherImage}
                          />
                          <Text
                            style={styles.searchTeacherName}
                            numberOfLines={1}
                          >
                            {teacher.name}
                          </Text>
                        </Pressable>
                      ))}
                    </ScrollView>
                  </View>
                )}

                {/* Matching Categories */}
                {filteredCategories.length > 0 && (
                  <View style={styles.searchSection}>
                    <Text style={styles.searchSectionTitle}>
                      COLLECTIONS ({filteredCategories.length})
                    </Text>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={{ gap: scale(10) }}
                    >
                      {filteredCategories.map((cat) => (
                        <TouchableOpacity
                          key={cat._id}
                          style={styles.searchCategoryCard}
                          onPress={() =>
                            navigation.navigate("CategoryDetail", {
                              category: cat.catname,
                              categoryData: cat,
                            })
                          }
                        >
                          <Image
                            source={
                              cat.tracks?.[0]?.thumbnail
                                ? { uri: cat.tracks[0].thumbnail }
                                : require("../../../assets/images/loader.png")
                            }
                            style={styles.searchCategoryImage}
                          />
                          <View style={styles.searchCategoryOverlay} />
                          <Text style={styles.searchCategoryName}>
                            {cat.catname}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}

                {/* Matching Tracks */}
                {filteredTracks.length > 0 && (
                  <View style={styles.searchSection}>
                    <Text style={styles.searchSectionTitle}>
                      MEDITATIONS & MUSIC ({filteredTracks.length})
                    </Text>
                    {filteredTracks.map((track) => (
                      <TouchableOpacity
                        key={track._id}
                        style={styles.songContainer}
                        onPress={() => navigation.navigate("Player", { track })}
                      >
                        <View style={styles.songInsideContainer}>
                          <View style={styles.songInsideSecondContainer}>
                            <View style={styles.songOneImgContainer}>
                              <Image
                                source={{ uri: track.thumbnail }}
                                style={styles.songOneImg}
                              />
                            </View>
                            <View style={styles.arrivalInsideTextContainer}>
                              <View style={styles.mindMorningContainer}>
                                <Text
                                  style={styles.mindMorningText}
                                  numberOfLines={1}
                                >
                                  {track.title}
                                </Text>
                              </View>
                              <View style={styles.timerContainer}>
                                <Text style={styles.time}>
                                  {track.duration}
                                </Text>
                                <View style={styles.activebtn} />
                                <Text style={styles.guide}>
                                  {track.catname}
                                </Text>
                              </View>
                            </View>
                            <View style={styles.songPlayBtnContainer}>
                              <View style={styles.songCirclePtrn}>
                                <Feather
                                  name="play"
                                  color="#20DF60"
                                  size={24}
                                />
                              </View>
                            </View>
                          </View>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </>
            )}
          </View>
        ) : (
          <>
            {/* collection search */}
            <View style={styles.collectionSearchContainer}>
              {/* popular collection */}
              <View style={styles.popularCategoryContainer}>
                <View style={styles.popularCategoryTextContainer}>
                  <Text style={styles.popularCategoryText}>
                    Popular Collections
                  </Text>
                </View>
                <Pressable
                  style={styles.popularCategorySeeTextContainer}
                  onPress={() => navigation.navigate("Collection")}
                >
                  <Text style={styles.popularCategorySeeText}>See all</Text>
                </Pressable>
              </View>

              {/* card */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.cardContainer}
              >
                {categories.slice(0, 4).map((cat) => (
                  <TouchableOpacity
                    key={cat._id}
                    style={styles.cardOneContainer}
                    onPress={() =>
                      navigation.navigate("CategoryDetail", {
                        category: cat.catname,
                        categoryData: cat,
                      })
                    }
                  >
                    <Image
                      source={
                        cat.tracks?.[0]?.thumbnail
                          ? { uri: cat.tracks[0].thumbnail }
                          : require("../../../assets/images/loader.png")
                      }
                      style={styles.ContainerImage}
                    />
                    <View style={styles.cardOverlay} />
                    <View style={styles.cardTextContainer}>
                      <Text style={styles.cardText}>{cat.catname}</Text>
                      <Text style={styles.cardTrackCount}>
                        {cat.tracks?.length || 0} tracks
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* top teachers */}
              <View style={styles.topTeachersContainer}>
                {/* teacher heading */}
                <View style={styles.teacherHeaderContainer}>
                  <View style={styles.topTeachersTextContainer}>
                    <Text style={styles.topTeachersText}>Top Teachers</Text>
                  </View>

                  <Pressable
                    style={styles.teacherViewAllContainer}
                    onPress={() => navigation.navigate("TopTeachers")}
                  >
                    <Text style={styles.teacherViewAllText}>View all</Text>
                  </Pressable>
                </View>

                {/* teachers */}
                <ScrollView
                  showsHorizontalScrollIndicator={false}
                  horizontal={true}
                  style={styles.teachersContainer}
                >
                  {error ? (
                    <View style={styles.teacherLoadingContainer}>
                      <Text style={styles.teacherErrorText}>
                        Failed to load teachers
                      </Text>
                    </View>
                  ) : (
                    teachers.slice(0, 5).map((teacher) => {
                      const isActive = activeTeacherId === teacher._id;
                      return (
                        <Pressable
                          key={teacher._id}
                          style={styles.teacherFrame}
                          onPress={() => handleTeacherPress(teacher._id)}
                        >
                          <View
                            style={[
                              styles.teacherCircle,
                              isActive && styles.teacherCircleActive,
                            ]}
                          >
                            <View style={styles.teacherImageWrapper}>
                              <Image
                                source={{ uri: teacher.image }}
                                style={styles.teacherImage}
                              />
                            </View>
                          </View>

                          <View style={styles.teacherNameContainer}>
                            <Text style={styles.teacherName} numberOfLines={1}>
                              {teacher.name}
                            </Text>
                          </View>
                        </Pressable>
                      );
                    })
                  )}
                </ScrollView>
              </View>
            </View>

            {/* new arrival */}
            <View style={styles.newArrivalContainer}>
              {/* text */}
              <View style={styles.newArrivalTextContainer}>
                <Text style={styles.newArrivalText}>New Arrival</Text>
              </View>

              {allTracks.slice(0, 5).map((track) => (
                <TouchableOpacity
                  key={track._id}
                  style={styles.songContainer}
                  onPress={() => navigation.navigate("Player", { track })}
                >
                  <View style={styles.songInsideContainer}>
                    <View style={styles.songInsideSecondContainer}>
                      <View style={styles.songOneImgContainer}>
                        <Image
                          source={{ uri: track.thumbnail }}
                          style={styles.songOneImg}
                        />
                      </View>

                      <View style={styles.arrivalInsideTextContainer}>
                        <View style={styles.mindMorningContainer}>
                          <Text
                            style={styles.mindMorningText}
                            numberOfLines={1}
                          >
                            {track.title}
                          </Text>
                        </View>

                        <View style={styles.timerContainer}>
                          <Text style={styles.time}>{track.duration}</Text>
                          <View style={styles.activebtn} />
                          <Text style={styles.guide}>{track.catname}</Text>
                        </View>
                      </View>

                      <View style={styles.songPlayBtnContainer}>
                        <View style={styles.songCirclePtrn}>
                          <Feather name="play" color="#20DF60" size={24} />
                        </View>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default ExploreScreen;

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
  headerContainer: {
    marginTop: verticalScale(35),
    paddingTop: verticalScale(30),
    paddingBottom: verticalScale(10),
  },
  headerTextContainer: {
    marginHorizontal: scale(16),
    flexDirection: "row",
    justifyContent: "space-between",
    height: verticalScale(40),
  },
  headerTextContainerSecond: {
    width: scale(110),
    justifyContent: "center",
  },
  headerText: {
    fontSize: moderateScale(27),
    fontWeight: "bold",
    color: "#F1F5F9",
  },
  headerBellIconContainer: {
    width: scale(35),
    alignItems: "center",
    justifyContent: "center",
  },
  searchBarContainer: {
    marginHorizontal: scale(16),
    marginTop: verticalScale(15),
    height: verticalScale(40),
    backgroundColor: "#20DF601A",
    borderRadius: moderateScale(12),
    flexDirection: "row",
  },
  searchIconContainer: {
    width: scale(35),
    justifyContent: "center",
    marginLeft: scale(10),
  },
  searchPlaceholder: {
    fontSize: moderateScale(14),
    flex: 1,
  },
  contentSection: {
    flex: 1,
  },
  popularCategoryContainer: {
    marginTop: verticalScale(15),
    flexDirection: "row",
    marginHorizontal: scale(16),
    height: verticalScale(50),
    alignItems: "center",
    justifyContent: "space-between",
  },
  popularCategoryTextContainer: {
    width: scale(250),
    height: verticalScale(40),
    justifyContent: "center",
  },
  popularCategoryText: {
    color: "#F1F5F9",
    fontSize: moderateScale(22),
    fontWeight: "bold",
  },
  popularCategorySeeTextContainer: {
    height: verticalScale(40),
    paddingLeft: scale(20),
    justifyContent: "center",
  },
  popularCategorySeeText: {
    color: "#20DF60",
    fontSize: moderateScale(15),
    fontWeight: "medium",
  },
  cardContainer: {
    marginHorizontal: scale(16),
    marginTop: verticalScale(15),
    height: verticalScale(115),
    flexDirection: "row",
    gap: moderateScale(15),
  },
  cardOneContainer: {
    height: verticalScale(115),
    width: scale(170),
    borderRadius: moderateScale(12),
    overflow: "hidden",
  },
  ContainerImage: {
    width: scale(170),
    height: verticalScale(115),
    resizeMode: "cover",
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    borderRadius: moderateScale(12),
  },
  cardTextContainer: {
    position: "absolute",
    bottom: moderateScale(10),
    left: moderateScale(12),
    right: moderateScale(12),
  },
  cardText: {
    color: "#F1F5F9",
    fontSize: moderateScale(15),
    fontWeight: "bold",
  },
  cardTrackCount: {
    color: "#20DF60",
    fontSize: moderateScale(11),
    fontWeight: "600",
    marginTop: verticalScale(2),
  },
  topTeachersContainer: {
    marginTop: verticalScale(30),
    marginHorizontal: scale(16),
    height: verticalScale(200),
  },
  teacherHeaderContainer: {
    flexDirection: "row",
    height: verticalScale(35),
    justifyContent: "space-between",
  },
  topTeachersTextContainer: {
    width: scale(150),
    justifyContent: "center",
  },
  topTeachersText: {
    color: "#F1F5F9",
    fontWeight: "bold",
    fontSize: moderateScale(22),
  },
  teacherViewAllContainer: {
    justifyContent: "center",
    paddingLeft: scale(10),
  },
  teacherViewAllText: {
    color: "#20DF60",
    fontSize: moderateScale(15),
    fontWeight: "medium",
  },
  teachersContainer: {
    height: verticalScale(113),
    marginHorizontal: scale(-16),
    marginTop: verticalScale(10),
  },
  teacherLoadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: scale(350),
    height: verticalScale(100),
  },
  teacherErrorText: {
    color: "#FF6B6B",
    fontSize: moderateScale(13),
  },
  teacherFrame: {
    height: verticalScale(110),
    width: scale(90),
    marginHorizontal: scale(15),
    alignItems: "center",
  },
  teacherCircle: {
    height: verticalScale(80),
    width: scale(80),
    borderRadius: moderateScale(55),
    borderWidth: 3,
    borderColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  teacherCircleActive: {
    borderColor: "#20DF60",
  },
  teacherImageWrapper: {
    height: verticalScale(80),
    width: scale(80),
    borderRadius: moderateScale(50),
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  teacherImage: {
    height: verticalScale(80),
    width: scale(80),
    resizeMode: "cover",
  },
  teacherNameContainer: {
    marginTop: verticalScale(12),
    height: verticalScale(30),
    alignItems: "center",
  },
  teacherName: {
    fontSize: moderateScale(18),
    fontWeight: "medium",
    color: "#F1F5F9",
  },
  newArrivalContainer: {
    paddingBottom: verticalScale(20),
  },
  newArrivalTextContainer: {
    height: verticalScale(30),
    marginHorizontal: scale(16),
    justifyContent: "center",
  },
  newArrivalText: {
    color: "#F1F5F9",
    fontWeight: "bold",
    fontSize: moderateScale(23),
  },
  songContainer: {
    marginHorizontal: scale(16),
    marginTop: verticalScale(12),
    height: verticalScale(90),
    borderRadius: moderateScale(25),
    backgroundColor: "#20DF6033",
  },
  songInsideContainer: {
    marginTop: verticalScale(10),
    marginHorizontal: scale(16),
    height: verticalScale(70),
  },
  songOneImgContainer: {
    height: verticalScale(70),
    width: scale(70),
    overflow: "hidden",
    borderRadius: moderateScale(12),
  },
  songOneImg: {
    height: verticalScale(90),
    width: scale(90),
  },
  arrivalInsideTextContainer: {
    marginLeft: scale(10),
    justifyContent: "center",
    width: scale(150),
  },
  songInsideSecondContainer: {
    height: verticalScale(70),
    flexDirection: "row",
  },
  timerContainer: {
    flexDirection: "row",
    gap: moderateScale(8),
    alignItems: "center",
  },
  mindMorningContainer: {
    width: scale(170),
  },
  mindMorningText: {
    color: "#F1F5F9",
    fontWeight: "bold",
    fontSize: moderateScale(15),
  },
  activebtn: {
    backgroundColor: "#20DF6099",
    height: moderateScale(8),
    width: moderateScale(8),
    borderRadius: moderateScale(4),
  },
  time: {
    color: "#20DF6099",
  },
  guide: {
    color: "#20DF6099",
  },
  songPlayBtnContainer: {
    marginLeft: "auto",
    width: scale(60),
    justifyContent: "center",
    alignItems: "center",
  },
  songCirclePtrn: {
    height: verticalScale(55),
    width: scale(55),
    backgroundColor: "#20DF6033",
    borderRadius: moderateScale(35),
    justifyContent: "center",
    alignItems: "center",
  },
  // ========== SEARCH STYLES ==========
  clearSearchBtn: {
    padding: moderateScale(8),
    justifyContent: "center",
    alignItems: "center",
  },
  searchResultsContainer: {
    paddingHorizontal: scale(16),
    paddingBottom: verticalScale(30),
  },
  noResultsContainer: {
    alignItems: "center",
    paddingVertical: verticalScale(60),
    gap: verticalScale(10),
  },
  noResultsTitle: {
    color: "#F1F5F9",
    fontSize: moderateScale(18),
    fontWeight: "bold",
  },
  noResultsSubtitle: {
    color: "#94A3B8",
    fontSize: moderateScale(14),
  },
  searchSection: {
    marginBottom: verticalScale(24),
  },
  searchSectionTitle: {
    color: "#20DF60",
    fontSize: moderateScale(11),
    fontWeight: "bold",
    letterSpacing: 1.2,
    marginBottom: verticalScale(12),
  },
  searchTeacherCard: {
    alignItems: "center",
    width: scale(80),
  },
  searchTeacherImage: {
    width: moderateScale(60),
    height: moderateScale(60),
    borderRadius: moderateScale(30),
    borderWidth: 2,
    borderColor: "#20DF6066",
    marginBottom: verticalScale(6),
  },
  searchTeacherName: {
    color: "#F1F5F9",
    fontSize: moderateScale(12),
    fontWeight: "500",
    textAlign: "center",
  },
  searchCategoryCard: {
    width: scale(140),
    height: verticalScale(90),
    borderRadius: moderateScale(12),
    overflow: "hidden",
    justifyContent: "flex-end",
    padding: moderateScale(10),
  },
  searchCategoryImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  searchCategoryOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  searchCategoryName: {
    color: "#F1F5F9",
    fontSize: moderateScale(14),
    fontWeight: "bold",
    zIndex: 1,
  },
});
