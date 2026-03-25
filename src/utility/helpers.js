import { useCallback } from "react";
import { Dimensions, useWindowDimensions } from "react-native";

// --- Dynamic helpers (read dimensions at call time) ---
// These will return correct values on each call, but won't trigger
// re-renders on their own. Use them for inline styles computed during render.

export const getScreenWidth = () => Dimensions.get("window").width;
export const getScreenHeight = () => Dimensions.get("window").height;

export const scale = (size) => (getScreenWidth() / 390) * size;
export const verticalScale = (size) => (getScreenHeight() / 844) * size;
export const moderateScale = (size, factor = 0.5) =>
  size + (scale(size) - size) * factor;

// --- Reactive hook (triggers re-render on rotation) ---
// Use this inside components for full rotation support.
// Returns { width, height, scale, verticalScale, moderateScale }

export const useScaling = () => {
  const { width, height } = useWindowDimensions();

  const s = useCallback(
    (size) => (width / 390) * size,
    [width],
  );

  const vs = useCallback(
    (size) => (height / 844) * size,
    [height],
  );

  const ms = useCallback(
    (size, factor = 0.5) => size + (s(size) - size) * factor,
    [s],
  );

  return {
    width,
    height,
    scale: s,
    verticalScale: vs,
    moderateScale: ms,
  };
};
