import { Audio } from "expo-av";
import { useCallback, useRef, useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Circle } from "react-native-svg";
import Feather from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useDispatch } from "react-redux";
import { setUser } from "../../features/slices/userSlice";
import { addSession } from "../../services/userService";
import { moderateScale, scale, verticalScale } from "../../utility/helpers";

/* ---------------- CONSTANTS ---------------- */

const DURATIONS = [
  { label: "1 min", value: 1 },
  { label: "5 min", value: 5 },
  { label: "10 min", value: 10 },
  { label: "20 min", value: 20 },
];

const AMBIENT_SOUNDS = [
  {
    id: 1,
    icon: "cloud-outline",
    label: "Rain",
    url: "https://res.cloudinary.com/dya8bskwr/video/upload/v1743427393/meditation-sounds/rain-ambience_lsrfwc.mp3",
  },
  {
    id: 2,
    icon: "leaf-outline",
    label: "Forest",
    url: "https://res.cloudinary.com/dya8bskwr/video/upload/v1743427393/meditation-sounds/forest-ambience_r9c3la.mp3",
  },
  {
    id: 3,
    icon: "water-outline",
    label: "Waves",
    url: "https://res.cloudinary.com/dya8bskwr/video/upload/v1743427393/meditation-sounds/ocean-waves_xhqvke.mp3",
  },
  {
    id: 4,
    icon: "sparkles-outline",
    label: "Zen",
    url: "https://res.cloudinary.com/dya8bskwr/video/upload/v1743427393/meditation-sounds/zen-bells_ij2wfz.mp3",
  },
];

const TIPS = [
  "Focus on your breath and let thoughts pass like clouds.",
  "Count each exhale from 1 to 10.",
  "Gently bring your focus back when mind wanders.",
  "Feel your body supported.",
  "Notice the space between thoughts.",
];

/* ---------------- GLOBAL STATE ---------------- */

let globalTimerState = {
  isRunning: false,
  isPaused: false,
  startedAt: null,
  pausedRemaining: null,
  totalDuration: 0,
  selectedDuration: 5,
  selectedSound: 1,
  isMuted: false,
};

/* ---------------- COMPONENT ---------------- */

const TimerScreen = ({ navigation }) => {
  const soundRef = useRef(null);
  const tickRef = useRef(null);
  const completedRef = useRef(false);

  const [selectedDuration, setSelectedDuration] = useState(
    globalTimerState.selectedDuration,
  );
  const [selectedSound, setSelectedSound] = useState(
    globalTimerState.selectedSound,
  );
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const [streak, setStreak] = useState(0);
  const [totalSessions, setTotalSessions] = useState(0);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [todayMinutes, setTodayMinutes] = useState(0);

  const [timeRemaining, setTimeRemaining] = useState(selectedDuration * 60);

  const tip = useState(() => TIPS[Math.floor(Math.random() * TIPS.length)])[0];

  /* ---------------- UI CONSTANTS (FIXED) ---------------- */

  const circleSize = moderateScale(220);
  const strokeWidth = moderateScale(6);
  const radius = (circleSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const totalSeconds = selectedDuration * 60;

  const progressPercent =
    totalSeconds > 0 ? (timeRemaining / totalSeconds) * 100 : 100;

  const strokeDashoffset =
    circumference - (progressPercent / 100) * circumference;

  const dailyGoal = 20;
  const goalPercent = Math.min((todayMinutes / dailyGoal) * 100, 100);
  const goalRemaining = Math.max(dailyGoal - todayMinutes, 0);

  const getStatusLabel = () => {
    if (isRunning) return "FOCUS";
    if (isPaused) return "PAUSED";
    return "READY";
  };

  const handlePlayPress = () => {
    if (isRunning) pauseTimer();
    else if (isPaused) resumeTimer();
    else startTimer();
  };

  /* ---------------- TIMER ---------------- */

  const startTimer = async () => {
    completedRef.current = false;

    const total = selectedDuration * 60;

    globalTimerState = {
      ...globalTimerState,
      isRunning: true,
      isPaused: false,
      startedAt: Date.now(),
      totalDuration: total,
      selectedDuration,
      selectedSound,
      pausedRemaining: null,
    };

    setIsRunning(true);
    setIsPaused(false);
    setTimeRemaining(total);

    await playSound(selectedSound);

    tickRef.current = setInterval(() => {
      const elapsed = Math.floor(
        (Date.now() - globalTimerState.startedAt) / 1000,
      );
      const remaining = Math.max(globalTimerState.totalDuration - elapsed, 0);

      setTimeRemaining(remaining);

      if (remaining <= 0 && !completedRef.current) {
        completedRef.current = true;
        onTimerComplete();
      }
    }, 1000);
  };

  const pauseTimer = async () => {
    const elapsed = Math.floor(
      (Date.now() - globalTimerState.startedAt) / 1000,
    );
    const remaining = Math.max(globalTimerState.totalDuration - elapsed, 0);

    globalTimerState.isRunning = false;
    globalTimerState.isPaused = true;
    globalTimerState.pausedRemaining = remaining;

    setIsRunning(false);
    setIsPaused(true);
    setTimeRemaining(remaining);

    clearInterval(tickRef.current);

    if (soundRef.current) {
      await soundRef.current.pauseAsync();
    }
  };

  const resumeTimer = async () => {
    const remaining = globalTimerState.pausedRemaining || timeRemaining;

    globalTimerState.isRunning = true;
    globalTimerState.isPaused = false;
    globalTimerState.startedAt = Date.now();
    globalTimerState.totalDuration = remaining;

    setIsRunning(true);
    setIsPaused(false);

    await playSound(globalTimerState.selectedSound);

    startTimer();
  };

  const resetTimer = async () => {
    globalTimerState.isRunning = false;
    globalTimerState.isPaused = false;

    setIsRunning(false);
    setIsPaused(false);
    setTimeRemaining(selectedDuration * 60);

    clearInterval(tickRef.current);

    if (soundRef.current) {
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }
  };

  /* ---------------- SOUND ---------------- */

  const playSound = async (id) => {
    const sound = AMBIENT_SOUNDS.find((s) => s.id === id);
    if (!sound) return;

    await Audio.setAudioModeAsync({
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
    });

    const { sound: newSound } = await Audio.Sound.createAsync(
      { uri: sound.url },
      { shouldPlay: true, isLooping: true, volume: isMuted ? 0 : 1 },
    );

    soundRef.current = newSound;
  };

  const toggleMute = async () => {
    const m = !isMuted;
    setIsMuted(m);

    if (soundRef.current) {
      await soundRef.current.setVolumeAsync(m ? 0 : 1);
    }
  };

  /* ---------------- COMPLETE ---------------- */

  const onTimerComplete = useCallback(async () => {
    const minutes = globalTimerState.selectedDuration;

    const dispatch = useDispatch();

    setIsRunning(false);
    setIsPaused(false);
    setTimeRemaining(0);

    clearInterval(tickRef.current);

    if (soundRef.current) {
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }

    try {
      const res = await addSession(minutes);

      if (res?.success) {
        setStreak(res.user.streak || 0);
        setTodayMinutes((p) => p + minutes);

        Alert.alert("Done", `🔥 Streak: ${res.user.streak}`);
      }

      if (res?.success && res.user) {
        dispatch(setUser(res.user));
      }
    } catch {
      Alert.alert("Saved locally");
    }
  }, []);

  const formatTime = (s) =>
    `${Math.floor(s / 60)
      .toString()
      .padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

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
        <Text style={styles.headerTitle}>
          {isRunning ? "In Session" : "Meditation"}
        </Text>
        <View style={styles.settingsBtn}></View>
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
            <Text style={styles.streakText}>{streak} DAY STREAK</Text>
          </View>
          {isRunning && (
            <View style={styles.liveIndicator}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>SESSION ACTIVE</Text>
            </View>
          )}
        </View>

        {/* Timer Circle */}
        <View style={styles.timerContainer}>
          <View style={styles.circleContainer}>
            <Svg
              width={circleSize}
              height={circleSize}
              style={styles.svgCircle}
            >
              <Circle
                cx={circleSize / 2}
                cy={circleSize / 2}
                r={radius}
                stroke="#20DF6020"
                strokeWidth={strokeWidth}
                fill="transparent"
              />
              <Circle
                cx={circleSize / 2}
                cy={circleSize / 2}
                r={radius}
                stroke={
                  isRunning ? "#20DF60" : isPaused ? "#FBBF24" : "#20DF6066"
                }
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform={`rotate(-90, ${circleSize / 2}, ${circleSize / 2})`}
              />
            </Svg>
            <View style={styles.timerTextContainer}>
              <Text style={styles.timerText}>{formatTime(timeRemaining)}</Text>
              <Text
                style={[styles.remainingText, isPaused && { color: "#FBBF24" }]}
              >
                {getStatusLabel()}
              </Text>
            </View>
          </View>
        </View>

        {/* Daily Goal */}
        <View style={styles.goalSection}>
          <View style={styles.goalHeader}>
            <Text style={styles.goalLabel}>DAILY GOAL</Text>
            <Text style={styles.goalValue}>
              {todayMinutes} / {dailyGoal} min
            </Text>
          </View>
          <View style={styles.progressBarBg}>
            <View
              style={[styles.progressBarFill, { width: `${goalPercent}%` }]}
            />
          </View>
          <Text style={styles.goalHint}>
            {goalRemaining > 0
              ? `${goalRemaining} more minutes to hit your goal today.`
              : "🎉 You've reached your daily goal! Keep going!"}
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
                  (isRunning || isPaused) && { opacity: 0.5 },
                ]}
                onPress={() => {
                  if (!isRunning && !isPaused) {
                    setSelectedDuration(d.value);
                  }
                }}
                disabled={isRunning || isPaused}
              >
                <Text
                  style={[
                    styles.durationBtnText,
                    selectedDuration === d.value &&
                      styles.durationBtnTextActive,
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
                onPress={async () => {
                  setSelectedSound(s.id);
                  globalTimerState.selectedSound = s.id;
                  // If timer is running, switch the sound live
                  if (isRunning) {
                    await cleanupSound();
                    const { sound: newSound } = await Audio.Sound.createAsync(
                      { uri: s.url },
                      {
                        shouldPlay: true,
                        isLooping: true,
                        volume: isMuted ? 0 : 1,
                      },
                    );
                    soundRef.current = newSound;
                  }
                }}
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
          <TouchableOpacity style={styles.controlBtn} onPress={resetTimer}>
            <Ionicons
              name="refresh-outline"
              size={moderateScale(24)}
              color="#94A3B8"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.playBtn, isPaused && { backgroundColor: "#FBBF24" }]}
            onPress={handlePlayPress}
          >
            <Feather
              name={isRunning ? "pause" : "play"}
              size={moderateScale(28)}
              color="#112116"
              style={!isRunning ? { marginLeft: scale(3) } : {}}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlBtn} onPress={toggleMute}>
            <Ionicons
              name={isMuted ? "volume-mute-outline" : "volume-high-outline"}
              size={moderateScale(24)}
              color={isMuted ? "#FF6B6B" : "#94A3B8"}
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
          <Text style={styles.tipText}>{tip}</Text>
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
    gap: verticalScale(8),
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
  liveIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(6),
  },
  liveDot: {
    width: moderateScale(8),
    height: moderateScale(8),
    borderRadius: moderateScale(4),
    backgroundColor: "#20DF60",
  },
  liveText: {
    color: "#20DF60",
    fontSize: moderateScale(11),
    fontWeight: "bold",
    letterSpacing: 1.5,
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
    paddingHorizontal: scale(18),
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
