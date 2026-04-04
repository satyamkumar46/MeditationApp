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
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { moderateScale, scale, verticalScale } from "../../utility/helpers";

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

const LEGACY_CATEGORY_DATA = {
  "self-love": {
    title: "Self-Love",
    badge: "CATEGORY",
    ctaIcon: "heart",
    ctaText: "Nurture Self",
    heroImage: require("../../../assets/images/loader.png"),
    subtitle: "Daily Rituals",
    subtitleDesc: "Gentle practices for your inner world",
    sessions: [
      {
        id: 1,
        label: "12 MIN • GUIDED",
        title: "Quietening the Inner Critic",
        action: "Listen Now",
      },
      {
        id: 2,
        label: "8 MIN • AFFIRMATIONS",
        title: "Radiating Worthiness",
        action: "Listen Now",
      },
    ],
    deepDive: {
      label: "DEEP DIVE • 25 MIN",
      title: "Mirror Work Meditation",
      description:
        "A transformative journey into visual self-acceptance and emotional grounding.",
    },
    quote:
      '"Your relationship with yourself sets the tone for every other relationship you have."',
    quoteAuthor: "— SANCTUARY WISDOM",
  },
  anxiety: {
    title: "Anxiety Relief",
    badge: "GUIDED COLLECTION",
    ctaIcon: "play",
    ctaText: "Begin Relief",
    heroImage: require("../../../assets/images/loader.png"),
    subtitle: "Today's Sessions",
    subtitleDesc: null,
    sessions: [
      {
        id: 1,
        icon: "swap-horizontal-outline",
        title: "Box Breathing",
        meta: "4 min • Stress Reduction",
      },
      {
        id: 2,
        icon: "cloud-outline",
        title: "Floating Mind",
        meta: "12 min • Visualization",
      },
      {
        id: 3,
        icon: "leaf-outline",
        title: "Quiet Forest",
        meta: "8 min • Ambient Focus",
      },
      {
        id: 4,
        icon: "shield-outline",
        title: "The Safety Anchor",
        meta: "15 min • Deep Relaxation",
      },
    ],
    totalCount: "4 TOTAL",
    deepDive: null,
    quote: null,
    quoteAuthor: null,
  },
  zen: {
    title: "The Zen Journey",
    badge: "GUIDED PATH",
    ctaIcon: "play",
    ctaText: "Start Journey",
    heroImage: require("../../../assets/images/loader.png"),
    subtitle: "Today's Sessions",
    subtitleDesc: null,
    sessions: [
      {
        id: 1,
        level: "BEGINNER • 12 MIN",
        title: "Forest Breathing",
        description: "Connect with the rhythm of the woods.",
        image: require("../../../assets/images/loader.png"),
      },
      {
        id: 2,
        level: "INTERMEDIATE • 20 MIN",
        title: "Mountain Stillness",
        description: "Elevate your awareness in the peaks.",
        image: require("../../../assets/images/loader.png"),
      },
      {
        id: 3,
        level: "ADVANCED • 35 MIN",
        title: "Deep Tide Release",
        description: "Let go with the ebb and flow.",
        image: require("../../../assets/images/loader.png"),
      },
    ],
    stats: [
      { icon: "flash-outline", value: "12", label: "DAY STREAK" },
      { icon: "time-outline", value: "420", label: "MIN TOTAL" },
    ],
    achievement: {
      title: "Inner Peace Unlocked",
      subtitle: "You've reached Level 4 Awareness.",
    },
    deepDive: null,
    quote: null,
    quoteAuthor: null,
  },
};

const CategoryDetailScreen = ({ navigation, route }) => {
  const categoryKey = route?.params?.category || "self-love";
  const categoryData = route?.params?.categoryData;

  // If we have API category data (from sounds API), render the API tracks view
  const isApiCategory = !!categoryData;
  const legacyData = LEGACY_CATEGORY_DATA[categoryKey];

  const renderApiCategoryContent = () => {
    const tracks = categoryData?.tracks || [];
    const catIcon = CATEGORY_ICONS[categoryData?.catname] || "ellipse-outline";

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
          {/* Hero */}
          <View style={styles.heroSection}>
            {tracks.length > 0 ? (
              <Image
                source={{ uri: tracks[0].thumbnail }}
                style={styles.heroImage}
                resizeMode="cover"
              />
            ) : (
              <View
                style={[styles.heroImage, { backgroundColor: "#0D3320" }]}
              />
            )}
            <View style={styles.heroOverlay} />

            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backBtn}
              >
                <Ionicons
                  name="arrow-back"
                  size={moderateScale(22)}
                  color="#F1F5F9"
                />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>{categoryData?.catname}</Text>
            </View>

            {/* Hero content */}
            <View style={styles.heroContent}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryBadgeText}>
                  {categoryData?.catname?.toUpperCase()} COLLECTION
                </Text>
              </View>
              <Text style={styles.heroTitle}>{categoryData?.catname}</Text>
              <Text style={styles.heroDescription}>
                {tracks.length} tracks available • Curated meditation sounds
              </Text>
              {tracks.length > 0 && (
                <TouchableOpacity
                  style={styles.ctaBtn}
                  onPress={() =>
                    navigation.navigate("Player", {
                      track: {
                        ...tracks[0],
                        catname: categoryData.catname,
                      },
                    })
                  }
                >
                  <Feather
                    name="play"
                    size={moderateScale(18)}
                    color="#112116"
                  />
                  <Text style={styles.ctaBtnText}>Play First</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Stats Row */}
          <View style={styles.apiStatsRow}>
            <View style={styles.apiStatCard}>
              <Ionicons
                name={catIcon}
                size={moderateScale(22)}
                color="#20DF60"
              />
              <Text style={styles.apiStatValue}>{tracks.length}</Text>
              <Text style={styles.apiStatLabel}>TRACKS</Text>
            </View>
            <View style={styles.apiStatCard}>
              <Ionicons
                name="time-outline"
                size={moderateScale(22)}
                color="#20DF60"
              />
              <Text style={styles.apiStatValue}>
                {tracks.reduce((total, t) => {
                  const parts = t.duration.split(":");
                  return total + parseInt(parts[0] || 0);
                }, 0)}
              </Text>
              <Text style={styles.apiStatLabel}>MINUTES</Text>
            </View>
            <View style={styles.apiStatCard}>
              <Ionicons
                name="people-outline"
                size={moderateScale(22)}
                color="#20DF60"
              />
              <Text style={styles.apiStatValue}>
                {new Set(tracks.map((t) => t.teacher?.name)).size}
              </Text>
              <Text style={styles.apiStatLabel}>TEACHERS</Text>
            </View>
          </View>

          {/* Tracks Header */}
          <View style={styles.apiTracksHeader}>
            <Text style={styles.apiTracksTitle}>All Tracks</Text>
            <Text style={styles.apiTracksCount}>{tracks.length} TOTAL</Text>
          </View>

          {/* Track List */}
          <View style={styles.apiTrackList}>
            {tracks.map((track, idx) => (
              <TouchableOpacity
                key={track._id}
                style={styles.apiTrackCard}
                onPress={() =>
                  navigation.navigate("Player", {
                    track: { ...track, catname: categoryData.catname },
                  })
                }
              >
                <View style={styles.apiTrackIndex}>
                  <Text style={styles.apiTrackIndexText}>
                    {String(idx + 1).padStart(2, "0")}
                  </Text>
                </View>
                <Image
                  source={{ uri: track.thumbnail }}
                  style={styles.apiTrackImage}
                />
                <View style={styles.apiTrackInfo}>
                  <Text style={styles.apiTrackTitle} numberOfLines={1}>
                    {track.title}
                  </Text>
                  <Text style={styles.apiTrackMeta}>
                    {track.duration} • {track.teacher?.name}
                  </Text>
                  <View style={styles.apiTrackRating}>
                    <Ionicons
                      name="star"
                      size={moderateScale(12)}
                      color="#FBBF24"
                    />
                    <Text style={styles.apiTrackRatingText}>
                      {track.teacher?.rating}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.apiTrackPlayBtn}
                  onPress={() =>
                    navigation.navigate("Player", {
                      track: { ...track, catname: categoryData.catname },
                    })
                  }
                >
                  <Feather
                    name="play"
                    size={moderateScale(18)}
                    color="#20DF60"
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>

          {/* Teacher Section */}
          {tracks.length > 0 && (
            <View style={styles.apiTeacherSection}>
              <Text style={styles.apiTeacherSectionTitle}>
                Teachers in this category
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.apiTeacherScroll}
              >
                {[
                  ...new Map(
                    tracks.map((t) => [t.teacher?.name, t.teacher]),
                  ).values(),
                ].map((teacher) =>
                  teacher ? (
                    <View key={teacher._id} style={styles.apiTeacherCard}>
                      <Image
                        source={{ uri: teacher.image }}
                        style={styles.apiTeacherImage}
                      />
                      <Text style={styles.apiTeacherName} numberOfLines={1}>
                        {teacher.name}
                      </Text>
                      <View style={styles.apiTeacherRatingRow}>
                        <Ionicons
                          name="star"
                          size={moderateScale(11)}
                          color="#FBBF24"
                        />
                        <Text style={styles.apiTeacherRatingText}>
                          {teacher.rating}
                        </Text>
                      </View>
                    </View>
                  ) : null,
                )}
              </ScrollView>
            </View>
          )}
        </ScrollView>
      </View>
    );
  };

  // If no legacy data and no API data, show fallback
  if (!isApiCategory && !legacyData) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#112116" />
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
          >
            <Ionicons
              name="arrow-back"
              size={moderateScale(22)}
              color="#F1F5F9"
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{categoryKey}</Text>
        </View>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ color: "#94A3B8", fontSize: moderateScale(16) }}>
            Category not found
          </Text>
        </View>
      </View>
    );
  }

  // Render API-based category
  if (isApiCategory) {
    return renderApiCategoryContent();
  }

  // Below is legacy category rendering
  const data = legacyData;

  const renderSelfLoveContent = () => (
    <>
      {/* Daily Rituals */}
      <View style={styles.ritualsSection}>
        <Text style={styles.ritualsTitle}>{data.subtitle}</Text>
        {data.subtitleDesc && (
          <Text style={styles.ritualsDesc}>{data.subtitleDesc}</Text>
        )}

        {data.sessions.map((session) => (
          <View key={session.id} style={styles.ritualItem}>
            <Text style={styles.ritualLabel}>{session.label}</Text>
            <Text style={styles.ritualTitle}>{session.title}</Text>
            <TouchableOpacity style={styles.listenRow}>
              <View style={styles.listenIcon}>
                <Feather name="play" size={moderateScale(14)} color="#20DF60" />
              </View>
              <Text style={styles.listenText}>{session.action}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Deep Dive Card */}
      {data.deepDive && (
        <View style={styles.deepDiveCard}>
          <View style={styles.deepDiveContent}>
            <Text style={styles.deepDiveLabel}>{data.deepDive.label}</Text>
            <Text style={styles.deepDiveTitle}>{data.deepDive.title}</Text>
            <Text style={styles.deepDiveDesc}>{data.deepDive.description}</Text>
          </View>
          <TouchableOpacity style={styles.deepDivePlayBtn}>
            <Feather name="play" size={moderateScale(22)} color="#112116" />
          </TouchableOpacity>
        </View>
      )}

      {/* Quote */}
      {data.quote && (
        <View style={styles.quoteSection}>
          <Text style={styles.quoteMarks}>99</Text>
          <Text style={styles.quoteText}>{data.quote}</Text>
          <Text style={styles.quoteAuthor}>{data.quoteAuthor}</Text>
        </View>
      )}
    </>
  );

  const renderAnxietyContent = () => (
    <>
      {/* Sessions header */}
      <View style={styles.sessionsSectionAlt}>
        <View style={styles.sessionsHeaderAlt}>
          <Text style={styles.sessionsTitleAlt}>{data.subtitle}</Text>
          {data.totalCount && (
            <Text style={styles.totalCount}>{data.totalCount}</Text>
          )}
        </View>

        {data.sessions.map((session) => (
          <TouchableOpacity key={session.id} style={styles.anxietySessionCard}>
            <View style={styles.anxietyIconContainer}>
              <Ionicons
                name={session.icon}
                size={moderateScale(22)}
                color="#20DF60"
              />
            </View>
            <View style={styles.anxietySessionInfo}>
              <Text style={styles.anxietySessionTitle}>{session.title}</Text>
              <Text style={styles.anxietySessionMeta}>{session.meta}</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={moderateScale(18)}
              color="#20DF6066"
            />
          </TouchableOpacity>
        ))}
      </View>
    </>
  );

  const renderZenContent = () => (
    <>
      {/* Sessions */}
      <View style={styles.zenSessionsSection}>
        <View style={styles.zenSessionsHeader}>
          <Text style={styles.zenSessionsTitle}>{data.subtitle}</Text>
          <TouchableOpacity>
            <Text style={styles.viewLibraryText}>View Library</Text>
          </TouchableOpacity>
        </View>

        {data.sessions.map((session) => (
          <View key={session.id} style={styles.zenSessionCard}>
            <View style={styles.zenSessionImageContainer}>
              <Image
                source={session.image}
                style={styles.zenSessionImage}
                resizeMode="cover"
              />
              {session.id === 2 && (
                <View style={styles.zenPlayOverlay}>
                  <Feather
                    name="play"
                    size={moderateScale(18)}
                    color="#F1F5F9"
                  />
                </View>
              )}
            </View>
            <View style={styles.zenSessionInfo}>
              <Text style={styles.zenSessionLevel}>{session.level}</Text>
              <Text style={styles.zenSessionTitle}>{session.title}</Text>
              <Text style={styles.zenSessionDesc}>{session.description}</Text>
            </View>
            <TouchableOpacity style={styles.zenMenuBtn}>
              <MaterialCommunityIcons
                name="dots-vertical"
                size={moderateScale(20)}
                color="#94A3B8"
              />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Stats */}
      {data.stats && (
        <View style={styles.zenStatsRow}>
          {data.stats.map((stat) => (
            <View key={stat.label} style={styles.zenStatCard}>
              <View style={styles.zenStatIconRow}>
                <Ionicons
                  name={stat.icon}
                  size={moderateScale(20)}
                  color="#20DF60"
                />
              </View>
              <Text style={styles.zenStatValue}>{stat.value}</Text>
              <Text style={styles.zenStatLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Achievement */}
      {data.achievement && (
        <View style={styles.achievementCard}>
          <Ionicons
            name="ribbon-outline"
            size={moderateScale(24)}
            color="#20DF60"
          />
          <View style={styles.achievementInfo}>
            <Text style={styles.achievementTitle}>
              {data.achievement.title}
            </Text>
            <Text style={styles.achievementSub}>
              {data.achievement.subtitle}
            </Text>
          </View>
        </View>
      )}
    </>
  );

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
        {/* Hero */}
        <View style={styles.heroSection}>
          <Image
            source={data.heroImage}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.heroOverlay} />

          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backBtn}
            >
              <Ionicons
                name="arrow-back"
                size={moderateScale(22)}
                color="#F1F5F9"
              />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{categoryKey}</Text>
          </View>

          {/* Hero content */}
          <View style={styles.heroContent}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>{data.badge}</Text>
            </View>
            <Text style={styles.heroTitle}>{data.title}</Text>
            {categoryKey === "anxiety" && (
              <Text style={styles.heroDescription}>
                Release tension and find your center with specialized breathwork
                and grounding techniques.
              </Text>
            )}
            {categoryKey === "zen" && (
              <Text style={styles.heroDescription}>
                Find stillness in the motion. A curated progression through
                mindfulness, designed to anchor your presence.
              </Text>
            )}
            <TouchableOpacity style={styles.ctaBtn}>
              {data.ctaIcon === "heart" ? (
                <Feather
                  name="heart"
                  size={moderateScale(18)}
                  color="#112116"
                />
              ) : (
                <Feather name="play" size={moderateScale(18)} color="#112116" />
              )}
              <Text style={styles.ctaBtnText}>{data.ctaText}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Category-specific content */}
        {categoryKey === "self-love" && renderSelfLoveContent()}
        {categoryKey === "anxiety" && renderAnxietyContent()}
        {categoryKey === "zen" && renderZenContent()}
      </ScrollView>
    </View>
  );
};

export default CategoryDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#112116",
  },
  scrollContent: {
    paddingBottom: verticalScale(40),
  },
  heroSection: {
    height: verticalScale(380),
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
    bottom: verticalScale(24),
    left: scale(16),
    right: scale(16),
  },
  categoryBadge: {
    marginBottom: verticalScale(8),
  },
  categoryBadgeText: {
    color: "#20DF60",
    fontSize: moderateScale(11),
    fontWeight: "bold",
    letterSpacing: 1.5,
  },
  heroTitle: {
    color: "#FFFFFF",
    fontSize: moderateScale(32),
    fontWeight: "bold",
    letterSpacing: -0.8,
    lineHeight: moderateScale(38),
  },
  heroDescription: {
    color: "#CBD5E1",
    fontSize: moderateScale(14),
    lineHeight: moderateScale(21),
    marginTop: verticalScale(8),
  },
  ctaBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#20DF60",
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(10),
    borderRadius: moderateScale(25),
    alignSelf: "flex-start",
    marginTop: verticalScale(14),
    gap: scale(8),
  },
  ctaBtnText: {
    color: "#112116",
    fontSize: moderateScale(15),
    fontWeight: "bold",
  },

  /* ===== API CATEGORY STYLES ===== */
  apiStatsRow: {
    flexDirection: "row",
    paddingHorizontal: scale(16),
    marginTop: verticalScale(16),
    gap: scale(8),
  },
  apiStatCard: {
    flex: 1,
    backgroundColor: "#0D3320",
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: "#20DF6033",
    paddingVertical: verticalScale(14),
    alignItems: "center",
    gap: verticalScale(4),
  },
  apiStatValue: {
    color: "#F1F5F9",
    fontSize: moderateScale(22),
    fontWeight: "bold",
  },
  apiStatLabel: {
    color: "#94A3B8",
    fontSize: moderateScale(10),
    fontWeight: "bold",
    letterSpacing: 0.8,
  },
  apiTracksHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: scale(16),
    marginTop: verticalScale(24),
    marginBottom: verticalScale(12),
  },
  apiTracksTitle: {
    color: "#F1F5F9",
    fontSize: moderateScale(20),
    fontWeight: "bold",
  },
  apiTracksCount: {
    color: "#20DF60",
    fontSize: moderateScale(13),
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  apiTrackList: {
    paddingHorizontal: scale(16),
  },
  apiTrackCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: verticalScale(12),
    borderBottomWidth: 1,
    borderBottomColor: "#20DF600D",
  },
  apiTrackIndex: {
    width: scale(28),
    alignItems: "center",
  },
  apiTrackIndexText: {
    color: "#94A3B8",
    fontSize: moderateScale(14),
    fontWeight: "bold",
  },
  apiTrackImage: {
    width: moderateScale(52),
    height: moderateScale(52),
    borderRadius: moderateScale(10),
    marginLeft: scale(8),
  },
  apiTrackInfo: {
    flex: 1,
    marginLeft: scale(12),
  },
  apiTrackTitle: {
    color: "#F1F5F9",
    fontSize: moderateScale(15),
    fontWeight: "bold",
    lineHeight: moderateScale(20),
  },
  apiTrackMeta: {
    color: "#94A3B8",
    fontSize: moderateScale(12),
    marginTop: verticalScale(2),
  },
  apiTrackRating: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(4),
    marginTop: verticalScale(2),
  },
  apiTrackRatingText: {
    color: "#20DF60",
    fontSize: moderateScale(12),
    fontWeight: "600",
  },
  apiTrackPlayBtn: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: "#20DF601A",
    justifyContent: "center",
    alignItems: "center",
  },
  apiTeacherSection: {
    marginTop: verticalScale(28),
  },
  apiTeacherSectionTitle: {
    color: "#F1F5F9",
    fontSize: moderateScale(18),
    fontWeight: "bold",
    paddingHorizontal: scale(16),
    marginBottom: verticalScale(14),
  },
  apiTeacherScroll: {
    paddingLeft: scale(16),
    paddingRight: scale(8),
  },
  apiTeacherCard: {
    width: scale(100),
    alignItems: "center",
    marginRight: scale(12),
  },
  apiTeacherImage: {
    width: moderateScale(64),
    height: moderateScale(64),
    borderRadius: moderateScale(32),
    borderWidth: 2,
    borderColor: "#20DF6033",
  },
  apiTeacherName: {
    color: "#F1F5F9",
    fontSize: moderateScale(13),
    fontWeight: "600",
    marginTop: verticalScale(8),
    textAlign: "center",
  },
  apiTeacherRatingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(3),
    marginTop: verticalScale(3),
  },
  apiTeacherRatingText: {
    color: "#20DF60",
    fontSize: moderateScale(11),
    fontWeight: "600",
  },

  /* ===== SELF-LOVE STYLES ===== */
  ritualsSection: {
    paddingHorizontal: scale(16),
    marginTop: verticalScale(24),
  },
  ritualsTitle: {
    color: "#F1F5F9",
    fontSize: moderateScale(18),
    fontWeight: "bold",
  },
  ritualsDesc: {
    color: "#94A3B8",
    fontSize: moderateScale(14),
    marginTop: verticalScale(4),
    marginBottom: verticalScale(18),
  },
  ritualItem: {
    marginBottom: verticalScale(22),
  },
  ritualLabel: {
    color: "#20DF60",
    fontSize: moderateScale(11),
    fontWeight: "bold",
    letterSpacing: 1.2,
    marginBottom: verticalScale(6),
  },
  ritualTitle: {
    color: "#F1F5F9",
    fontSize: moderateScale(16),
    fontWeight: "bold",
  },
  listenRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(8),
    marginTop: verticalScale(10),
  },
  listenIcon: {
    width: moderateScale(32),
    height: moderateScale(32),
    borderRadius: moderateScale(16),
    backgroundColor: "#20DF601A",
    justifyContent: "center",
    alignItems: "center",
  },
  listenText: {
    color: "#94A3B8",
    fontSize: moderateScale(14),
    fontWeight: "500",
  },
  deepDiveCard: {
    marginHorizontal: scale(16),
    marginTop: verticalScale(8),
    backgroundColor: "#20DF600D",
    borderRadius: moderateScale(16),
    borderWidth: 1,
    borderColor: "#20DF601A",
    paddingVertical: verticalScale(18),
    paddingHorizontal: scale(18),
    flexDirection: "row",
    alignItems: "center",
  },
  deepDiveContent: {
    flex: 1,
    marginRight: scale(12),
  },
  deepDiveLabel: {
    color: "#20DF60",
    fontSize: moderateScale(11),
    fontWeight: "bold",
    letterSpacing: 1,
    marginBottom: verticalScale(6),
  },
  deepDiveTitle: {
    color: "#F1F5F9",
    fontSize: moderateScale(16),
    fontWeight: "bold",
    lineHeight: moderateScale(22),
  },
  deepDiveDesc: {
    color: "#94A3B8",
    fontSize: moderateScale(13),
    lineHeight: moderateScale(19),
    marginTop: verticalScale(4),
  },
  deepDivePlayBtn: {
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: moderateScale(25),
    backgroundColor: "#20DF60",
    justifyContent: "center",
    alignItems: "center",
  },
  quoteSection: {
    marginHorizontal: scale(16),
    marginTop: verticalScale(28),
    alignItems: "center",
    paddingHorizontal: scale(10),
  },
  quoteMarks: {
    color: "#20DF60",
    fontSize: moderateScale(28),
    fontWeight: "bold",
    marginBottom: verticalScale(8),
  },
  quoteText: {
    color: "#F1F5F9",
    fontSize: moderateScale(16),
    fontWeight: "600",
    textAlign: "center",
    lineHeight: moderateScale(24),
  },
  quoteAuthor: {
    color: "#94A3B8",
    fontSize: moderateScale(12),
    fontWeight: "bold",
    letterSpacing: 1.2,
    marginTop: verticalScale(14),
  },

  /* ===== ANXIETY STYLES ===== */
  sessionsSectionAlt: {
    paddingHorizontal: scale(16),
    marginTop: verticalScale(24),
  },
  sessionsHeaderAlt: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: verticalScale(14),
  },
  sessionsTitleAlt: {
    color: "#F1F5F9",
    fontSize: moderateScale(20),
    fontWeight: "bold",
  },
  totalCount: {
    color: "#20DF60",
    fontSize: moderateScale(13),
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  anxietySessionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#20DF600D",
    borderRadius: moderateScale(14),
    borderWidth: 1,
    borderColor: "#20DF601A",
    paddingVertical: verticalScale(14),
    paddingHorizontal: scale(14),
    marginBottom: verticalScale(10),
  },
  anxietyIconContainer: {
    width: moderateScale(44),
    height: moderateScale(44),
    borderRadius: moderateScale(22),
    backgroundColor: "#20DF601A",
    justifyContent: "center",
    alignItems: "center",
  },
  anxietySessionInfo: {
    flex: 1,
    marginLeft: scale(14),
  },
  anxietySessionTitle: {
    color: "#F1F5F9",
    fontSize: moderateScale(15),
    fontWeight: "bold",
  },
  anxietySessionMeta: {
    color: "#94A3B8",
    fontSize: moderateScale(13),
    marginTop: verticalScale(2),
  },

  /* ===== ZEN STYLES ===== */
  zenSessionsSection: {
    paddingHorizontal: scale(16),
    marginTop: verticalScale(24),
  },
  zenSessionsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: verticalScale(14),
  },
  zenSessionsTitle: {
    color: "#F1F5F9",
    fontSize: moderateScale(20),
    fontWeight: "bold",
  },
  viewLibraryText: {
    color: "#20DF60",
    fontSize: moderateScale(14),
    fontWeight: "600",
  },
  zenSessionCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: verticalScale(14),
    borderBottomWidth: 1,
    borderBottomColor: "#20DF600D",
  },
  zenSessionImageContainer: {
    width: moderateScale(60),
    height: moderateScale(60),
    borderRadius: moderateScale(30),
    overflow: "hidden",
    position: "relative",
  },
  zenSessionImage: {
    width: "100%",
    height: "100%",
  },
  zenPlayOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: moderateScale(30),
  },
  zenSessionInfo: {
    flex: 1,
    marginLeft: scale(14),
  },
  zenSessionLevel: {
    color: "#20DF60",
    fontSize: moderateScale(11),
    fontWeight: "bold",
    letterSpacing: 1,
  },
  zenSessionTitle: {
    color: "#F1F5F9",
    fontSize: moderateScale(15),
    fontWeight: "bold",
    marginTop: verticalScale(2),
  },
  zenSessionDesc: {
    color: "#94A3B8",
    fontSize: moderateScale(13),
    marginTop: verticalScale(2),
  },
  zenMenuBtn: {
    width: moderateScale(32),
    height: moderateScale(32),
    justifyContent: "center",
    alignItems: "center",
  },
  zenStatsRow: {
    flexDirection: "row",
    paddingHorizontal: scale(16),
    marginTop: verticalScale(24),
    gap: scale(10),
  },
  zenStatCard: {
    flex: 1,
    backgroundColor: "#20DF600D",
    borderRadius: moderateScale(14),
    borderWidth: 1,
    borderColor: "#20DF601A",
    paddingVertical: verticalScale(16),
    paddingHorizontal: scale(16),
  },
  zenStatIconRow: {
    marginBottom: verticalScale(6),
  },
  zenStatValue: {
    color: "#F1F5F9",
    fontSize: moderateScale(28),
    fontWeight: "bold",
  },
  zenStatLabel: {
    color: "#94A3B8",
    fontSize: moderateScale(11),
    fontWeight: "bold",
    letterSpacing: 0.5,
    marginTop: verticalScale(2),
  },
  achievementCard: {
    marginHorizontal: scale(16),
    marginTop: verticalScale(16),
    backgroundColor: "#20DF601A",
    borderRadius: moderateScale(14),
    borderWidth: 1,
    borderColor: "#20DF6033",
    paddingVertical: verticalScale(16),
    paddingHorizontal: scale(16),
    flexDirection: "row",
    alignItems: "center",
    gap: scale(12),
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    color: "#F1F5F9",
    fontSize: moderateScale(15),
    fontWeight: "bold",
  },
  achievementSub: {
    color: "#94A3B8",
    fontSize: moderateScale(13),
    marginTop: verticalScale(2),
  },
});
