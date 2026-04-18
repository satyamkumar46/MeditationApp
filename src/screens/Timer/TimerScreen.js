import { Audio } from "expo-av";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  AppState,
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
import {
  fetchStreak,
  updateSessionStatsInDB,
  updateStreakInDB,
} from "../../services/streakService";
import { moderateScale, scale, verticalScale } from "../../utility/helpers";

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
  "Focus on your breath and let thoughts pass like clouds in the sky.",
  "Try counting each exhale from 1 to 10, then start again.",
  "Gently bring your focus back each time your mind wanders.",
  "Feel the weight of your body and the support beneath you.",
  "Notice the space between your thoughts — that is stillness.",
];

// ============ MODULE-LEVEL STATE ============
// These persist across screen mounts/unmounts so the timer & sound
// keep running even when the user navigates away.
let globalSound = null;
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

// In-memory streak & session tracking (persists across navigations, resets on app restart)
let globalStreak = { count: 0, lastActivity: null };
let globalStats = { totalSessions: 0, totalMinutes: 0 };

const TimerScreen = ({ navigation }) => {
  const [selectedDuration, setSelectedDuration] = useState(
    globalTimerState.selectedDuration,
  );
  const [selectedSound, setSelectedSound] = useState(
    globalTimerState.selectedSound,
  );
  const [isRunning, setIsRunning] = useState(globalTimerState.isRunning);
  const [isPaused, setIsPaused] = useState(globalTimerState.isPaused);
  const [timeRemaining, setTimeRemaining] = useState(() => {
    if (globalTimerState.isRunning && globalTimerState.startedAt) {
      const elapsed = Math.floor(
        (Date.now() - globalTimerState.startedAt) / 1000,
      );
      return Math.max(globalTimerState.totalDuration - elapsed, 0);
    }
    if (globalTimerState.isPaused && globalTimerState.pausedRemaining != null) {
      return globalTimerState.pausedRemaining;
    }
    return globalTimerState.selectedDuration * 60;
  });
  const [streak, setStreak] = useState(0);
  const [totalSessions, setTotalSessions] = useState(0);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [dailyGoal] = useState(20);
  const [todayMinutes, setTodayMinutes] = useState(0);
  const [isMuted, setIsMuted] = useState(globalTimerState.isMuted);
  const [tip] = useState(TIPS[Math.floor(Math.random() * TIPS.length)]);

  const tickRef = useRef(null);

  // ========== INIT ==========
  useEffect(() => {
    loadStreak();
    loadDailyMinutes();

    if (globalTimerState.isRunning) {
      startDisplayTick();
    }

    return () => {
      clearDisplayTick();
    };
  }, []);

  // Handle app coming back from background
  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active" && globalTimerState.isRunning) {
        // Recalculate remaining time
        const elapsed = Math.floor(
          (Date.now() - globalTimerState.startedAt) / 1000,
        );
        const remaining = Math.max(globalTimerState.totalDuration - elapsed, 0);
        if (remaining <= 0) {
          onTimerComplete();
        } else {
          setTimeRemaining(remaining);
        }
      }
    });
    return () => sub.remove();
  }, []);

  // Sync duration selection when not running
  useEffect(() => {
    if (!isRunning && !isPaused) {
      setTimeRemaining(selectedDuration * 60);
      globalTimerState.selectedDuration = selectedDuration;
    }
  }, [selectedDuration, isRunning, isPaused]);

  // ========== DISPLAY TICK ==========
  // This only updates the UI — the actual timer is time-based (startedAt)
  const startDisplayTick = () => {
    clearDisplayTick();
    tickRef.current = setInterval(() => {
      if (globalTimerState.isRunning && globalTimerState.startedAt) {
        const elapsed = Math.floor(
          (Date.now() - globalTimerState.startedAt) / 1000,
        );
        const remaining = Math.max(globalTimerState.totalDuration - elapsed, 0);
        setTimeRemaining(remaining);

        if (remaining <= 0) {
          onTimerComplete();
        }
      }
    }, 1000);
  };

  const clearDisplayTick = () => {
    if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
  };

  // ========== STREAK LOGIC (Supabase + in-memory cache) ==========
  const getDateStr = () => new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const getYesterdayStr = () =>
    new Date(Date.now() - 86400000).toISOString().split("T")[0];

  const loadStreak = async () => {
    try {
      const data = await fetchStreak();
      const today = getDateStr();
      const yesterday = getYesterdayStr();

      if (data.last_activity === today || data.last_activity === yesterday) {
        globalStreak = {
          count: data.streak_count || 0,
          lastActivity: data.last_activity,
        };
        setStreak(data.streak_count || 0);
      } else {
        globalStreak = { count: 0, lastActivity: null };
        setStreak(0);
      }

      globalStats = {
        totalSessions: data.total_sessions || 0,
        totalMinutes: data.total_minutes || 0,
      };
      setTotalSessions(data.total_sessions || 0);
      setTotalMinutes(data.total_minutes || 0);
    } catch (err) {
      console.error("Error loading streak from Supabase:", err);
    }
  };

  const updateStreak = async () => {
    const today = getDateStr();

    if (globalStreak.lastActivity === today) {
      return globalStreak.count;
    }

    const yesterday = getYesterdayStr();
    let newCount = 1;
    if (globalStreak.lastActivity === yesterday) {
      newCount = globalStreak.count + 1;
    }

    globalStreak = { count: newCount, lastActivity: today };
    setStreak(newCount);

    try {
      await updateStreakInDB(newCount, today);
    } catch (err) {
      console.error("Error saving streak to Supabase:", err);
    }

    return newCount;
  };

  // ========== SESSION STATS (Supabase + in-memory cache) ==========
  const loadDailyMinutes = () => {
    // Already loaded in loadStreak
  };

  const addSessionStats = async (mins) => {
    const today = getDateStr();
    globalStats.totalSessions += 1;
    globalStats.totalMinutes += mins;
    setTotalSessions(globalStats.totalSessions);
    setTotalMinutes(globalStats.totalMinutes);
    setTodayMinutes((prev) => prev + mins);

    try {
      await updateSessionStatsInDB(
        globalStats.totalSessions,
        globalStats.totalMinutes,
        today,
      );
    } catch (err) {
      console.error("Error saving session stats to Supabase:", err);
    }
  };

  // ========== SOUND LOGIC ==========
  const playAmbientSound = async (soundId) => {
    try {
      await cleanupSound();

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
      });

      const ambient = AMBIENT_SOUNDS.find(
        (s) => s.id === (soundId || selectedSound),
      );
      if (!ambient) return;

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: ambient.url },
        { shouldPlay: true, isLooping: true, volume: isMuted ? 0 : 1 },
      );
      globalSound = newSound;
    } catch (err) {
      console.error("Error playing ambient sound:", err);
    }
  };

  const cleanupSound = async () => {
    if (globalSound) {
      try {
        await globalSound.stopAsync();
        await globalSound.unloadAsync();
      } catch (err) {
        // ignore
      }
      globalSound = null;
    }
  };

  const toggleMute = async () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    globalTimerState.isMuted = newMuted;
    if (globalSound) {
      try {
        await globalSound.setVolumeAsync(newMuted ? 0 : 1);
      } catch (err) {
        // ignore
      }
    }
  };

  // ========== TIMER LOGIC ==========
  const startTimer = async () => {
    const totalSeconds = selectedDuration * 60;

    // Update global state
    globalTimerState.isRunning = true;
    globalTimerState.isPaused = false;
    globalTimerState.startedAt = Date.now();
    globalTimerState.totalDuration = totalSeconds;
    globalTimerState.selectedDuration = selectedDuration;
    globalTimerState.selectedSound = selectedSound;
    globalTimerState.pausedRemaining = null;

    setIsRunning(true);
    setIsPaused(false);
    setTimeRemaining(totalSeconds);

    // Play ambient sound
    await playAmbientSound(selectedSound);

    // Start display updates
    startDisplayTick();
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
    clearDisplayTick();

    // Pause sound
    if (globalSound) {
      try {
        await globalSound.pauseAsync();
      } catch (err) {
        // ignore
      }
    }
  };

  const resumeTimer = async () => {
    const remaining = globalTimerState.pausedRemaining || timeRemaining;

    globalTimerState.isRunning = true;
    globalTimerState.isPaused = false;
    globalTimerState.startedAt = Date.now();
    globalTimerState.totalDuration = remaining;
    globalTimerState.pausedRemaining = null;

    setIsRunning(true);
    setIsPaused(false);

    // Resume sound
    if (globalSound) {
      try {
        await globalSound.playAsync();
      } catch (err) {
        // If sound was unloaded somehow, re-play
        await playAmbientSound(globalTimerState.selectedSound);
      }
    } else {
      await playAmbientSound(globalTimerState.selectedSound);
    }

    startDisplayTick();
  };

  const resetTimer = async () => {
    globalTimerState.isRunning = false;
    globalTimerState.isPaused = false;
    globalTimerState.startedAt = null;
    globalTimerState.pausedRemaining = null;

    setIsRunning(false);
    setIsPaused(false);
    setTimeRemaining(selectedDuration * 60);
    clearDisplayTick();
    await cleanupSound();
  };

  const onTimerComplete = useCallback(async () => {
    if (!globalTimerState.isRunning && !globalTimerState.isPaused) return;

    const minutesMeditated = globalTimerState.selectedDuration;

    globalTimerState.isRunning = false;
    globalTimerState.isPaused = false;
    globalTimerState.startedAt = null;
    globalTimerState.pausedRemaining = null;

    setIsRunning(false);
    setIsPaused(false);
    setTimeRemaining(0);
    clearDisplayTick();
    await cleanupSound();

    // Count as streak only on full completion — persist to Supabase
    await addSessionStats(minutesMeditated);
    const newStreak = await updateStreak();

    Alert.alert(
      "🧘 Session Complete!",
      `Great job! You meditated for ${minutesMeditated} minutes.\n\n🔥 Streak: ${newStreak} day${newStreak !== 1 ? "s" : ""}\n📊 Total: ${globalStats.totalSessions} sessions • ${globalStats.totalMinutes} min`,
      [
        {
          text: "Done",
          onPress: () =>
            setTimeRemaining(globalTimerState.selectedDuration * 60),
        },
      ],
    );
  }, [dailyGoal]);

  const handlePlayPress = () => {
    if (isRunning) {
      pauseTimer();
    } else if (isPaused) {
      resumeTimer();
    } else {
      startTimer();
    }
  };

  // ========== FORMATTING ==========
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const circleSize = moderateScale(220);
  const strokeWidth = moderateScale(6);
  const radius = (circleSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const totalSeconds = isRunning
    ? globalTimerState.totalDuration
    : isPaused
      ? globalTimerState.pausedRemaining || selectedDuration * 60
      : selectedDuration * 60;
  const progressPercent =
    totalSeconds > 0 ? (timeRemaining / totalSeconds) * 100 : 100;
  const strokeDashoffset =
    circumference - (progressPercent / 100) * circumference;

  const goalPercent = Math.min((todayMinutes / dailyGoal) * 100, 100);
  const goalRemaining = Math.max(dailyGoal - todayMinutes, 0);

  const getStatusLabel = () => {
    if (isRunning) return "FOCUS";
    if (isPaused) return "PAUSED";
    return "READY";
  };

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
                    globalSound = newSound;
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
