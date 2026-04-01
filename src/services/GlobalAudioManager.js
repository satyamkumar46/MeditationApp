import { Audio } from "expo-av";

/**
 * Global Audio Manager
 *
 * Manages a single audio instance that persists across screen navigations.
 * Music keeps playing when leaving PlayerScreen and only stops when:
 *  - User explicitly pauses
 *  - User plays a different track
 *  - Track finishes
 */

let currentSound = null;
let currentTrackId = null;
let statusCallback = null;
let isPlayerMounted = false;

const GlobalAudioManager = {
  /**
   * Load and optionally play a track.
   * If the same track is already loaded, just returns it.
   */
  async loadTrack(track, shouldPlay = false) {
    // If same track is already loaded, return existing sound
    if (currentTrackId === track._id && currentSound) {
      return currentSound;
    }

    // Unload previous track
    await this.unloadCurrent();

    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      const { sound } = await Audio.Sound.createAsync(
        { uri: track.audioUrl },
        { shouldPlay },
        (status) => {
          // Forward status to the mounted PlayerScreen (if any)
          if (statusCallback) {
            statusCallback(status);
          }
        }
      );

      currentSound = sound;
      currentTrackId = track._id;
      return sound;
    } catch (err) {
      console.error("GlobalAudioManager: Failed to load track:", err);
      return null;
    }
  },

  /** Play the current track */
  async play() {
    if (!currentSound) return;
    try {
      const status = await currentSound.getStatusAsync();
      if (
        status.didJustFinish ||
        status.positionMillis >= status.durationMillis
      ) {
        await currentSound.setPositionAsync(0);
      }
      await currentSound.playAsync();
    } catch (err) {
      console.error("GlobalAudioManager: Play error:", err);
    }
  },

  /** Pause the current track */
  async pause() {
    if (!currentSound) return;
    try {
      await currentSound.pauseAsync();
    } catch (err) {
      console.error("GlobalAudioManager: Pause error:", err);
    }
  },

  /** Toggle play/pause */
  async togglePlayPause() {
    if (!currentSound) return;
    try {
      const status = await currentSound.getStatusAsync();
      if (status.isPlaying) {
        await this.pause();
      } else {
        await this.play();
      }
    } catch (err) {
      console.error("GlobalAudioManager: Toggle error:", err);
    }
  },

  /** Skip forward by ms */
  async skipForward(ms = 10000) {
    if (!currentSound) return;
    try {
      const status = await currentSound.getStatusAsync();
      const newPos = Math.min(
        status.positionMillis + ms,
        status.durationMillis
      );
      await currentSound.setPositionAsync(newPos);
    } catch (err) {
      console.error("GlobalAudioManager: Skip forward error:", err);
    }
  },

  /** Skip backward by ms */
  async skipBackward(ms = 10000) {
    if (!currentSound) return;
    try {
      const status = await currentSound.getStatusAsync();
      const newPos = Math.max(status.positionMillis - ms, 0);
      await currentSound.setPositionAsync(newPos);
    } catch (err) {
      console.error("GlobalAudioManager: Skip backward error:", err);
    }
  },

  /** Seek to a position in ms */
  async seekTo(positionMs) {
    if (!currentSound) return;
    try {
      await currentSound.setPositionAsync(positionMs);
    } catch (err) {
      console.error("GlobalAudioManager: Seek error:", err);
    }
  },

  /** Unload the current track */
  async unloadCurrent() {
    if (currentSound) {
      try {
        await currentSound.stopAsync();
        await currentSound.unloadAsync();
      } catch (err) {
        // ignore
      }
      currentSound = null;
      currentTrackId = null;
    }
  },

  /** Set the status update callback (PlayerScreen sets this on mount) */
  setStatusCallback(cb) {
    statusCallback = cb;
  },

  /** Remove the status callback (PlayerScreen calls this on unmount) */
  removeStatusCallback() {
    statusCallback = null;
  },

  /** Get the currently loaded track ID */
  getCurrentTrackId() {
    return currentTrackId;
  },

  /** Get the sound object */
  getSound() {
    return currentSound;
  },

  /** Check if a track is currently playing */
  async isPlaying() {
    if (!currentSound) return false;
    try {
      const status = await currentSound.getStatusAsync();
      return status.isPlaying;
    } catch {
      return false;
    }
  },
};

export default GlobalAudioManager;
