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
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useSelector } from "react-redux";
import { moderateScale, scale, verticalScale } from "../../utility/helpers";

const STATS = [
  { label: "SESSIONS", value: "42" },
  { label: "MINUTES", value: "1,240" },
  { label: "STREAK", value: "12d" },
];

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
  {
    id: "help",
    icon: "help-circle-outline",
    iconFamily: "Ionicons",
    label: "Help & Support",
    hasArrow: true,
  },
];

const ProfileScreen = ({ navigation }) => {
  const name = useSelector((state) => state.user.name);

  return (
    <View style={styles.container}>
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
        <TouchableOpacity style={styles.headerIconBtn}>
          <Ionicons
            name="settings-outline"
            size={moderateScale(22)}
            color="#F1F5F9"
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={require("../../assest/images/face.jpg")}
              style={styles.avatar}
            />
          </View>
          <Text style={styles.userName}>{name}</Text>
          <Text style={styles.userRole}>MINDFULNESS PRACTITIONER</Text>
        </View>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          {STATS.map((stat, index) => (
            <View
              key={stat.label}
              style={[
                styles.statCard,
                index < STATS.length - 1 && { marginRight: scale(10) },
              ]}
            >
              <Text style={styles.statLabel}>{stat.label}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>
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
                } else if (item.id === "help") {
                  navigation.navigate("Support");
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
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => navigation.navigate("Sign In")}
        >
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
    </View>
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
    paddingTop: Platform.OS === "ios" ? verticalScale(60) : verticalScale(45),
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
    paddingBottom: verticalScale(30),
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
    flexDirection: "row",
    paddingHorizontal: scale(20),
    marginBottom: verticalScale(30),
  },
  statCard: {
    flex: 1,
    backgroundColor: "#0D3320",
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: "#20DF6033",
    paddingVertical: verticalScale(16),
    paddingHorizontal: scale(16),
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
    paddingVertical: verticalScale(16),
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
    paddingVertical: verticalScale(16),
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
