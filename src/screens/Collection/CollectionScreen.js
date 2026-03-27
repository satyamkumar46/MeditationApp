import {
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";
import { moderateScale, scale, verticalScale } from "../../utility/helpers";

const BEGINNER_CARDS = [
  {
    id: 1,
    title: "Mindful Breath",
    sessions: "12 Sessions",
    category: "Guided Meditation",
    badge: "BEGINNER",
    image: require("../../assest/images/morning-calm-image.png"),
    hasPlay: true,
  },
  {
    id: 2,
    title: "Body Scan Basics",
    sessions: "8 Sessions",
    category: "Relaxation",
    badge: "BEGINNER",
    image: require("../../assest/images/deep-wood-image.png"),
    hasPlay: true,
  },
];

const INTERMEDIATE_CARDS = [
  {
    id: 1,
    title: "Forest Immersion",
    sessions: "15 Sessions",
    category: "Nature Sounds",
    badge: "INTERMEDIATE",
    image: require("../../assest/images/forest-hero.png"),
    hasCta: true,
    ctaText: "Start Now",
  },
  {
    id: 2,
    title: "Emotional Balance",
    sessions: "10 Sessions",
    category: null,
    badge: "INTERMEDIATE",
    image: require("../../assest/images/calm-water-lake.png"),
    hasCta: false,
  },
];

const ADVANCED_ITEMS = [
  {
    id: 1,
    title: "Deep Silence",
    sessions: "20 SESSIONS",
    image: require("../../assest/images/evening-wind-image.png"),
  },
  {
    id: 2,
    title: "The Void",
    sessions: "14 SESSIONS",
    image: require("../../assest/images/candle-deep-sleep.png"),
  },
  {
    id: 3,
    title: "Summit Focus",
    sessions: "16 SESSIONS",
    image: require("../../assest/images/mountain-image.png"),
  },
  {
    id: 4,
    title: "Inner Light",
    sessions: "15 SESSIONS",
    image: require("../../assest/images/cozy-image.png"),
  },
];

const CollectionScreen = ({ navigation }) => {
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
        <Text style={styles.headerTitle}>Popular Collection</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Ionicons
          name="search"
          size={moderateScale(18)}
          color="#20DF6066"
          style={styles.searchIcon}
        />
        <TextInput
          placeholder="Search meditations..."
          placeholderTextColor="#20DF6066"
          style={styles.searchInput}
        />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ===== BEGINNER FOUNDATIONS ===== */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Beginner Foundations</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        {BEGINNER_CARDS.map((card) => (
          <TouchableOpacity key={card.id} style={styles.wideCard}>
            <Image
              source={card.image}
              style={styles.wideCardImage}
              resizeMode="cover"
            />
            <View style={styles.wideCardOverlay} />
            <View style={styles.wideCardContent}>
              <View style={styles.badgeContainer}>
                <Text style={styles.badgeText}>{card.badge}</Text>
              </View>
              <Text style={styles.wideCardTitle}>{card.title}</Text>
              <Text style={styles.wideCardMeta}>
                {card.sessions} • {card.category}
              </Text>
            </View>
            {card.hasPlay && (
              <TouchableOpacity style={styles.wideCardPlayBtn}>
                <Feather
                  name="play"
                  size={moderateScale(18)}
                  color="#20DF60"
                />
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        ))}

        {/* ===== INTERMEDIATE FLOW ===== */}
        <View style={[styles.sectionHeader, { marginTop: verticalScale(24) }]}>
          <Text style={styles.sectionTitle}>Intermediate Flow</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        {INTERMEDIATE_CARDS.map((card) => (
          <View key={card.id}>
            <TouchableOpacity style={styles.tallCard}>
              <Image
                source={card.image}
                style={styles.tallCardImage}
                resizeMode="cover"
              />
              <View style={styles.tallCardOverlay} />
              <View style={styles.tallCardContent}>
                <View style={styles.badgeContainer}>
                  <Text style={styles.badgeText}>{card.badge}</Text>
                </View>
                <Text style={styles.tallCardTitle}>{card.title}</Text>
                <Text style={styles.tallCardMeta}>
                  {card.sessions}
                  {card.category ? ` • ${card.category}` : ""}
                </Text>
                {card.hasCta && (
                  <TouchableOpacity style={styles.ctaBtn}>
                    <Feather
                      name="play"
                      size={moderateScale(14)}
                      color="#112116"
                    />
                    <Text style={styles.ctaBtnText}>{card.ctaText}</Text>
                  </TouchableOpacity>
                )}
              </View>
            </TouchableOpacity>

            {!card.hasCta && (
              <View style={styles.detachedInfo}>
                <View style={styles.badgeContainer}>
                  <Text style={styles.badgeText}>{card.badge}</Text>
                </View>
                <Text style={styles.detachedTitle}>{card.title}</Text>
                <Text style={styles.detachedMeta}>{card.sessions}</Text>
              </View>
            )}
          </View>
        ))}

        {/* ===== ADVANCED MASTERY ===== */}
        <View style={[styles.sectionHeader, { marginTop: verticalScale(24) }]}>
          <Text style={styles.sectionTitle}>Advanced Mastery</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.gridContainer}>
          {ADVANCED_ITEMS.map((item) => (
            <TouchableOpacity key={item.id} style={styles.gridCard}>
              <View style={styles.gridImageContainer}>
                <Image
                  source={item.image}
                  style={styles.gridImage}
                  resizeMode="cover"
                />
              </View>
              <Text style={styles.gridTitle}>{item.title}</Text>
              <Text style={styles.gridSessions}>{item.sessions}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default CollectionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#112116",
  },
  header: {
    paddingTop: Platform.OS === "ios" ? verticalScale(60) : verticalScale(45),
    paddingHorizontal: scale(16),
    paddingBottom: verticalScale(10),
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
    fontSize: moderateScale(22),
    fontWeight: "bold",
    color: "#F1F5F9",
  },
  searchBar: {
    marginHorizontal: scale(16),
    height: verticalScale(42),
    backgroundColor: "#20DF601A",
    borderRadius: moderateScale(25),
    borderWidth: 1,
    borderColor: "#20DF6033",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: scale(14),
    marginBottom: verticalScale(8),
  },
  searchIcon: {
    marginRight: scale(8),
  },
  searchInput: {
    flex: 1,
    fontSize: moderateScale(14),
    color: "#F1F5F9",
  },
  scrollContent: {
    paddingBottom: verticalScale(40),
    paddingHorizontal: scale(16),
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: verticalScale(16),
    marginBottom: verticalScale(14),
  },
  sectionTitle: {
    color: "#F1F5F9",
    fontSize: moderateScale(20),
    fontWeight: "bold",
  },
  seeAll: {
    color: "#20DF60",
    fontSize: moderateScale(14),
    fontWeight: "600",
  },

  /* ===== WIDE CARDS (Beginner) ===== */
  wideCard: {
    height: verticalScale(130),
    borderRadius: moderateScale(16),
    overflow: "hidden",
    marginBottom: verticalScale(12),
    position: "relative",
  },
  wideCardImage: {
    width: "100%",
    height: "100%",
  },
  wideCardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(17, 33, 22, 0.45)",
  },
  wideCardContent: {
    position: "absolute",
    bottom: verticalScale(14),
    left: scale(14),
    right: scale(14),
  },
  badgeContainer: {
    backgroundColor: "#20DF6033",
    borderWidth: 1,
    borderColor: "#20DF6066",
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(2),
    borderRadius: moderateScale(6),
    alignSelf: "flex-start",
    marginBottom: verticalScale(6),
  },
  badgeText: {
    color: "#20DF60",
    fontSize: moderateScale(9),
    fontWeight: "bold",
    letterSpacing: 1.2,
  },
  wideCardTitle: {
    color: "#FFFFFF",
    fontSize: moderateScale(18),
    fontWeight: "bold",
  },
  wideCardMeta: {
    color: "#CBD5E1",
    fontSize: moderateScale(12),
    marginTop: verticalScale(2),
  },
  wideCardPlayBtn: {
    position: "absolute",
    right: scale(14),
    bottom: verticalScale(14),
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: "rgba(32, 223, 96, 0.15)",
    borderWidth: 1,
    borderColor: "#20DF6066",
    justifyContent: "center",
    alignItems: "center",
  },

  /* ===== TALL CARDS (Intermediate) ===== */
  tallCard: {
    height: verticalScale(200),
    borderRadius: moderateScale(16),
    overflow: "hidden",
    marginBottom: verticalScale(4),
    position: "relative",
  },
  tallCardImage: {
    width: "100%",
    height: "100%",
  },
  tallCardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(17, 33, 22, 0.45)",
  },
  tallCardContent: {
    position: "absolute",
    bottom: verticalScale(16),
    left: scale(14),
    right: scale(14),
  },
  tallCardTitle: {
    color: "#FFFFFF",
    fontSize: moderateScale(20),
    fontWeight: "bold",
  },
  tallCardMeta: {
    color: "#CBD5E1",
    fontSize: moderateScale(12),
    marginTop: verticalScale(2),
  },
  ctaBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#20DF60",
    paddingHorizontal: scale(14),
    paddingVertical: verticalScale(8),
    borderRadius: moderateScale(20),
    alignSelf: "flex-start",
    marginTop: verticalScale(10),
    gap: scale(6),
  },
  ctaBtnText: {
    color: "#112116",
    fontSize: moderateScale(13),
    fontWeight: "bold",
  },
  detachedInfo: {
    paddingVertical: verticalScale(10),
    marginBottom: verticalScale(8),
  },
  detachedTitle: {
    color: "#F1F5F9",
    fontSize: moderateScale(17),
    fontWeight: "bold",
  },
  detachedMeta: {
    color: "#94A3B8",
    fontSize: moderateScale(12),
    marginTop: verticalScale(2),
  },

  /* ===== GRID CARDS (Advanced) ===== */
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: verticalScale(14),
  },
  gridCard: {
    width: "47%",
  },
  gridImageContainer: {
    width: "100%",
    height: verticalScale(110),
    borderRadius: moderateScale(14),
    overflow: "hidden",
  },
  gridImage: {
    width: "100%",
    height: "100%",
  },
  gridTitle: {
    color: "#F1F5F9",
    fontSize: moderateScale(14),
    fontWeight: "bold",
    marginTop: verticalScale(8),
  },
  gridSessions: {
    color: "#94A3B8",
    fontSize: moderateScale(11),
    fontWeight: "500",
    letterSpacing: 0.5,
    marginTop: verticalScale(2),
  },
});
