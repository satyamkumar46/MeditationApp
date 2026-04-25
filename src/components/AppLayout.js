import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AppLayout({
  children,
  style,
  scroll = false,
  edges = ["top", "bottom"],
  backgroundColor = "#112116",
}) {
  const insets = useSafeAreaInsets();

  const paddingTop = edges.includes("top") ? insets.top : 0;
  const paddingBottom = edges.includes("bottom") ? insets.bottom : 0;

  if (scroll) {
    return (
      <ScrollView
        contentContainerStyle={[
          styles.container,
          {
            paddingTop,
            paddingBottom,
            backgroundColor,
          },
          style,
        ]}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    );
  }

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop,
          paddingBottom,
          backgroundColor,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
});
