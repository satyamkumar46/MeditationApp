import {
  Dimensions,
  FlatList,
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";

// Base design dimensions (iPhone 14 Pro)
const BASE_WIDTH = 390;
const BASE_HEIGHT = 844;

// Responsive scaling helpers
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const scale = (size) => (SCREEN_WIDTH / BASE_WIDTH) * size;
const verticalScale = (size) => (SCREEN_HEIGHT / BASE_HEIGHT) * size;
const moderateScale = (size, factor = 0.5) =>
  size + (scale(size) - size) * factor;

const TABS = ["My Favorites", "Recent Plays", "Downloaded"];

const FAVORITE_SESSIONS = [
  {
    id: "1",
    title: "Morning Calm",
    duration: "10 min",
    category: "Mindfulness",
    image: require("../../assest/images/meditation-forest.png"),
  },
  {
    id: "2",
    title: "Deep Woods Focus",
    duration: "25 min",
    category: "Nature Sounds",
    image: require("../../assest/images/deep-wood-image.png"),
  },
  {
    id: "3",
    title: "Evening Wind Down",
    duration: "15 min",
    category: "Sleep",
    image: require("../../assest/images/evening-wind-image.png"),
  },
  {
    id: "4",
    title: "Mountain Serenity",
    duration: "20 min",
    category: "Breathwork",
    image: require("../../assest/images/mountain-image.png"),
  },
  {
    id: "5",
    title: "Cozy Tea Break",
    duration: "5 min",
    category: "Quick Reset",
    image: require("../../assest/images/cozy-image.png"),
  },
];

const LibraryScreen = () => {
  const activeTab = 0; // "My Favorites" is active

  const renderSessionItem = ({ item }) => (
    <View style={styles.sessionItem}>
      <Image source={item.image} style={styles.sessionImage} />
      <View style={styles.sessionInfo}>
        <Text style={styles.sessionTitle}>{item.title}</Text>
        <Text style={styles.sessionMeta}>
          {item.duration} • {item.category}
        </Text>
      </View>
      <TouchableOpacity style={styles.playButton}>
        <Feather name="play" size={moderateScale(18)} color="#112116" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#112116" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIconBtn}>
          <Ionicons
            name="settings-outline"
            size={moderateScale(22)}
            color="#F1F5F9"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Library</Text>
        <TouchableOpacity style={styles.headerIconBtn}>
          <Ionicons
            name="search-outline"
            size={moderateScale(22)}
            color="#F1F5F9"
          />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {TABS.map((tab, index) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, index === activeTab && styles.activeTab]}
          >
            <Text
              style={[
                styles.tabText,
                index === activeTab && styles.activeTabText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Favorites Header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Favourite Sessions</Text>
        <Text style={styles.itemCount}>{FAVORITE_SESSIONS.length} ITEMS</Text>
      </View>

      {/* Session List */}
      <FlatList
        data={FAVORITE_SESSIONS}
        renderItem={renderSessionItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

export default LibraryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#112116",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: Platform.OS === "ios" ? verticalScale(60) : verticalScale(45),
    paddingHorizontal: scale(20),
    paddingBottom: verticalScale(15),
  },
  headerIconBtn: {
    width: moderateScale(40),
    height: moderateScale(40),
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    color: "#F1F5F9",
    fontSize: moderateScale(20),
    fontWeight: "bold",
  },
  tabsContainer: {
    flexDirection: "row",
    paddingHorizontal: scale(20),
    gap: scale(45),
    borderBottomWidth: 1,
    borderBottomColor: "#20DF601A",
  },
  tab: {
    paddingBottom: verticalScale(12),
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#20DF60",
  },
  tabText: {
    color: "#F1F5F966",
    fontSize: moderateScale(14),
    fontWeight: "600",
  },
  activeTabText: {
    color: "#20DF60",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(24),
    paddingBottom: verticalScale(10),
  },
  sectionTitle: {
    color: "#F1F5F9",
    fontSize: moderateScale(20),
    fontWeight: "bold",
  },
  itemCount: {
    color: "#20DF60",
    fontSize: moderateScale(12),
    fontWeight: "600",
    letterSpacing: 1,
  },
  listContent: {
    paddingHorizontal: scale(20),
    paddingBottom: verticalScale(20),
  },
  sessionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: verticalScale(14),
  },
  sessionImage: {
    width: moderateScale(65),
    height: moderateScale(65),
    borderRadius: moderateScale(10),
    backgroundColor: "#1a3a25",
  },
  sessionInfo: {
    flex: 1,
    marginLeft: scale(16),
  },
  sessionTitle: {
    color: "#F1F5F9",
    fontSize: moderateScale(16),
    fontWeight: "bold",
    marginBottom: verticalScale(4),
  },
  sessionMeta: {
    color: "#CBD5E1",
    fontSize: moderateScale(13),
  },
  playButton: {
    width: moderateScale(44),
    height: moderateScale(44),
    borderRadius: moderateScale(22),
    backgroundColor: "#20DF60",
    justifyContent: "center",
    alignItems: "center",
  },
  separator: {
    height: 1,
    backgroundColor: "#20DF600D",
  },
});
