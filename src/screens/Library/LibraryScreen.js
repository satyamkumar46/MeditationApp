import { useState } from "react";
import {
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
import { useSelector } from "react-redux";
import { moderateScale, scale, verticalScale } from "../../utility/helpers";

const TABS = ["My Favorites", "Recent Plays", "Downloaded"];

const LibraryScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState(0);

  const favorites = useSelector((state) => state.library.favorites);
  const recentPlays = useSelector((state) => state.library.recentPlays);
  const downloads = useSelector((state) => state.library.downloads);

  const getActiveData = () => {
    switch (activeTab) {
      case 0:
        return favorites;
      case 1:
        return recentPlays;
      case 2:
        return downloads;
      default:
        return [];
    }
  };

  const getSectionTitle = () => {
    switch (activeTab) {
      case 0:
        return "Favourite Sessions";
      case 1:
        return "Recently Played";
      case 2:
        return "Downloaded Tracks";
      default:
        return "";
    }
  };

  const getEmptyIcon = () => {
    switch (activeTab) {
      case 0:
        return "heart-outline";
      case 1:
        return "time-outline";
      case 2:
        return "cloud-download-outline";
      default:
        return "musical-notes-outline";
    }
  };

  const getEmptyMessage = () => {
    switch (activeTab) {
      case 0:
        return "No favourites yet.\nTap the ❤️ icon on the player to save tracks here.";
      case 1:
        return "No recent plays.\nStart listening to see your history here.";
      case 2:
        return "No downloaded tracks.\nDownloaded tracks will appear here.";
      default:
        return "No tracks found.";
    }
  };

  const activeData = getActiveData();

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Ionicons
          name={getEmptyIcon()}
          size={moderateScale(48)}
          color="#20DF6066"
        />
      </View>
      <Text style={styles.emptyTitle}>{getSectionTitle()}</Text>
      <Text style={styles.emptyMessage}>{getEmptyMessage()}</Text>
    </View>
  );

  const renderSessionItem = ({ item, index }) => (
    <TouchableOpacity
      style={styles.sessionItem}
      onPress={() => navigation.navigate("Player", { track: item })}
    >
      <View style={styles.indexContainer}>
        <Text style={styles.indexText}>
          {String(index + 1).padStart(2, "0")}
        </Text>
      </View>
      <Image
        source={
          item.thumbnail
            ? { uri: item.thumbnail }
            : require("../../../assets/images/loader.png")
        }
        style={styles.sessionImage}
      />
      <View style={styles.sessionInfo}>
        <Text style={styles.sessionTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.sessionMeta}>
          {item.duration || "—"} • {item.catname || "Meditation"}
        </Text>
        {item.teacher?.name && (
          <View style={styles.teacherRow}>
            {item.teacher.image && (
              <Image
                source={{ uri: item.teacher.image }}
                style={styles.teacherMiniAvatar}
              />
            )}
            <Text style={styles.teacherMiniName}>{item.teacher.name}</Text>
          </View>
        )}
      </View>
      <TouchableOpacity
        style={styles.playButton}
        onPress={() => navigation.navigate("Player", { track: item })}
      >
        <Feather name="play" size={moderateScale(16)} color="#112116" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#112116" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIconBtn}>
          {/* <Ionicons
            name="settings-outline"
            size={moderateScale(22)}
            color="#F1F5F9"
          /> */}
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Library</Text>
        <TouchableOpacity style={styles.headerIconBtn}>
          {/* <Ionicons
            name="search-outline"
            size={moderateScale(22)}
            color="#F1F5F9"
          /> */}
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {TABS.map((tab, index) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, index === activeTab && styles.activeTab]}
            onPress={() => setActiveTab(index)}
          >
            <Text
              style={[
                styles.tabText,
                index === activeTab && styles.activeTabText,
              ]}
            >
              {tab}
            </Text>
            {index === 0 && favorites.length > 0 && (
              <View style={styles.tabBadge}>
                <Text style={styles.tabBadgeText}>{favorites.length}</Text>
              </View>
            )}
            {index === 1 && recentPlays.length > 0 && (
              <View style={styles.tabBadge}>
                <Text style={styles.tabBadgeText}>{recentPlays.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Section Header */}
      {activeData.length > 0 && (
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{getSectionTitle()}</Text>
          <Text style={styles.itemCount}>{activeData.length} ITEMS</Text>
        </View>
      )}

      {/* List or Empty State */}
      {activeData.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={activeData}
          renderItem={renderSessionItem}
          keyExtractor={(item, index) => item._id || String(index)}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
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
    paddingHorizontal: scale(22),
    gap: scale(35),
    borderBottomWidth: 1,
    borderBottomColor: "#20DF601A",
  },
  tab: {
    paddingBottom: verticalScale(12),
    flexDirection: "row",
    alignItems: "center",
    gap: scale(10),
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
  tabBadge: {
    backgroundColor: "#20DF6033",
    minWidth: moderateScale(20),
    height: moderateScale(20),
    borderRadius: moderateScale(10),
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: scale(5),
  },
  tabBadgeText: {
    color: "#20DF60",
    fontSize: moderateScale(11),
    fontWeight: "bold",
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
    paddingVertical: verticalScale(12),
  },
  indexContainer: {
    width: scale(28),
    alignItems: "center",
  },
  indexText: {
    color: "#94A3B8",
    fontSize: moderateScale(13),
    fontWeight: "bold",
  },
  sessionImage: {
    width: moderateScale(56),
    height: moderateScale(56),
    borderRadius: moderateScale(10),
    backgroundColor: "#1a3a25",
    marginLeft: scale(8),
  },
  sessionInfo: {
    flex: 1,
    marginLeft: scale(14),
  },
  sessionTitle: {
    color: "#F1F5F9",
    fontSize: moderateScale(15),
    fontWeight: "bold",
    marginBottom: verticalScale(2),
  },
  sessionMeta: {
    color: "#CBD5E1",
    fontSize: moderateScale(12),
  },
  teacherRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(5),
    marginTop: verticalScale(3),
  },
  teacherMiniAvatar: {
    width: moderateScale(16),
    height: moderateScale(16),
    borderRadius: moderateScale(8),
  },
  teacherMiniName: {
    color: "#94A3B8",
    fontSize: moderateScale(11),
    fontWeight: "500",
  },
  playButton: {
    width: moderateScale(38),
    height: moderateScale(38),
    borderRadius: moderateScale(19),
    backgroundColor: "#20DF60",
    justifyContent: "center",
    alignItems: "center",
  },
  separator: {
    height: 1,
    backgroundColor: "#20DF600D",
  },

  /* Empty State */
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: scale(40),
  },
  emptyIconContainer: {
    width: moderateScale(96),
    height: moderateScale(96),
    borderRadius: moderateScale(48),
    backgroundColor: "#20DF600D",
    borderWidth: 1,
    borderColor: "#20DF601A",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: verticalScale(20),
  },
  emptyTitle: {
    color: "#F1F5F9",
    fontSize: moderateScale(20),
    fontWeight: "bold",
    marginBottom: verticalScale(10),
  },
  emptyMessage: {
    color: "#94A3B8",
    fontSize: moderateScale(14),
    textAlign: "center",
    lineHeight: moderateScale(22),
  },
});
