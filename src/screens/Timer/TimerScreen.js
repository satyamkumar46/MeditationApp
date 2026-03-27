import { useState } from "react";
import {
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
import Feather from "react-native-vector-icons/Feather";
import { scale, verticalScale, moderateScale } from "../../utility/helpers";
import Svg, { Circle } from "react-native-svg";

const DURATIONS = [
  { label: "5 min", value: 5 },
  { label: "10 min", value: 10 },
  { label: "20 min", value: 20 },
];

const AMBIENT_SOUNDS = [
  { id: 1, icon: "cloud-outline", iconLib: "Ionicons", label: "Rain" },
  { id: 2, icon: "leaf-outline", iconLib: "Ionicons", label: "Forest" },
  { id: 3, icon: "water-outline", iconLib: "Ionicons", label: "Waves" },
  { id: 4, icon: "sparkles-outline", iconLib: "Ionicons", label: "Zen" },
];

const TimerScreen = ({ navigation }) => {
  const [selectedDuration, setSelectedDuration] = useState(10);
  const [selectedSound, setSelectedSound] = useState(1);

  // Timer circle dimensions
  const circleSize = moderateScale(220);
  const strokeWidth = moderateScale(6);
  const radius = (circleSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progressPercent = 100; // full circle for display
  const strokeDashoffset =
    circumference - (progressPercent / 100) * circumference;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#112116" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.closeBtn}
        >
          <Ionicons name="close" size={moderateScale(26)} color="#F1F5F9" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meditation</Text>
        <TouchableOpacity style={styles.settingsBtn}>
          <Ionicons
            name="settings-outline"
            size={moderateScale(22)}
            color="#94A3B8"
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Streak badge */}
        <View style={styles.streakContainer}>
          <View style={styles.streakBadge}>
            <MaterialCommunityIcons
              name="fire"
              size={moderateScale(16)}
              color="#20DF60"
            />
            <Text style={styles.streakText}>12 DAY STREAK</Text>
          </View>
        </View>

        {/* Timer Circle */}
        <View style={styles.timerContainer}>
          <View style={styles.circleContainer}>
            <Svg
              width={circleSize}
              height={circleSize}
              style={styles.svgCircle}
            >
              {/* Background circle */}
              <Circle
                cx={circleSize / 2}
                cy={circleSize / 2}
                r={radius}
                stroke="#20DF6020"
                strokeWidth={strokeWidth}
                fill="transparent"
              />
              {/* Progress circle */}
              <Circle
                cx={circleSize / 2}
                cy={circleSize / 2}
                r={radius}
                stroke="#20DF60"
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform={`rotate(-90, ${circleSize / 2}, ${circleSize / 2})`}
              />
            </Svg>
            <View style={styles.timerTextContainer}>
              <Text style={styles.timerText}>
                {selectedDuration}:00
              </Text>
              <Text style={styles.remainingText}>REMAINING</Text>
            </View>
          </View>
        </View>

        {/* Daily Goal */}
        <View style={styles.goalSection}>
          <View style={styles.goalHeader}>
            <Text style={styles.goalLabel}>DAILY GOAL</Text>
            <Text style={styles.goalValue}>15 / 20 min</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: "75%" }]} />
          </View>
          <Text style={styles.goalHint}>
            Almost there! Just 5 more minutes to hit your goal.
          </Text>
        </View>

        {/* Duration Selector */}
        <View style={styles.durationSection}>
          <Text style={styles.durationTitle}>Set Duration</Text>
          <View style={styles.durationRow}>
            {DURATIONS.map((d) => (
              <TouchableOpacity
                key={d.value}
                style={[
                  styles.durationBtn,
                  selectedDuration === d.value && styles.durationBtnActive,
                ]}
                onPress={() => setSelectedDuration(d.value)}
              >
                <Text
                  style={[
                    styles.durationBtnText,
                    selectedDuration === d.value && styles.durationBtnTextActive,
                  ]}
                >
                  {d.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Ambient Sound */}
        <View style={styles.ambientSection}>
          <Text style={styles.ambientTitle}>Ambient Sound</Text>
          <View style={styles.ambientRow}>
            {AMBIENT_SOUNDS.map((s) => (
              <TouchableOpacity
                key={s.id}
                style={[
                  styles.ambientBtn,
                  selectedSound === s.id && styles.ambientBtnActive,
                ]}
                onPress={() => setSelectedSound(s.id)}
              >
                <Ionicons
                  name={s.icon}
                  size={moderateScale(24)}
                  color={selectedSound === s.id ? "#112116" : "#20DF60"}
                />
                <Text
                  style={[
                    styles.ambientLabel,
                    selectedSound === s.id && styles.ambientLabelActive,
                  ]}
                >
                  {s.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Controls */}
        <View style={styles.controlsRow}>
          <TouchableOpacity style={styles.controlBtn}>
            <Ionicons
              name="refresh-outline"
              size={moderateScale(24)}
              color="#94A3B8"
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.playBtn}>
            <Feather
              name="play"
              size={moderateScale(28)}
              color="#112116"
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlBtn}>
            <Ionicons
              name="volume-high-outline"
              size={moderateScale(24)}
              color="#94A3B8"
            />
          </TouchableOpacity>
        </View>

        {/* Mindfulness tip */}
        <View style={styles.tipCard}>
          <Ionicons
            name="bulb-outline"
            size={moderateScale(18)}
            color="#20DF60"
          />
          <Text style={styles.tipText}>
            Focus on your breath and let thoughts pass through your mind like
            clouds in the sky.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default TimerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#112116",
  },
  header: {
    paddingTop: Platform.OS === "ios" ? verticalScale(60) : verticalScale(45),
    paddingHorizontal: scale(16),
    paddingBottom: verticalScale(8),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  closeBtn: {
    width: moderateScale(36),
    height: moderateScale(36),
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: moderateScale(18),
    fontWeight: "bold",
    color: "#F1F5F9",
  },
  settingsBtn: {
    width: moderateScale(36),
    height: moderateScale(36),
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    paddingBottom: verticalScale(40),
  },
  streakContainer: {
    alignItems: "center",
    marginTop: verticalScale(12),
  },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#20DF601A",
    borderWidth: 1,
    borderColor: "#20DF6033",
    borderRadius: moderateScale(20),
    paddingHorizontal: scale(14),
    paddingVertical: verticalScale(6),
    gap: scale(6),
  },
  streakText: {
    color: "#20DF60",
    fontSize: moderateScale(12),
    fontWeight: "bold",
    letterSpacing: 1,
  },
  timerContainer: {
    alignItems: "center",
    marginTop: verticalScale(24),
  },
  circleContainer: {
    width: moderateScale(220),
    height: moderateScale(220),
    justifyContent: "center",
    alignItems: "center",
  },
  svgCircle: {
    position: "absolute",
  },
  timerTextContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  timerText: {
    fontSize: moderateScale(52),
    fontWeight: "bold",
    color: "#F1F5F9",
    letterSpacing: -1,
  },
  remainingText: {
    fontSize: moderateScale(12),
    color: "#20DF60",
    letterSpacing: 2,
    fontWeight: "500",
    marginTop: verticalScale(4),
  },
  goalSection: {
    marginTop: verticalScale(28),
    paddingHorizontal: scale(24),
  },
  goalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: verticalScale(10),
  },
  goalLabel: {
    fontSize: moderateScale(13),
    fontWeight: "bold",
    color: "#F1F5F9",
    letterSpacing: 1,
  },
  goalValue: {
    fontSize: moderateScale(14),
    color: "#20DF60",
    fontWeight: "600",
  },
  progressBarBg: {
    height: moderateScale(8),
    backgroundColor: "#20DF601A",
    borderRadius: moderateScale(4),
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#20DF60",
    borderRadius: moderateScale(4),
  },
  goalHint: {
    fontSize: moderateScale(12),
    color: "#94A3B8",
    marginTop: verticalScale(6),
  },
  durationSection: {
    marginTop: verticalScale(28),
    alignItems: "center",
  },
  durationTitle: {
    fontSize: moderateScale(16),
    fontWeight: "bold",
    color: "#F1F5F9",
    marginBottom: verticalScale(12),
  },
  durationRow: {
    flexDirection: "row",
    gap: scale(4),
    backgroundColor: "#20DF600D",
    borderRadius: moderateScale(25),
    padding: moderateScale(4),
  },
  durationBtn: {
    paddingHorizontal: scale(22),
    paddingVertical: verticalScale(10),
    borderRadius: moderateScale(20),
  },
  durationBtnActive: {
    backgroundColor: "#20DF60",
  },
  durationBtnText: {
    fontSize: moderateScale(14),
    color: "#94A3B8",
    fontWeight: "600",
  },
  durationBtnTextActive: {
    color: "#112116",
  },
  ambientSection: {
    marginTop: verticalScale(28),
    paddingHorizontal: scale(24),
  },
  ambientTitle: {
    fontSize: moderateScale(16),
    fontWeight: "bold",
    color: "#20DF60",
    marginBottom: verticalScale(14),
  },
  ambientRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: scale(10),
  },
  ambientBtn: {
    flex: 1,
    alignItems: "center",
    paddingVertical: verticalScale(14),
    borderRadius: moderateScale(14),
    backgroundColor: "#20DF600D",
    borderWidth: 1,
    borderColor: "#20DF601A",
    gap: verticalScale(6),
  },
  ambientBtnActive: {
    backgroundColor: "#20DF60",
    borderColor: "#20DF60",
  },
  ambientLabel: {
    fontSize: moderateScale(12),
    color: "#94A3B8",
    fontWeight: "500",
  },
  ambientLabelActive: {
    color: "#112116",
    fontWeight: "bold",
  },
  controlsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: verticalScale(30),
    gap: scale(30),
  },
  controlBtn: {
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: moderateScale(25),
    backgroundColor: "#20DF600D",
    borderWidth: 1,
    borderColor: "#20DF601A",
    justifyContent: "center",
    alignItems: "center",
  },
  playBtn: {
    width: moderateScale(68),
    height: moderateScale(68),
    borderRadius: moderateScale(34),
    backgroundColor: "#20DF60",
    justifyContent: "center",
    alignItems: "center",
  },
  tipCard: {
    marginHorizontal: scale(16),
    marginTop: verticalScale(28),
    backgroundColor: "#20DF600D",
    borderRadius: moderateScale(14),
    borderWidth: 1,
    borderColor: "#20DF601A",
    paddingVertical: verticalScale(16),
    paddingHorizontal: scale(16),
    flexDirection: "row",
    gap: scale(10),
    alignItems: "flex-start",
  },
  tipText: {
    flex: 1,
    fontSize: moderateScale(14),
    color: "#CBD5E1",
    lineHeight: moderateScale(20),
  },
});
