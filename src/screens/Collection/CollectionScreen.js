import {
  ActivityIndicator,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";
import useSounds from "../../hooks/useSounds";
import { moderateScale, scale, verticalScale } from "../../utility/helpers";

const CollectionScreen = ({ navigation }) => {
  const { categories, loading } = useSounds();

  if (loading) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="#20DF60" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#112116" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Ionicons
            name="arrow-back"
            size={moderateScale(24)}
            color="#20DF60"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Popular Collection</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Ionicons
          name="search"
          size={moderateScale(18)}
          color="#20DF6066"
          style={styles.searchIcon}
        />
        <TextInput
          placeholder="Search meditations..."
          placeholderTextColor="#20DF6066"
          style={styles.searchInput}
        />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Featured Category (first category as hero) */}
        {categories.length > 0 && (
          <TouchableOpacity
            style={styles.heroCard}
            onPress={() =>
              navigation.navigate("CategoryDetail", {
                category: categories[0].catname,
                categoryData: categories[0],
              })
            }
          >
            <Image
              source={
                categories[0].tracks?.[0]?.thumbnail
                  ? { uri: categories[0].tracks[0].thumbnail }
                  : require("../../assest/images/morning-calm-image.png")
              }
              style={styles.heroImage}
              resizeMode="cover"
            />
            <View style={styles.heroOverlay} />
            <View style={styles.heroContent}>
              <View style={styles.badgeContainer}>
                <Text style={styles.badgeText}>FEATURED</Text>
              </View>
              <Text style={styles.heroTitle}>{categories[0].catname}</Text>
              <Text style={styles.heroMeta}>
                {categories[0].tracks?.length || 0} Tracks • Curated Collection
              </Text>
              <TouchableOpacity style={styles.ctaBtn}>
                <Feather
                  name="play"
                  size={moderateScale(14)}
                  color="#112116"
                />
                <Text style={styles.ctaBtnText}>Explore</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}

        {/* All Categories Grid */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>All Categories</Text>
          <Text style={styles.countText}>
            {categories.length} COLLECTIONS
          </Text>
        </View>

        {/* Wide cards for first 2 categories */}
        {categories.slice(1, 3).map((cat) => (
          <TouchableOpacity
            key={cat._id}
            style={styles.wideCard}
            onPress={() =>
              navigation.navigate("CategoryDetail", {
                category: cat.catname,
                categoryData: cat,
              })
            }
          >
            <Image
              source={
                cat.tracks?.[0]?.thumbnail
                  ? { uri: cat.tracks[0].thumbnail }
                  : require("../../assest/images/deep-wood-image.png")
              }
              style={styles.wideCardImage}
              resizeMode="cover"
            />
            <View style={styles.wideCardOverlay} />
            <View style={styles.wideCardContent}>
              <View style={styles.badgeContainer}>
                <Text style={styles.badgeText}>
                  {cat.catname.toUpperCase()}
                </Text>
              </View>
              <Text style={styles.wideCardTitle}>{cat.catname}</Text>
              <Text style={styles.wideCardMeta}>
                {cat.tracks?.length || 0} Tracks
              </Text>
            </View>
            <TouchableOpacity style={styles.wideCardPlayBtn}>
              <Feather
                name="play"
                size={moderateScale(18)}
                color="#20DF60"
              />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}

        {/* Tall cards for next 2 */}
        {categories.slice(3, 5).map((cat) => (
          <TouchableOpacity
            key={cat._id}
            style={styles.tallCard}
            onPress={() =>
              navigation.navigate("CategoryDetail", {
                category: cat.catname,
                categoryData: cat,
              })
            }
          >
            <Image
              source={
                cat.tracks?.[0]?.thumbnail
                  ? { uri: cat.tracks[0].thumbnail }
                  : require("../../assest/images/forest-hero.png")
              }
              style={styles.tallCardImage}
              resizeMode="cover"
            />
            <View style={styles.tallCardOverlay} />
            <View style={styles.tallCardContent}>
              <View style={styles.badgeContainer}>
                <Text style={styles.badgeText}>
                  {cat.catname.toUpperCase()}
                </Text>
              </View>
              <Text style={styles.tallCardTitle}>{cat.catname}</Text>
              <Text style={styles.tallCardMeta}>
                {cat.tracks?.length || 0} Tracks
              </Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* Grid cards for remaining */}
        {categories.length > 5 && (
          <>
            <View
              style={[styles.sectionHeader, { marginTop: verticalScale(24) }]}
            >
              <Text style={styles.sectionTitle}>More Collections</Text>
            </View>

            <View style={styles.gridContainer}>
              {categories.slice(5).map((cat) => (
                <TouchableOpacity
                  key={cat._id}
                  style={styles.gridCard}
                  onPress={() =>
                    navigation.navigate("CategoryDetail", {
                      category: cat.catname,
                      categoryData: cat,
                    })
                  }
                >
                  <View style={styles.gridImageContainer}>
                    <Image
                      source={
                        cat.tracks?.[0]?.thumbnail
                          ? { uri: cat.tracks[0].thumbnail }
                          : require("../../assest/images/mountain-image.png")
                      }
                      style={styles.gridImage}
                      resizeMode="cover"
                    />
                    <View style={styles.gridOverlay} />
                    <View style={styles.gridBadge}>
                      <Feather
                        name="play"
                        size={moderateScale(14)}
                        color="#20DF60"
                      />
                    </View>
                  </View>
                  <Text style={styles.gridTitle} numberOfLines={1}>
                    {cat.catname}
                  </Text>
                  <Text style={styles.gridSessions}>
                    {cat.tracks?.length || 0} TRACKS
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default CollectionScreen;

const styles = StyleSheet.create({
  loadingScreen: {
    flex: 1,
    backgroundColor: "#112116",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#112116",
  },
  header: {
    paddingTop: Platform.OS === "ios" ? verticalScale(60) : verticalScale(45),
    paddingHorizontal: scale(16),
    paddingBottom: verticalScale(10),
    flexDirection: "row",
    alignItems: "center",
    gap: scale(12),
  },
  backBtn: {
    width: moderateScale(36),
    height: moderateScale(36),
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: moderateScale(22),
    fontWeight: "bold",
    color: "#F1F5F9",
  },
  searchBar: {
    marginHorizontal: scale(16),
    height: verticalScale(42),
    backgroundColor: "#20DF601A",
    borderRadius: moderateScale(25),
    borderWidth: 1,
    borderColor: "#20DF6033",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: scale(14),
    marginBottom: verticalScale(8),
  },
  searchIcon: {
    marginRight: scale(8),
  },
  searchInput: {
    flex: 1,
    fontSize: moderateScale(14),
    color: "#F1F5F9",
  },
  scrollContent: {
    paddingBottom: verticalScale(40),
    paddingHorizontal: scale(16),
  },

  /* Hero */
  heroCard: {
    borderRadius: moderateScale(16),
    overflow: "hidden",
    marginTop: verticalScale(10),
    marginBottom: verticalScale(10),
  },
  heroImage: {
    width: "100%",
    height: verticalScale(220),
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(17, 33, 22, 0.45)",
  },
  heroContent: {
    position: "absolute",
    bottom: verticalScale(16),
    left: scale(16),
    right: scale(16),
  },
  heroTitle: {
    color: "#FFFFFF",
    fontSize: moderateScale(26),
    fontWeight: "bold",
    letterSpacing: -0.5,
  },
  heroMeta: {
    color: "#CBD5E1",
    fontSize: moderateScale(13),
    marginTop: verticalScale(4),
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: verticalScale(16),
    marginBottom: verticalScale(14),
  },
  sectionTitle: {
    color: "#F1F5F9",
    fontSize: moderateScale(20),
    fontWeight: "bold",
  },
  countText: {
    color: "#20DF60",
    fontSize: moderateScale(13),
    fontWeight: "bold",
    letterSpacing: 0.5,
  },

  /* Badge */
  badgeContainer: {
    backgroundColor: "#20DF6033",
    borderWidth: 1,
    borderColor: "#20DF6066",
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(2),
    borderRadius: moderateScale(6),
    alignSelf: "flex-start",
    marginBottom: verticalScale(6),
  },
  badgeText: {
    color: "#20DF60",
    fontSize: moderateScale(9),
    fontWeight: "bold",
    letterSpacing: 1.2,
  },

  /* CTA */
  ctaBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#20DF60",
    paddingHorizontal: scale(14),
    paddingVertical: verticalScale(8),
    borderRadius: moderateScale(20),
    alignSelf: "flex-start",
    marginTop: verticalScale(10),
    gap: scale(6),
  },
  ctaBtnText: {
    color: "#112116",
    fontSize: moderateScale(13),
    fontWeight: "bold",
  },

  /* Wide Cards */
  wideCard: {
    height: verticalScale(130),
    borderRadius: moderateScale(16),
    overflow: "hidden",
    marginBottom: verticalScale(12),
    position: "relative",
  },
  wideCardImage: {
    width: "100%",
    height: "100%",
  },
  wideCardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(17, 33, 22, 0.45)",
  },
  wideCardContent: {
    position: "absolute",
    bottom: verticalScale(14),
    left: scale(14),
    right: scale(14),
  },
  wideCardTitle: {
    color: "#FFFFFF",
    fontSize: moderateScale(18),
    fontWeight: "bold",
  },
  wideCardMeta: {
    color: "#CBD5E1",
    fontSize: moderateScale(12),
    marginTop: verticalScale(2),
  },
  wideCardPlayBtn: {
    position: "absolute",
    right: scale(14),
    bottom: verticalScale(14),
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: "rgba(32, 223, 96, 0.15)",
    borderWidth: 1,
    borderColor: "#20DF6066",
    justifyContent: "center",
    alignItems: "center",
  },

  /* Tall Cards */
  tallCard: {
    height: verticalScale(200),
    borderRadius: moderateScale(16),
    overflow: "hidden",
    marginBottom: verticalScale(12),
    position: "relative",
  },
  tallCardImage: {
    width: "100%",
    height: "100%",
  },
  tallCardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(17, 33, 22, 0.45)",
  },
  tallCardContent: {
    position: "absolute",
    bottom: verticalScale(16),
    left: scale(14),
    right: scale(14),
  },
  tallCardTitle: {
    color: "#FFFFFF",
    fontSize: moderateScale(20),
    fontWeight: "bold",
  },
  tallCardMeta: {
    color: "#CBD5E1",
    fontSize: moderateScale(12),
    marginTop: verticalScale(2),
  },

  /* Grid Cards */
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: verticalScale(14),
  },
  gridCard: {
    width: "47%",
  },
  gridImageContainer: {
    width: "100%",
    height: verticalScale(110),
    borderRadius: moderateScale(14),
    overflow: "hidden",
    position: "relative",
  },
  gridImage: {
    width: "100%",
    height: "100%",
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(17, 33, 22, 0.3)",
  },
  gridBadge: {
    position: "absolute",
    bottom: moderateScale(8),
    right: moderateScale(8),
    width: moderateScale(32),
    height: moderateScale(32),
    borderRadius: moderateScale(16),
    backgroundColor: "#20DF601A",
    borderWidth: 1,
    borderColor: "#20DF6066",
    justifyContent: "center",
    alignItems: "center",
  },
  gridTitle: {
    color: "#F1F5F9",
    fontSize: moderateScale(14),
    fontWeight: "bold",
    marginTop: verticalScale(8),
  },
  gridSessions: {
    color: "#94A3B8",
    fontSize: moderateScale(11),
    fontWeight: "500",
    letterSpacing: 0.5,
    marginTop: verticalScale(2),
  },
});
