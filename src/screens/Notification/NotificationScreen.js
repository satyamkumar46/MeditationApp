import { useEffect, useState } from "react";
import {
  FlatList,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Notifications from "expo-notifications";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { moderateScale, scale, verticalScale } from "../../utility/helpers";

const NotificationScreen = ({ navigation }) => {
  const [notificationLog, setNotificationLog] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotificationLog();

    // Listen for incoming notifications while screen is open
    const sub = Notifications.addNotificationReceivedListener((notification) => {
      const newEntry = {
        id: notification.request.identifier,
        title: notification.request.content.title || "Notification",
        body: notification.request.content.body || "",
        time: new Date().toISOString(),
        isNew: true,
      };
      setNotificationLog((prev) => [newEntry, ...prev].slice(0, 100));
    });

    return () => sub.remove();
  }, []);

  const loadNotificationLog = async () => {
    setLoading(true);
    try {
      const presented = await Notifications.getPresentedNotificationsAsync();
      const log = presented
        .map((n) => ({
          id: n.request.identifier,
          title: n.request.content.title || "Notification",
          body: n.request.content.body || "",
          time: n.date
            ? new Date(n.date).toISOString()
            : new Date().toISOString(),
          isNew: false,
        }))
        .sort((a, b) => new Date(b.time) - new Date(a.time));
      setNotificationLog(log);
    } catch (err) {
      // Not all platforms support this
    } finally {
      setLoading(false);
    }
  };

  const clearAll = async () => {
    await Notifications.dismissAllNotificationsAsync();
    setNotificationLog([]);
  };

  const formatLogTime = (isoString) => {
    const date = new Date(isoString);
    const now = new Date();
    const diff = now - date;
    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;

    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getNotificationIcon = (title) => {
    const t = (title || "").toLowerCase();
    if (t.includes("morning") || t.includes("sunrise"))
      return { name: "sunny-outline", color: "#FBB040" };
    if (t.includes("midday") || t.includes("afternoon"))
      return { name: "partly-sunny-outline", color: "#FF9F43" };
    if (t.includes("evening") || t.includes("wind"))
      return { name: "moon-outline", color: "#A78BFA" };
    if (t.includes("bedtime") || t.includes("sleep"))
      return { name: "cloudy-night-outline", color: "#60A5FA" };
    if (t.includes("streak"))
      return { name: "flame-outline", color: "#FF6B6B" };
    if (t.includes("test"))
      return { name: "flask-outline", color: "#20DF60" };
    return { name: "notifications-outline", color: "#20DF60" };
  };

  const renderNotification = ({ item, index }) => {
    const icon = getNotificationIcon(item.title);
    return (
      <View
        style={[
          styles.notifCard,
          item.isNew && styles.notifCardNew,
          index === 0 && { marginTop: 0 },
        ]}
      >
        <View style={[styles.notifIconContainer, { backgroundColor: `${icon.color}1A` }]}>
          <Ionicons name={icon.name} size={moderateScale(20)} color={icon.color} />
        </View>
        <View style={styles.notifContent}>
          <View style={styles.notifHeader}>
            <Text style={styles.notifTitle} numberOfLines={1}>
              {item.title}
            </Text>
            {item.isNew && <View style={styles.newBadge} />}
          </View>
          <Text style={styles.notifBody} numberOfLines={2}>
            {item.body}
          </Text>
          <Text style={styles.notifTime}>{formatLogTime(item.time)}</Text>
        </View>
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconContainer}>
        <MaterialCommunityIcons
          name="bell-sleep-outline"
          size={moderateScale(56)}
          color="#20DF6033"
        />
      </View>
      <Text style={styles.emptyTitle}>All Quiet Here</Text>
      <Text style={styles.emptySubtitle}>
        No notifications yet. Set up reminders{"\n"}to stay on track with your practice.
      </Text>
      <TouchableOpacity
        style={styles.emptyBtn}
        onPress={() => navigation.navigate("Remainder")}
      >
        <Ionicons name="add-circle-outline" size={moderateScale(18)} color="#20DF60" />
        <Text style={styles.emptyBtnText}>Set Up Reminders</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#112116" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerBtn}
        >
          <Ionicons name="arrow-back" size={moderateScale(22)} color="#F1F5F9" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        {notificationLog.length > 0 ? (
          <TouchableOpacity style={styles.headerBtn} onPress={clearAll}>
            <Ionicons
              name="trash-outline"
              size={moderateScale(20)}
              color="#94A3B8"
            />
          </TouchableOpacity>
        ) : (
          <View style={styles.headerBtn} />
        )}
      </View>

      {/* Summary Bar */}
      {notificationLog.length > 0 && (
        <View style={styles.summaryBar}>
          <View style={styles.summaryDot} />
          <Text style={styles.summaryText}>
            {notificationLog.length} notification
            {notificationLog.length !== 1 ? "s" : ""}
          </Text>
        </View>
      )}

      {/* Notification List */}
      <FlatList
        data={notificationLog}
        renderItem={renderNotification}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        contentContainerStyle={[
          styles.listContent,
          notificationLog.length === 0 && { flex: 1 },
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmpty}
      />
    </View>
  );
};

export default NotificationScreen;

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
  summaryBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: scale(24),
    paddingVertical: verticalScale(8),
    gap: scale(8),
  },
  summaryDot: {
    width: moderateScale(8),
    height: moderateScale(8),
    borderRadius: moderateScale(4),
    backgroundColor: "#20DF60",
  },
  summaryText: {
    color: "#94A3B8",
    fontSize: moderateScale(13),
    fontWeight: "500",
  },
  listContent: {
    paddingHorizontal: scale(20),
    paddingBottom: verticalScale(40),
  },
  notifCard: {
    flexDirection: "row",
    backgroundColor: "#0D3320",
    borderRadius: moderateScale(14),
    borderWidth: 1,
    borderColor: "#20DF601A",
    padding: moderateScale(14),
    marginTop: verticalScale(10),
    gap: scale(12),
  },
  notifCardNew: {
    borderColor: "#20DF6066",
    backgroundColor: "#0D33200D",
  },
  notifIconContainer: {
    width: moderateScale(42),
    height: moderateScale(42),
    borderRadius: moderateScale(21),
    justifyContent: "center",
    alignItems: "center",
  },
  notifContent: {
    flex: 1,
  },
  notifHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(6),
    marginBottom: verticalScale(4),
  },
  notifTitle: {
    color: "#F1F5F9",
    fontSize: moderateScale(15),
    fontWeight: "600",
    flex: 1,
  },
  newBadge: {
    width: moderateScale(8),
    height: moderateScale(8),
    borderRadius: moderateScale(4),
    backgroundColor: "#20DF60",
  },
  notifBody: {
    color: "#94A3B8",
    fontSize: moderateScale(13),
    lineHeight: moderateScale(18),
    marginBottom: verticalScale(6),
  },
  notifTime: {
    color: "#64748B",
    fontSize: moderateScale(11),
    fontWeight: "500",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: scale(40),
    gap: verticalScale(12),
  },
  emptyIconContainer: {
    width: moderateScale(96),
    height: moderateScale(96),
    borderRadius: moderateScale(48),
    backgroundColor: "#20DF600D",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: verticalScale(8),
  },
  emptyTitle: {
    color: "#F1F5F9",
    fontSize: moderateScale(20),
    fontWeight: "bold",
  },
  emptySubtitle: {
    color: "#94A3B8",
    fontSize: moderateScale(14),
    textAlign: "center",
    lineHeight: moderateScale(20),
  },
  emptyBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#20DF600D",
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: "#20DF601A",
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(20),
    marginTop: verticalScale(8),
    gap: scale(8),
  },
  emptyBtnText: {
    color: "#20DF60",
    fontSize: moderateScale(14),
    fontWeight: "600",
  },
});