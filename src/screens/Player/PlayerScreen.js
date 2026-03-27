import { useState, useRef, useEffect } from "react";
import {
  Animated,
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
import { moderateScale, scale, verticalScale } from "../../utility/helpers";

const PlayerScreen = ({ navigation, route }) => {
  const title = route?.params?.title || "Inner Peace";
  const category = route?.params?.category || "Guided Mindfulness";
  const duration = route?.params?.duration || "15:00";

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(315); // 5:15 in seconds
  const totalTime = 900; // 15:00 in seconds

  const pulseAnim = useRef(new Animated.Value(1)).current;

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
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isPlaying, pulseAnim]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const progressPercent = (currentTime / totalTime) * 100;
  const remaining = totalTime - currentTime;

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <ImageBackground
        source={require("../../assest/images/forest-hero.png")}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay} />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.headerBtn}
          >
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

        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>
            {category} • {duration}
          </Text>
        </View>

        {/* Player Controls Card */}
        <View style={styles.playerCard}>
          {/* Progress */}
          <View style={styles.progressSection}>
            <View style={styles.timeRow}>
              <Text style={styles.timeText}>
                {formatTime(currentTime)}
              </Text>
              <Text style={styles.timeText}>
                -{formatTime(remaining)}
              </Text>
            </View>
            <View style={styles.progressBarBg}>
              <View
                style={[styles.progressBarFill, { width: `${progressPercent}%` }]}
              />
            </View>
          </View>

          {/* Controls */}
          <View style={styles.controlsRow}>
            <TouchableOpacity style={styles.secondaryControl}>
              <MaterialCommunityIcons
                name="rewind-10"
                size={moderateScale(28)}
                color="#F1F5F9"
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryControl}>
              <Ionicons
                name="play-skip-back"
                size={moderateScale(26)}
                color="#F1F5F9"
              />
            </TouchableOpacity>

            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <TouchableOpacity
                style={styles.playBtn}
                onPress={() => setIsPlaying(!isPlaying)}
              >
                <Feather
                  name={isPlaying ? "pause" : "play"}
                  size={moderateScale(32)}
                  color="#112116"
                  style={isPlaying ? {} : { marginLeft: scale(3) }}
                />
              </TouchableOpacity>
            </Animated.View>

            <TouchableOpacity style={styles.secondaryControl}>
              <Ionicons
                name="play-skip-forward"
                size={moderateScale(26)}
                color="#F1F5F9"
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryControl}>
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
          {/* Action Row */}
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.actionBtn}>
              <Ionicons
                name="heart-outline"
                size={moderateScale(24)}
                color="#F1F5F9"
              />
              <Text style={styles.actionLabel}>SAVE</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionBtn}>
              <MaterialCommunityIcons
                name="timer-outline"
                size={moderateScale(24)}
                color="#F1F5F9"
              />
              <Text style={styles.actionLabel}>TIMER</Text>
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
          <TouchableOpacity
            style={styles.endSessionBtn}
            onPress={() => navigation.goBack()}
          >
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
    backgroundColor: "rgba(17, 33, 22, 0.35)",
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
  titleSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: scale(20),
  },
  title: {
    color: "#FFFFFF",
    fontSize: moderateScale(36),
    fontWeight: "bold",
    textAlign: "center",
    letterSpacing: -1,
    lineHeight: moderateScale(44),
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  subtitle: {
    color: "#CBD5E1",
    fontSize: moderateScale(16),
    textAlign: "center",
    marginTop: verticalScale(8),
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  playerCard: {
    marginHorizontal: scale(16),
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: moderateScale(20),
    paddingVertical: verticalScale(20),
    paddingHorizontal: scale(20),
    backdropFilter: "blur(10px)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  progressSection: {
    marginBottom: verticalScale(20),
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: verticalScale(8),
  },
  timeText: {
    color: "#F1F5F9",
    fontSize: moderateScale(14),
    fontWeight: "600",
  },
  progressBarBg: {
    height: moderateScale(5),
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: moderateScale(3),
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#20DF60",
    borderRadius: moderateScale(3),
  },
  controlsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: scale(16),
  },
  secondaryControl: {
    width: moderateScale(44),
    height: moderateScale(44),
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
  bottomSection: {
    paddingHorizontal: scale(16),
    paddingBottom: Platform.OS === "ios" ? verticalScale(40) : verticalScale(24),
    marginTop: "auto",
    paddingTop: verticalScale(20),
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: scale(40),
    marginBottom: verticalScale(24),
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
