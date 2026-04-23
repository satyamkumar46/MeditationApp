import { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  ImageBackground,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useDispatch, useSelector } from "react-redux";
import {
  addRecentPlay,
  toggleFavorite,
} from "../../features/slices/librarySlice";
import GlobalAudioManager from "../../services/GlobalAudioManager";
import { moderateScale, scale, verticalScale } from "../../utility/helpers";

const PlayerScreen = ({ navigation, route }) => {
  const track = route?.params?.track;
  const title = track?.title || "Unknown Track";
  const category = track?.catname || "Meditation";
  const audioUrl = track?.audioUrl;
  const thumbnailUri = track?.thumbnail;
  const teacherName = track?.teacher?.name || "";
  const teacherImage = track?.teacher?.image;

  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.library.favorites);
  const isLiked = track ? favorites.some((t) => t._id === track._id) : false;

  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [hasTrackedPlay, setHasTrackedPlay] = useState(false);

  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Playback status callback
  const onPlaybackStatusUpdate = useCallback(
    (status) => {
      if (status.isLoaded) {
        setCurrentTime(Math.floor(status.positionMillis / 1000));
        setTotalTime(Math.floor(status.durationMillis / 1000) || 0);
        setIsPlaying(status.isPlaying);

        if (status.isPlaying && !hasTrackedPlay && track) {
          dispatch(addRecentPlay(track));
          setHasTrackedPlay(true);
        }

        if (status.didJustFinish) {
          setIsPlaying(false);
          setCurrentTime(0);
        }
      }
    },
    [hasTrackedPlay, track, dispatch],
  );

  // Load audio via GlobalAudioManager
  useEffect(() => {
    if (!audioUrl || !track) {
      setIsLoading(false);
      return;
    }

    const loadTrack = async () => {
      setIsLoading(true);

      // Register our status callback
      GlobalAudioManager.setStatusCallback(onPlaybackStatusUpdate);

      // If same track is already loaded, just sync state
      if (GlobalAudioManager.getCurrentTrackId() === track._id) {
        const sound = GlobalAudioManager.getSound();
        if (sound) {
          try {
            const status = await sound.getStatusAsync();
            if (status.isLoaded) {
              setCurrentTime(Math.floor(status.positionMillis / 1000));
              setTotalTime(Math.floor(status.durationMillis / 1000) || 0);
              setIsPlaying(status.isPlaying);
            }
          } catch (err) {
            // ignore
          }
        }
        setIsLoading(false);
        return;
      }

      // Load new track (auto-play)
      const sound = await GlobalAudioManager.loadTrack(track, true);
      if (sound) {
        setHasTrackedPlay(false);
      }
      setIsLoading(false);
    };

    loadTrack();

    // On unmount: only remove the callback, do NOT stop the audio
    return () => {
      GlobalAudioManager.removeStatusCallback();
    };
  }, [audioUrl, track?._id]);

  // Pulse animation
  useEffect(() => {
    if (isPlaying) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.08,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isPlaying, pulseAnim]);

  // Play / Pause
  const togglePlayPause = async () => {
    await GlobalAudioManager.togglePlayPause();
  };

  // Skip forward 10s
  const skipForward = async () => {
    await GlobalAudioManager.skipForward(10000);
  };

  // Skip backward 10s
  const skipBackward = async () => {
    await GlobalAudioManager.skipBackward(10000);
  };

  // Seek on progress bar press
  const seekTo = async (event) => {
    if (totalTime === 0) return;
    try {
      const { locationX } = event.nativeEvent;
      const percent = Math.max(0, Math.min(locationX / 300, 1));
      const newPosition = Math.floor(percent * totalTime * 1000);
      await GlobalAudioManager.seekTo(newPosition);
    } catch (err) {
      console.error("Seek error:", err);
    }
  };

  // Navigate back — music keeps playing!
  const endSession = () => {
    navigation.goBack();
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const progressPercent = totalTime > 0 ? (currentTime / totalTime) * 100 : 0;
  const remaining = Math.max(totalTime - currentTime, 0);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <ImageBackground
        source={
          thumbnailUri
            ? { uri: thumbnailUri }
            : require("../../../assets/images/loader.png")
        }
        style={styles.backgroundImage}
        resizeMode="cover"
        blurRadius={8}
      >
        <View style={styles.overlay} />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={endSession} style={styles.headerBtn}>
            <Ionicons
              name="chevron-down"
              size={moderateScale(26)}
              color="#F1F5F9"
            />
          </TouchableOpacity>
          <Text style={styles.nowPlaying}>NOW PLAYING</Text>
          <TouchableOpacity style={styles.headerBtn}>
            <MaterialCommunityIcons
              name="dots-vertical"
              size={moderateScale(24)}
              color="#F1F5F9"
            />
          </TouchableOpacity>
        </View>

        {/* Album Art */}
        <View style={styles.artSection}>
          <Animated.View
            style={[styles.artContainer, { transform: [{ scale: pulseAnim }] }]}
          >
            <Image
              source={
                thumbnailUri
                  ? { uri: thumbnailUri }
                  : require("../../../assets/images/loader.png")
              }
              style={styles.artImage}
              resizeMode="cover"
            />
          </Animated.View>
        </View>

        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
          <Text style={styles.subtitle}>
            {category}
            {teacherName ? ` • ${teacherName}` : ""}
          </Text>
        </View>

        {/* Player Controls Card */}
        <View style={styles.playerCard}>
          {/* Progress */}
          <View style={styles.progressSection}>
            <View style={styles.timeRow}>
              <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
              <Text style={styles.timeText}>-{formatTime(remaining)}</Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={seekTo}
              style={styles.progressBarBg}
            >
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${progressPercent}%` },
                ]}
              />
              <View
                style={[styles.progressDot, { left: `${progressPercent}%` }]}
              />
            </TouchableOpacity>
          </View>

          {/* Loading indicator */}
          {isLoading && (
            <Text style={styles.loadingText}>Loading audio...</Text>
          )}

          {/* Controls */}
          <View style={styles.controlsRow}>
            <TouchableOpacity
              style={styles.secondaryControl}
              onPress={skipBackward}
            >
              <MaterialCommunityIcons
                name="rewind-10"
                size={moderateScale(28)}
                color="#F1F5F9"
              />
            </TouchableOpacity>

            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <TouchableOpacity
                style={[styles.playBtn, isLoading && { opacity: 0.5 }]}
                onPress={togglePlayPause}
                disabled={isLoading || !audioUrl}
              >
                <Feather
                  name={isPlaying ? "pause" : "play"}
                  size={moderateScale(32)}
                  color="#112116"
                  style={isPlaying ? {} : { marginLeft: scale(3) }}
                />
              </TouchableOpacity>
            </Animated.View>

            <TouchableOpacity
              style={styles.secondaryControl}
              onPress={skipForward}
            >
              <MaterialCommunityIcons
                name="fast-forward-10"
                size={moderateScale(28)}
                color="#F1F5F9"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom Actions */}
        <View style={styles.bottomSection}>
          {/* Teacher info */}
          {teacherName ? (
            <View style={styles.teacherRow}>
              {teacherImage && (
                <Image
                  source={{ uri: teacherImage }}
                  style={styles.teacherAvatar}
                />
              )}
              <View>
                <Text style={styles.teacherLabel}>GUIDED BY</Text>
                <Text style={styles.teacherNameText}>{teacherName}</Text>
              </View>
            </View>
          ) : null}

          {/* Action Row */}
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => track && dispatch(toggleFavorite(track))}
            >
              <Ionicons
                name={isLiked ? "heart" : "heart-outline"}
                size={moderateScale(24)}
                color={isLiked ? "#FF6B6B" : "#F1F5F9"}
              />
              <Text style={styles.actionLabel}>
                {isLiked ? "SAVED" : "SAVE"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => navigation.navigate("Timer")}
            >
              <MaterialCommunityIcons
                name="timer-outline"
                size={moderateScale(24)}
                color="#F1F5F9"
              />
              <Text style={styles.actionLabel}>SESSION</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionBtn}>
              <Feather
                name="share-2"
                size={moderateScale(22)}
                color="#F1F5F9"
              />
              <Text style={styles.actionLabel}>SHARE</Text>
            </TouchableOpacity>
          </View>

          {/* End Session */}
          <TouchableOpacity style={styles.endSessionBtn} onPress={endSession}>
            <Text style={styles.endSessionText}>End Session</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

export default PlayerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#112116",
  },
  backgroundImage: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(17, 33, 22, 0.65)",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: Platform.OS === "ios" ? verticalScale(60) : verticalScale(45),
    paddingHorizontal: scale(16),
  },
  headerBtn: {
    width: moderateScale(40),
    height: moderateScale(40),
    justifyContent: "center",
    alignItems: "center",
  },
  nowPlaying: {
    color: "#F1F5F9",
    fontSize: moderateScale(13),
    fontWeight: "bold",
    letterSpacing: 2,
  },
  artSection: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: verticalScale(20),
  },
  artContainer: {
    width: moderateScale(200),
    height: moderateScale(200),
    borderRadius: moderateScale(100),
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "#20DF6066",
    elevation: 10,
    shadowColor: "#20DF60",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  artImage: {
    width: "100%",
    height: "100%",
  },
  titleSection: {
    alignItems: "center",
    paddingHorizontal: scale(20),
    marginBottom: verticalScale(16),
  },
  title: {
    color: "#FFFFFF",
    fontSize: moderateScale(28),
    fontWeight: "bold",
    textAlign: "center",
    letterSpacing: -0.5,
    lineHeight: moderateScale(34),
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  subtitle: {
    color: "#CBD5E1",
    fontSize: moderateScale(14),
    textAlign: "center",
    marginTop: verticalScale(6),
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  playerCard: {
    marginHorizontal: scale(16),
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: moderateScale(20),
    paddingVertical: verticalScale(18),
    paddingHorizontal: scale(20),
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  progressSection: {
    marginBottom: verticalScale(16),
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: verticalScale(8),
  },
  timeText: {
    color: "#F1F5F9",
    fontSize: moderateScale(13),
    fontWeight: "600",
  },
  progressBarBg: {
    height: moderateScale(5),
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: moderateScale(3),
    overflow: "visible",
    position: "relative",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#20DF60",
    borderRadius: moderateScale(3),
  },
  progressDot: {
    position: "absolute",
    top: -moderateScale(4),
    width: moderateScale(13),
    height: moderateScale(13),
    borderRadius: moderateScale(7),
    backgroundColor: "#20DF60",
    marginLeft: -moderateScale(6),
    borderWidth: 2,
    borderColor: "#FFFFFF",
    elevation: 3,
  },
  loadingText: {
    color: "#20DF60",
    fontSize: moderateScale(12),
    textAlign: "center",
    marginBottom: verticalScale(8),
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  controlsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: scale(28),
  },
  secondaryControl: {
    width: moderateScale(48),
    height: moderateScale(48),
    justifyContent: "center",
    alignItems: "center",
  },
  playBtn: {
    width: moderateScale(72),
    height: moderateScale(72),
    borderRadius: moderateScale(36),
    backgroundColor: "#20DF60",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#20DF60",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  teacherRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(12),
    marginBottom: verticalScale(16),
    paddingHorizontal: scale(4),
  },
  teacherAvatar: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    borderWidth: 2,
    borderColor: "#20DF6033",
  },
  teacherLabel: {
    color: "#94A3B8",
    fontSize: moderateScale(10),
    fontWeight: "bold",
    letterSpacing: 1.2,
  },
  teacherNameText: {
    color: "#F1F5F9",
    fontSize: moderateScale(15),
    fontWeight: "bold",
    marginTop: verticalScale(1),
  },
  bottomSection: {
    paddingHorizontal: scale(16),
    paddingBottom:
      Platform.OS === "ios" ? verticalScale(40) : verticalScale(24),
    marginTop: "auto",
    paddingTop: verticalScale(16),
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: scale(40),
    marginBottom: verticalScale(20),
  },
  actionBtn: {
    alignItems: "center",
    gap: verticalScale(6),
  },
  actionLabel: {
    color: "#F1F5F9",
    fontSize: moderateScale(11),
    fontWeight: "600",
    letterSpacing: 1,
  },
  endSessionBtn: {
    height: verticalScale(50),
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: moderateScale(14),
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  endSessionText: {
    color: "#F1F5F9",
    fontSize: moderateScale(16),
    fontWeight: "bold",
  },
});
