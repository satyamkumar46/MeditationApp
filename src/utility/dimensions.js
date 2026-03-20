import { Dimensions } from "react-native";

const { height, width } = Dimensions.get("window");

export const SCREEN_HEIGHT = height;
export const SCREEN_WIDTH = width;

export const scale = (size) => (width / 375) * size;
export const VerticalScale = (size) => (height / 375) * size;
