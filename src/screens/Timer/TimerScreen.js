import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from "expo-av";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Circle } from "react-native-svg";
import Feather from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useDispatch, useSelector } from "react-redux";
import AppLayout from "../../components/AppLayout";
import { setUser } from "../../features/slices/userSlice";
import { addSession } from "../../services/userService";
import { getUserFromCache, saveUserToCache } from "../../utility/cache";
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
  "Focus on your breath and let thoughts pass like clouds.",
  "Count each exhale from 1 to 10.",
  "Gently bring your focus back when mind wanders.",
  "Feel your body supported.",
  "Notice the space between thoughts.",
];

const DAILY_GOAL_KEY = "DAILY_GOAL_MINUTES";
const TODAY_MINUTES_KEY = "TODAY_MINUTES";
const TODAY_DATE_KEY = "TODAY_DATE";

const TimerScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const reduxUser = useSelector((s) => s.user);

  const soundRef = useRef(null);
  const tickRef = useRef(null);
  const completedRef = useRef(false);
  const startedAtRef = useRef(null);
  const totalDurationRef = useRef(0);
  const selectedDurationRef = useRef(5);
  const pausedRemainingRef = useRef(null);
  const onTimerCompleteRef = useRef(null); // always points to latest callback, no stale closure

  const [selectedDuration, setSelectedDuration] = useState(5);
  const [selectedSound, setSelectedSound] = useState(1);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(5 * 60);
  const [pausedRemaining, setPausedRemaining] = useState(null);

  const [streak, setStreak] = useState(reduxUser?.streakCount ?? 0);
  const [todayMinutes, setTodayMinutes] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(20);
  const [goalModalVisible, setGoalModalVisible] = useState(false);
  const [goalInput, setGoalInput] = useState("20");
  const goalAlreadyHitRef = useRef(false);

  const tip = useState(() => TIPS[Math.floor(Math.random() * TIPS.length)])[0];

  const circleSize = moderateScale(220);
  const strokeWidth = moderateScale(6);
  const radius = (circleSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const totalSeconds = selectedDuration * 60;
  const progressPercent =
    totalSeconds > 0 ? (timeRemaining / totalSeconds) * 100 : 100;
  const strokeDashoffset =
    circumference - (progressPercent / 100) * circumference;
  const goalPercent = Math.min((todayMinutes / dailyGoal) * 100, 100);
  const goalRemaining = Math.max(dailyGoal - todayMinutes, 0);

  /* ---- load persisted goal & today's minutes ---- */
  useEffect(() => {
    const load = async () => {
      try {
        const today = new Date().toDateString();
        const savedDate = await AsyncStorage.getItem(TODAY_DATE_KEY);
        const savedGoal = await AsyncStorage.getItem(DAILY_GOAL_KEY);

        if (savedGoal) {
          const g = parseInt(savedGoal, 10);
          setDailyGoal(g);
          setGoalInput(String(g));
        }

        if (savedDate === today) {
          const savedMins = await AsyncStorage.getItem(TODAY_MINUTES_KEY);
          if (savedMins) setTodayMinutes(parseInt(savedMins, 10));
        } else {
          await AsyncStorage.setItem(TODAY_DATE_KEY, today);
          await AsyncStorage.setItem(TODAY_MINUTES_KEY, "0");
          goalAlreadyHitRef.current = false;
        }
      } catch (e) {
        console.log("Load error", e);
      }
    };
    load();
  }, []);

  /* ---- sync streak from redux ---- */
  useEffect(() => {
    if (reduxUser?.streakCount !== undefined) {
      setStreak(reduxUser.streakCount);
    }
  }, [reduxUser?.streakCount]);

  const getStatusLabel = () => {
    if (isRunning) return "FOCUS";
    if (isPaused) return "PAUSED";
    return "READY";
  };

  const formatTime = (s) =>
    `${Math.floor(s / 60)
      .toString()
      .padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  /* ---- sound helpers ---- */
  const playSound = async (id) => {
    const sound = AMBIENT_SOUNDS.find((s) => s.id === id);
    if (!sound) return;
    try {
      await Audio.setAudioModeAsync({
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
      });
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: sound.url },
        { shouldPlay: true, isLooping: true, volume: isMuted ? 0 : 1 },
      );
      soundRef.current = newSound;
    } catch (e) {
      console.log("Sound error", e);
    }
  };

  const cleanupSound = async () => {
    if (soundRef.current) {
      try {
        await soundRef.current.unloadAsync();
      } catch {}
      soundRef.current = null;
    }
  };

  const toggleMute = async () => {
    const m = !isMuted;
    setIsMuted(m);
    if (soundRef.current) {
      try {
        await soundRef.current.setVolumeAsync(m ? 0 : 1);
      } catch {}
    }
  };

  /* ---- session complete ---- */
  const onTimerComplete = useCallback(
    async (minutes) => {
      clearInterval(tickRef.current);
      setIsRunning(false);
      setIsPaused(false);
      setTimeRemaining(0);
      completedRef.current = true;
      await cleanupSound();

      try {
        const res = await addSession(minutes);

        // apiClient wraps response as { data: <json body>, status, success }
        // The JSON body may be { user: { streak, session, minutes } } or { streak, session, minutes }
        const body = res?.data ?? res ?? {};
        const userObj = body?.user ?? body;

        const newStreak = userObj?.streak ?? streak + 1; // fallback: increment locally
        const newSession = userObj?.session ?? reduxUser.totalSessions + 1;
        const newMinutes = userObj?.minutes ?? reduxUser.totalMinutes + minutes;

        if (res?.success) {
          setStreak(newStreak);
          dispatch(
            setUser({
              streak: newStreak,
              session: newSession,
              minutes: newMinutes,
            }),
          );

          // Update local cache immediately so ProfileScreen reads fresh data
          // without waiting for an API call (cache-first load)
          try {
            const existing = (await getUserFromCache()) || {};
            await saveUserToCache({
              ...existing,
              streak: newStreak,
              session: newSession,
              minutes: newMinutes,
            });
          } catch (_) {}
        }

        const newToday = todayMinutes + minutes;
        setTodayMinutes(newToday);
        await AsyncStorage.setItem(TODAY_MINUTES_KEY, String(newToday));

        const displayStreak = res?.success ? newStreak : streak;
        if (newToday >= dailyGoal && !goalAlreadyHitRef.current) {
          goalAlreadyHitRef.current = true;
          Alert.alert(
            "🎉 Daily Goal Reached!",
            `You've hit your ${dailyGoal} min goal!\n🔥 Streak: ${displayStreak} day${displayStreak !== 1 ? "s" : ""}`,
          );
        } else {
          Alert.alert(
            "Session Complete ✅",
            `🔥 Streak: ${displayStreak} day${displayStreak !== 1 ? "s" : ""}`,
          );
        }
      } catch (e) {
        Alert.alert("Session saved locally");
      }
    },
    [streak, todayMinutes, dailyGoal, dispatch, reduxUser],
  );

  // keep ref in sync with latest callback so interval never uses stale version
  useEffect(() => {
    onTimerCompleteRef.current = onTimerComplete;
  }, [onTimerComplete]);

  /* ---- tick ---- */
  const startTick = (durationSeconds) => {
    clearInterval(tickRef.current);
    // set start time IMMEDIATELY so elapsed is always correct
    startedAtRef.current = Date.now();
    totalDurationRef.current = durationSeconds;

    tickRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startedAtRef.current) / 1000);
      const remaining = Math.max(totalDurationRef.current - elapsed, 0);
      setTimeRemaining(remaining);

      if (remaining <= 0 && !completedRef.current) {
        completedRef.current = true;
        clearInterval(tickRef.current);
        // use ref so we always call the LATEST onTimerComplete, never a stale closure
        onTimerCompleteRef.current?.(selectedDurationRef.current);
      }
    }, 1000);
  };

  /* ---- timer controls ---- */
  const startTimer = async () => {
    completedRef.current = false;
    pausedRemainingRef.current = null;
    selectedDurationRef.current = selectedDuration;
    const total = selectedDuration * 60;

    setIsRunning(true);
    setIsPaused(false);
    setTimeRemaining(total); // show correct time immediately
    setPausedRemaining(null);

    // start tick BEFORE awaiting sound so display counts from the start
    startTick(total);

    // load sound in background — won't block the countdown
    await playSound(selectedSound);
  };

  const pauseTimer = async () => {
    const elapsed = Math.floor((Date.now() - startedAtRef.current) / 1000);
    const remaining = Math.max(totalDurationRef.current - elapsed, 0);

    clearInterval(tickRef.current);

    // store in BOTH ref (for immediate read) and state (for UI display)
    pausedRemainingRef.current = remaining;
    setPausedRemaining(remaining);
    setIsRunning(false);
    setIsPaused(true);
    setTimeRemaining(remaining);

    if (soundRef.current) {
      try {
        await soundRef.current.pauseAsync();
      } catch {}
    }
  };

  const resumeTimer = async () => {
    // read from REF — never stale, even across async awaits
    const remaining = pausedRemainingRef.current ?? timeRemaining;
    pausedRemainingRef.current = null;

    setIsRunning(true);
    setIsPaused(false);
    setTimeRemaining(remaining); // immediately show correct time

    // START THE TICK FIRST so countdown updates instantly on resume
    startTick(remaining);

    // then handle sound asynchronously (won't block the display)
    if (soundRef.current) {
      try {
        await soundRef.current.playAsync();
      } catch {
        await cleanupSound();
        await playSound(selectedSound);
      }
    } else {
      await playSound(selectedSound);
    }
  };

  const resetTimer = async () => {
    clearInterval(tickRef.current);
    completedRef.current = false;
    setIsRunning(false);
    setIsPaused(false);
    setTimeRemaining(selectedDuration * 60);
    setPausedRemaining(null);
    await cleanupSound();
  };

  const handlePlayPress = () => {
    if (isRunning) pauseTimer();
    else if (isPaused) resumeTimer();
    else startTimer();
  };

  /* ---- daily goal modal ---- */
  const saveGoal = async () => {
    const val = parseInt(goalInput, 10);
    if (!val || val < 1 || val > 600) {
      Alert.alert("Invalid", "Enter a goal between 1 and 600 minutes.");
      return;
    }
    setDailyGoal(val);
    goalAlreadyHitRef.current = todayMinutes >= val;
    await AsyncStorage.setItem(DAILY_GOAL_KEY, String(val));
    setGoalModalVisible(false);
  };

  return (
    <AppLayout style={styles.container}>
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
        <View style={styles.settingsBtn} />
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
            <View style={styles.goalRight}>
              <Text style={styles.goalValue}>
                {todayMinutes} / {dailyGoal} min
              </Text>
              <TouchableOpacity
                style={styles.editGoalBtn}
                onPress={() => setGoalModalVisible(true)}
              >
                <Feather
                  name="edit-2"
                  size={moderateScale(13)}
                  color="#20DF60"
                />
              </TouchableOpacity>
            </View>
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
                    selectedDurationRef.current = d.value;
                    setTimeRemaining(d.value * 60);
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

      {/* Daily Goal Modal */}
      <Modal
        visible={goalModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setGoalModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Set Daily Goal</Text>
            <Text style={styles.modalSubtitle}>
              How many minutes do you want to meditate today?
            </Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.goalInputField}
                keyboardType="numeric"
                value={goalInput}
                onChangeText={setGoalInput}
                maxLength={3}
                placeholderTextColor="#64748B"
                placeholder="20"
                selectionColor="#20DF60"
              />
              <Text style={styles.inputUnit}>min</Text>
            </View>
            <View style={styles.modalBtns}>
              <TouchableOpacity
                style={styles.modalCancel}
                onPress={() => setGoalModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSave} onPress={saveGoal}>
                <Text style={styles.modalSaveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </AppLayout>
  );
};

export default TimerScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#112116" },
  header: {
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
  settingsBtn: { width: moderateScale(36), height: moderateScale(36) },
  scrollContent: { paddingBottom: verticalScale(40) },
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
  liveIndicator: { flexDirection: "row", alignItems: "center", gap: scale(6) },
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
  timerContainer: { alignItems: "center", marginTop: verticalScale(24) },
  circleContainer: {
    width: moderateScale(220),
    height: moderateScale(220),
    justifyContent: "center",
    alignItems: "center",
  },
  svgCircle: { position: "absolute" },
  timerTextContainer: { justifyContent: "center", alignItems: "center" },
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
  goalSection: { marginTop: verticalScale(28), paddingHorizontal: scale(24) },
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
  goalRight: { flexDirection: "row", alignItems: "center", gap: scale(8) },
  goalValue: {
    fontSize: moderateScale(14),
    color: "#20DF60",
    fontWeight: "600",
  },
  editGoalBtn: {
    backgroundColor: "#20DF601A",
    borderWidth: 1,
    borderColor: "#20DF6033",
    borderRadius: moderateScale(12),
    padding: moderateScale(5),
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
  durationSection: { marginTop: verticalScale(28), alignItems: "center" },
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
  durationBtnActive: { backgroundColor: "#20DF60" },
  durationBtnText: {
    fontSize: moderateScale(14),
    color: "#94A3B8",
    fontWeight: "600",
  },
  durationBtnTextActive: { color: "#112116" },
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
  ambientBtnActive: { backgroundColor: "#20DF60", borderColor: "#20DF60" },
  ambientLabel: {
    fontSize: moderateScale(12),
    color: "#94A3B8",
    fontWeight: "500",
  },
  ambientLabelActive: { color: "#112116", fontWeight: "bold" },
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
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "#00000088",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    backgroundColor: "#1A2E1F",
    borderRadius: moderateScale(20),
    padding: moderateScale(24),
    width: "80%",
    borderWidth: 1,
    borderColor: "#20DF6033",
  },
  modalTitle: {
    fontSize: moderateScale(18),
    fontWeight: "bold",
    color: "#F1F5F9",
    marginBottom: verticalScale(6),
  },
  modalSubtitle: {
    fontSize: moderateScale(13),
    color: "#94A3B8",
    marginBottom: verticalScale(20),
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(10),
    marginBottom: verticalScale(24),
  },
  goalInputField: {
    flex: 1,
    backgroundColor: "#20DF600D",
    borderWidth: 1,
    borderColor: "#20DF6033",
    borderRadius: moderateScale(12),
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(12),
    fontSize: moderateScale(24),
    fontWeight: "bold",
    color: "#F1F5F9",
    textAlign: "center",
  },
  inputUnit: {
    fontSize: moderateScale(16),
    color: "#94A3B8",
    fontWeight: "600",
  },
  modalBtns: { flexDirection: "row", gap: scale(12) },
  modalCancel: {
    flex: 1,
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(12),
    backgroundColor: "#20DF600D",
    borderWidth: 1,
    borderColor: "#20DF601A",
    alignItems: "center",
  },
  modalCancelText: {
    color: "#94A3B8",
    fontWeight: "600",
    fontSize: moderateScale(14),
  },
  modalSave: {
    flex: 1,
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(12),
    backgroundColor: "#20DF60",
    alignItems: "center",
  },
  modalSaveText: {
    color: "#112116",
    fontWeight: "bold",
    fontSize: moderateScale(14),
  },
});
