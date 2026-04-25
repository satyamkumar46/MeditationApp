import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useDispatch, useSelector } from "react-redux";
import AppLayout from "../../components/AppLayout";
import {
  loadUserStats,
  loadUserStatsFromCache,
} from "../../features/actions/userActions";
import { resetUser } from "../../features/slices/userSlice";
import { clearUserCache } from "../../utility/cache";
import { moderateScale, scale, verticalScale } from "../../utility/helpers";
import { removeToken } from "../../utility/storage";

const MENU_ITEMS = [
  {
    id: "edit",
    icon: "person-outline",
    iconFamily: "Ionicons",
    label: "Edit Profile",
    hasArrow: true,
  },
  {
    id: "notifications",
    icon: "notifications-outline",
    iconFamily: "Ionicons",
    label: "Notification Settings",
    hasArrow: true,
  },
];

const formatNumber = (num) => {
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  return String(num);
};

const ProfileScreen = ({ navigation, setSession }) => {
  const name = useSelector((state) => state.user.name);
  const profileImage = useSelector((state) => state.user.profileImage);
  const streakCount = useSelector((state) => state.user.streakCount);
  const totalSessions = useSelector((state) => state.user.totalSessions);
  const totalMinutes = useSelector((state) => state.user.totalMinutes);
  const following = useSelector((state) => state.user.following);
  const bio = useSelector((state) => state.user.bio);
  const dispatch = useDispatch();

  const insets = useSafeAreaInsets();

  const [loadingStats, setLoadingStats] = useState(true);

  const stats = [
    { label: "SESSIONS", value: formatNumber(totalSessions) },
    { label: "MINUTES", value: formatNumber(totalMinutes) },
    { label: "STREAK", value: `${streakCount}d` },
    { label: "FOLLOWING", value: `${following}` },
  ];

  const handleLogout = async () => {
    await removeToken();
    await clearUserCache(); // wipe timer stats, user cache, daily goal for this account
    dispatch(resetUser());
    setSession(false);
  };

  // Two-phase load:
  //   Phase 1 — instantly read from AsyncStorage cache → no spinner if cached
  //   Phase 2 — silently refresh from API in background → updates cache for next time
  useFocusEffect(
    useCallback(() => {
      let active = true;

      const load = async () => {
        // Phase 1: cache hit? → render immediately, hide spinner
        const hasCached = await dispatch(loadUserStatsFromCache());
        if (active && hasCached) setLoadingStats(false);

        // Phase 2: always refresh from API silently (no spinner if cache existed)
        if (!hasCached && active) setLoadingStats(true);
        await dispatch(loadUserStats());
        if (active) setLoadingStats(false);
      };

      load();
      return () => {
        active = false;
      };
    }, [dispatch]),
  );

  return (
    <AppLayout style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#112116" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerIconBtn}
          onPress={() => navigation?.goBack?.()}
        >
          <Ionicons
            name="arrow-back"
            size={moderateScale(22)}
            color="#F1F5F9"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.headerIconBtn}></View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 30 },
        ]}
      >
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={
                profileImage
                  ? { uri: profileImage }
                  : require("../../../assets/images/face.jpg")
              }
              style={styles.avatar}
            />
          </View>
          <Text style={styles.userName}>{name}</Text>
          <Text style={styles.userRole}>{bio?.toUpperCase()}</Text>
        </View>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <View key={stat.label} style={styles.statCard}>
              <Text style={styles.statLabel}>{stat.label}</Text>
              {loadingStats ? (
                <ActivityIndicator
                  size="small"
                  color="#20DF60"
                  style={{ marginTop: verticalScale(6) }}
                />
              ) : (
                <Text style={styles.statValue}>{stat.value}</Text>
              )}
            </View>
          ))}
        </View>

        {/* Account Settings */}
        <View style={styles.settingsSection}>
          <Text style={styles.settingsSectionTitle}>ACCOUNT SETTINGS</Text>

          {MENU_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={() => {
                if (item.id === "edit") {
                  navigation.navigate("EditProfile");
                } else if (item.id === "notifications") {
                  navigation.navigate("NotificationSettings");
                }
              }}
            >
              <View style={styles.menuIconContainer}>
                <Ionicons
                  name={item.icon}
                  size={moderateScale(22)}
                  color="#20DF60"
                />
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              {item.hasArrow && (
                <Ionicons
                  name="chevron-forward"
                  size={moderateScale(20)}
                  color="#F1F5F966"
                />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Log Out */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <View style={styles.logoutIconContainer}>
            <MaterialCommunityIcons
              name="logout"
              size={moderateScale(22)}
              color="#EF4444"
            />
          </View>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </AppLayout>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#112116",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: scale(20),
    paddingBottom: verticalScale(10),
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
  scrollContent: {
    paddingTop: verticalScale(10),
  },
  avatarSection: {
    alignItems: "center",
    paddingTop: verticalScale(20),
    paddingBottom: verticalScale(20),
  },
  avatarContainer: {
    width: moderateScale(120),
    height: moderateScale(120),
    borderRadius: moderateScale(60),
    borderWidth: 3,
    borderColor: "#20DF6040",
    backgroundColor: "#1a3a25",
    overflow: "hidden",
    marginBottom: verticalScale(14),
  },
  avatar: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  userName: {
    color: "#F1F5F9",
    fontSize: moderateScale(24),
    fontWeight: "bold",
    marginBottom: verticalScale(4),
  },
  userRole: {
    color: "#20DF60",
    fontSize: moderateScale(12),
    fontWeight: "bold",
    letterSpacing: 1.5,
  },
  statsContainer: {
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: scale(20),
    marginBottom: verticalScale(5),
  },
  statCard: {
    width: "48%",
    aspectRatio: 1,
    justifyContent: "flex-start",
    backgroundColor: "#0D3320",
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: "#20DF6033",
    paddingVertical: verticalScale(16),
    paddingHorizontal: scale(16),
    marginBottom: verticalScale(10),
  },
  statLabel: {
    color: "#20DF60",
    fontSize: moderateScale(11),
    fontWeight: "bold",
    letterSpacing: 1,
    marginBottom: verticalScale(6),
  },
  statValue: {
    color: "#F1F5F9",
    fontSize: moderateScale(24),
    fontWeight: "bold",
  },
  settingsSection: {
    paddingHorizontal: scale(20),
    marginBottom: verticalScale(10),
    marginTop: verticalScale(-150),
  },
  settingsSectionTitle: {
    color: "#F1F5F966",
    fontSize: moderateScale(12),
    fontWeight: "bold",
    letterSpacing: 1.2,
    marginBottom: verticalScale(16),
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: verticalScale(9),
  },
  menuIconContainer: {
    width: moderateScale(44),
    height: moderateScale(44),
    borderRadius: moderateScale(22),
    backgroundColor: "#20DF601A",
    justifyContent: "center",
    alignItems: "center",
    marginRight: scale(14),
  },
  menuLabel: {
    flex: 1,
    color: "#F1F5F9",
    fontSize: moderateScale(16),
    fontWeight: "500",
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(12),
  },
  logoutIconContainer: {
    width: moderateScale(44),
    height: moderateScale(44),
    borderRadius: moderateScale(22),
    backgroundColor: "#EF44441A",
    justifyContent: "center",
    alignItems: "center",
    marginRight: scale(14),
  },
  logoutText: {
    color: "#EF4444",
    fontSize: moderateScale(16),
    fontWeight: "600",
  },
});
