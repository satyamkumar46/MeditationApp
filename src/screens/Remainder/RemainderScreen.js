import * as Notifications from "expo-notifications";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Platform,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { moderateScale, scale, verticalScale } from "../../utility/helpers";

// Configure how notifications behave when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const PRESET_REMINDERS = [
  {
    id: "morning",
    title: "Morning Meditation",
    body: "🌅 Start your day with 5 minutes of mindfulness",
    hour: 7,
    minute: 0,
    icon: "sunny-outline",
  },
  {
    id: "afternoon",
    title: "Midday Reset",
    body: "🧘 Take a break and recenter yourself",
    hour: 12,
    minute: 30,
    icon: "partly-sunny-outline",
  },
  {
    id: "evening",
    title: "Evening Wind Down",
    body: "🌙 Relax and prepare for restful sleep",
    hour: 21,
    minute: 0,
    icon: "moon-outline",
  },
  {
    id: "bedtime",
    title: "Bedtime Calm",
    body: "😴 Listen to sleep sounds for better rest",
    hour: 22,
    minute: 30,
    icon: "cloudy-night-outline",
  },
];

const RemainderScreen = ({ navigation }) => {
  const [scheduledReminders, setScheduledReminders] = useState([]);
  const [activeToggles, setActiveToggles] = useState({});

  useEffect(() => {
    requestPermissions();
    loadScheduledNotifications();
  }, []);

  const requestPermissions = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Please enable notifications in your device settings to use reminders.",
      );
    }
  };

  const loadScheduledNotifications = async () => {
    try {
      const scheduled = await Notifications.getAllScheduledNotificationsAsync();
      setScheduledReminders(scheduled);

      // Build active toggles map from scheduled notifications
      const toggles = {};
      scheduled.forEach((n) => {
        const matchedPreset = PRESET_REMINDERS.find(
          (p) => n.content.title === p.title,
        );
        if (matchedPreset) {
          toggles[matchedPreset.id] = true;
        }
      });
      setActiveToggles(toggles);
    } catch (err) {
      console.error("Error loading notifications:", err);
    }
  };

  const scheduleReminder = async (preset) => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: preset.title,
          body: preset.body,
          sound: true,
        },
        trigger: {
          type: "daily",
          hour: preset.hour,
          minute: preset.minute,
        },
      });
      setActiveToggles((prev) => ({ ...prev, [preset.id]: true }));
      await loadScheduledNotifications();
    } catch (err) {
      console.error("Error scheduling reminder:", err);
      Alert.alert("Error", "Could not schedule reminder. Please try again.");
    }
  };

  const cancelReminder = async (preset) => {
    try {
      const scheduled = await Notifications.getAllScheduledNotificationsAsync();
      const matching = scheduled.filter(
        (n) => n.content.title === preset.title,
      );
      for (const n of matching) {
        await Notifications.cancelScheduledNotificationAsync(n.identifier);
      }
      setActiveToggles((prev) => ({ ...prev, [preset.id]: false }));
      await loadScheduledNotifications();
    } catch (err) {
      console.error("Error cancelling reminder:", err);
    }
  };

  const toggleReminder = async (preset) => {
    if (activeToggles[preset.id]) {
      await cancelReminder(preset);
    } else {
      await scheduleReminder(preset);
    }
  };

  const cancelAllReminders = async () => {
    Alert.alert(
      "Cancel All Reminders",
      "Are you sure you want to remove all scheduled reminders?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes, Cancel All",
          style: "destructive",
          onPress: async () => {
            await Notifications.cancelAllScheduledNotificationsAsync();
            setActiveToggles({});
            setScheduledReminders([]);
          },
        },
      ],
    );
  };

  const formatTime = (hour, minute) => {
    const period = hour >= 12 ? "PM" : "AM";
    const h = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    const m = minute.toString().padStart(2, "0");
    return `${h}:${m} ${period}`;
  };

  const activeCount = Object.values(activeToggles).filter(Boolean).length;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#112116" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerBtn}
        >
          <Ionicons
            name="arrow-back"
            size={moderateScale(22)}
            color="#F1F5F9"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reminders</Text>
        <TouchableOpacity style={styles.headerBtn} onPress={cancelAllReminders}>
          <Ionicons
            name="trash-outline"
            size={moderateScale(20)}
            color="#94A3B8"
          />
        </TouchableOpacity>
      </View>

      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        data={[]}
        renderItem={null}
        ListHeaderComponent={
          <>
            {/* Active Summary */}
            <View style={styles.summaryCard}>
              <View style={styles.summaryIconContainer}>
                <Ionicons
                  name="notifications"
                  size={moderateScale(24)}
                  color="#20DF60"
                />
              </View>
              <View style={styles.summaryTextContainer}>
                <Text style={styles.summaryTitle}>
                  {activeCount} Reminder{activeCount !== 1 ? "s" : ""} Active
                </Text>
                <Text style={styles.summarySubtitle}>
                  {activeCount > 0
                    ? "You'll receive daily mindfulness nudges"
                    : "Set up reminders to build your practice"}
                </Text>
              </View>
            </View>

            {/* Schedule Section */}
            <Text style={styles.sectionTitle}>DAILY SCHEDULE</Text>

            {PRESET_REMINDERS.map((preset) => (
              <View key={preset.id} style={styles.reminderCard}>
                <View style={styles.reminderIconContainer}>
                  <Ionicons
                    name={preset.icon}
                    size={moderateScale(22)}
                    color="#20DF60"
                  />
                </View>
                <View style={styles.reminderInfo}>
                  <Text style={styles.reminderTitle}>{preset.title}</Text>
                  <Text style={styles.reminderTime}>
                    {formatTime(preset.hour, preset.minute)}
                  </Text>
                </View>
                <Switch
                  value={!!activeToggles[preset.id]}
                  onValueChange={() => toggleReminder(preset)}
                  trackColor={{ false: "#20DF601A", true: "#20DF6066" }}
                  thumbColor={activeToggles[preset.id] ? "#20DF60" : "#64748B"}
                  ios_backgroundColor="#20DF601A"
                />
              </View>
            ))}
          </>
        }
      />
    </View>
  );
};

export default RemainderScreen;

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
  headerBtn: {
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
    paddingHorizontal: scale(20),
    paddingBottom: verticalScale(40),
  },
  summaryCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#20DF600D",
    borderRadius: moderateScale(16),
    borderWidth: 1,
    borderColor: "#20DF6033",
    padding: moderateScale(16),
    marginBottom: verticalScale(24),
    gap: scale(14),
  },
  summaryIconContainer: {
    width: moderateScale(48),
    height: moderateScale(48),
    borderRadius: moderateScale(24),
    backgroundColor: "#20DF601A",
    justifyContent: "center",
    alignItems: "center",
  },
  summaryTextContainer: {
    flex: 1,
  },
  summaryTitle: {
    color: "#F1F5F9",
    fontSize: moderateScale(16),
    fontWeight: "bold",
    marginBottom: verticalScale(4),
  },
  summarySubtitle: {
    color: "#94A3B8",
    fontSize: moderateScale(13),
    lineHeight: moderateScale(18),
  },
  sectionTitle: {
    color: "#F1F5F966",
    fontSize: moderateScale(12),
    fontWeight: "bold",
    letterSpacing: 1.2,
    marginBottom: verticalScale(14),
  },
  reminderCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0D3320",
    borderRadius: moderateScale(14),
    borderWidth: 1,
    borderColor: "#20DF601A",
    paddingVertical: verticalScale(14),
    paddingHorizontal: scale(14),
    marginBottom: verticalScale(10),
    gap: scale(12),
  },
  reminderIconContainer: {
    width: moderateScale(42),
    height: moderateScale(42),
    borderRadius: moderateScale(21),
    backgroundColor: "#20DF601A",
    justifyContent: "center",
    alignItems: "center",
  },
  reminderInfo: {
    flex: 1,
  },
  reminderTitle: {
    color: "#F1F5F9",
    fontSize: moderateScale(15),
    fontWeight: "600",
    marginBottom: verticalScale(2),
  },
  reminderTime: {
    color: "#20DF60",
    fontSize: moderateScale(13),
    fontWeight: "500",
  },
  logHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: verticalScale(24),
    marginBottom: verticalScale(14),
  },
  clearText: {
    color: "#20DF60",
    fontSize: moderateScale(13),
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: verticalScale(40),
    gap: verticalScale(10),
  },
  emptyTitle: {
    color: "#F1F5F9",
    fontSize: moderateScale(16),
    fontWeight: "bold",
  },
  emptySubtitle: {
    color: "#94A3B8",
    fontSize: moderateScale(13),
    textAlign: "center",
  },
  logItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(4),
    borderBottomWidth: 1,
    borderBottomColor: "#20DF600D",
    gap: scale(12),
  },
  logDot: {
    width: moderateScale(8),
    height: moderateScale(8),
    borderRadius: moderateScale(4),
    backgroundColor: "#20DF60",
    marginTop: verticalScale(6),
  },
  logContent: {
    flex: 1,
  },
  logTitle: {
    color: "#F1F5F9",
    fontSize: moderateScale(14),
    fontWeight: "600",
    marginBottom: verticalScale(2),
  },
  logBody: {
    color: "#94A3B8",
    fontSize: moderateScale(13),
    lineHeight: moderateScale(18),
    marginBottom: verticalScale(4),
  },
  logTime: {
    color: "#64748B",
    fontSize: moderateScale(11),
  },
  testBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#20DF600D",
    borderRadius: moderateScale(14),
    borderWidth: 1,
    borderColor: "#20DF601A",
    paddingVertical: verticalScale(14),
    marginTop: verticalScale(24),
    gap: scale(8),
  },
  testBtnText: {
    color: "#20DF60",
    fontSize: moderateScale(14),
    fontWeight: "600",
  },
});
