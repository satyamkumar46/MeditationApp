import { useCallback } from "react";
import { Dimensions, useWindowDimensions } from "react-native";

export const getScreenWidth = () => Dimensions.get("window").width;
export const getScreenHeight = () => Dimensions.get("window").height;

export const scale = (size) => (getScreenWidth() / 390) * size;
export const verticalScale = (size) => (getScreenHeight() / 844) * size;
export const moderateScale = (size, factor = 0.5) =>
  size + (scale(size) - size) * factor;

export const useScaling = () => {
  const { width, height } = useWindowDimensions();

  const s = useCallback((size) => (width / 390) * size, [width]);

  const vs = useCallback((size) => (height / 844) * size, [height]);

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
