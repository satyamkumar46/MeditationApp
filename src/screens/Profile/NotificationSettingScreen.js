import { useState } from "react";
import {
  Dimensions,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

// Base design dimensions (iPhone 14 Pro)
const BASE_WIDTH = 390;
const BASE_HEIGHT = 844;

// Responsive scaling helpers
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } =
  Dimensions.get("window");
const scale = (size) => (SCREEN_WIDTH / BASE_WIDTH) * size;
const verticalScale = (size) => (SCREEN_HEIGHT / BASE_HEIGHT) * size;
const moderateScale = (size, factor = 0.5) =>
  size + (scale(size) - size) * factor;

const NotificationSettingScreen = ({ navigation }) => {
  const [pushNotifications, setPushNotifications] = useState(false);
  const [contentAlerts, setContentAlerts] = useState(true);
  const [dailyReminders, setDailyReminders] = useState(true);
  const [quietHours, setQuietHours] = useState(false);

  const [reminderTime] = useState("08:00 AM");
  const [quietStart] = useState("10:00 PM");
  const [quietEnd] = useState("07:00 AM");

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
        <Text style={styles.headerTitle}>Notification Settings</Text>
        <View style={styles.headerIconBtn} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* General Notifications Section */}
        <Text style={styles.sectionTitle}>GENERAL NOTIFICATIONS</Text>

        {/* Push Notifications */}
        <View style={styles.settingRow}>
          <View style={[styles.iconContainer, { backgroundColor: "#20DF601A" }]}>
            <Ionicons
              name="notifications"
              size={moderateScale(20)}
              color="#20DF60"
            />
          </View>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingLabel}>Push Notifications</Text>
            <Text style={styles.settingDescription}>
              Receive important updates and news
            </Text>
          </View>
          <Switch
            value={pushNotifications}
            onValueChange={setPushNotifications}
            trackColor={{ false: "#1a3a25", true: "#20DF60" }}
            thumbColor="#F1F5F9"
            ios_backgroundColor="#1a3a25"
          />
        </View>

        {/* New Content Alerts */}
        <View style={styles.settingRow}>
          <View style={[styles.iconContainer, { backgroundColor: "#20DF601A" }]}>
            <MaterialCommunityIcons
              name="checkbox-marked"
              size={moderateScale(20)}
              color="#20DF60"
            />
          </View>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingLabel}>New Content Alerts</Text>
            <Text style={styles.settingDescription}>
              Be the first to hear new sessions
            </Text>
          </View>
          <Switch
            value={contentAlerts}
            onValueChange={setContentAlerts}
            trackColor={{ false: "#1a3a25", true: "#20DF60" }}
            thumbColor="#F1F5F9"
            ios_backgroundColor="#1a3a25"
          />
        </View>

        {/* Mindfulness Practice Section */}
        <Text style={[styles.sectionTitle, { marginTop: verticalScale(24) }]}>
          MINDFULNESS PRACTICE
        </Text>

        {/* Daily Reminders */}
        <View style={styles.settingRow}>
          <View style={[styles.iconContainer, { backgroundColor: "#20DF601A" }]}>
            <Ionicons
              name="time"
              size={moderateScale(20)}
              color="#20DF60"
            />
          </View>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingLabel}>Daily Reminders</Text>
            <Text style={styles.settingDescription}>
              Consistency is key to mindfulness
            </Text>
          </View>
          <Switch
            value={dailyReminders}
            onValueChange={setDailyReminders}
            trackColor={{ false: "#1a3a25", true: "#20DF60" }}
            thumbColor="#F1F5F9"
            ios_backgroundColor="#1a3a25"
          />
        </View>

        {/* Daily At row */}
        {dailyReminders && (
          <View style={styles.subSettingRow}>
            <Ionicons
              name="time-outline"
              size={moderateScale(18)}
              color="#F1F5F966"
            />
            <Text style={styles.subSettingLabel}>Daily at</Text>
            <Text style={styles.subSettingValue}>{reminderTime}</Text>
          </View>
        )}

        {/* Preferences Section */}
        <Text style={[styles.sectionTitle, { marginTop: verticalScale(24) }]}>
          PREFERENCES
        </Text>

        {/* Quiet Hours */}
        <View style={styles.settingRow}>
          <View style={[styles.iconContainer, { backgroundColor: "#20DF601A" }]}>
            <Ionicons
              name="moon"
              size={moderateScale(20)}
              color="#20DF60"
            />
          </View>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingLabel}>Quiet Hours</Text>
            <Text style={styles.settingDescription}>
              Silence notifications while you sleep
            </Text>
          </View>
          <Switch
            value={quietHours}
            onValueChange={setQuietHours}
            trackColor={{ false: "#1a3a25", true: "#20DF60" }}
            thumbColor="#F1F5F9"
            ios_backgroundColor="#1a3a25"
          />
        </View>

        {/* Quiet Hours time range */}
        <View style={styles.quietHoursRow}>
          <Text style={styles.quietHoursText}>
            {quietStart} — {quietEnd}
          </Text>
          <TouchableOpacity style={styles.editBtn}>
            <MaterialCommunityIcons
              name="pencil"
              size={moderateScale(18)}
              color="#F1F5F966"
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default NotificationSettingScreen;

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
    paddingBottom: verticalScale(40),
    paddingHorizontal: scale(20),
  },
  sectionTitle: {
    color: "#20DF60",
    fontSize: moderateScale(12),
    fontWeight: "bold",
    letterSpacing: 1.5,
    marginTop: verticalScale(20),
    marginBottom: verticalScale(20),
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(20),
  },
  iconContainer: {
    width: moderateScale(44),
    height: moderateScale(44),
    borderRadius: moderateScale(22),
    justifyContent: "center",
    alignItems: "center",
    marginRight: scale(14),
  },
  settingTextContainer: {
    flex: 1,
    marginRight: scale(10),
  },
  settingLabel: {
    color: "#F1F5F9",
    fontSize: moderateScale(16),
    fontWeight: "600",
    marginBottom: verticalScale(3),
  },
  settingDescription: {
    color: "#F1F5F966",
    fontSize: moderateScale(13),
    fontWeight: "400",
  },
  subSettingRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0D3320",
    borderRadius: moderateScale(12),
    paddingVertical: verticalScale(14),
    paddingHorizontal: scale(16),
    marginBottom: verticalScale(10),
    borderWidth: 1,
    borderColor: "#20DF6020",
  },
  subSettingLabel: {
    color: "#F1F5F9",
    fontSize: moderateScale(15),
    fontWeight: "500",
    flex: 1,
    marginLeft: scale(10),
  },
  subSettingValue: {
    color: "#20DF60",
    fontSize: moderateScale(15),
    fontWeight: "bold",
  },
  quietHoursRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: verticalScale(14),
    paddingHorizontal: scale(16),
    marginTop: verticalScale(4),
  },
  quietHoursText: {
    color: "#F1F5F9CC",
    fontSize: moderateScale(15),
    fontWeight: "400",
  },
  editBtn: {
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: moderateScale(18),
    justifyContent: "center",
    alignItems: "center",
  },
});
