import {
  Alert,
  Linking,
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
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { moderateScale, scale, verticalScale } from "../../utility/helpers";

const FAQ_CATEGORIES = [
  {
    id: 1,
    icon: "person-outline",
    iconLib: "Ionicons",
    title: "Account",
    subtitle: "Profile, privacy, security",
  },
  {
    id: 2,
    icon: "chatbox-ellipses-outline",
    iconLib: "Ionicons",
    title: "Subscription",
    subtitle: "Billing, plans, refunds",
  },
  {
    id: 3,
    icon: "flower-outline",
    iconLib: "Ionicons",
    title: "Meditation Basics",
    subtitle: "How to start, techniques",
  },
  {
    id: 4,
    icon: "phone-portrait-outline",
    iconLib: "Ionicons",
    title: "Technical Issues",
    subtitle: "App crashes, audio, sync",
  },
];

const COMMON_QUESTIONS = [
  "How do I cancel my trial?",
  "Can I use the app offline?",
  "Resetting my password",
];

const contactSupport = () => {
  const email = "reactnative158@gmail.com";
  const subject = "Support Request - Meditation App";
  const body = "Hi,\n\nI need help with:\n";

  const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  Linking.canOpenURL(url)
    .then((supported) => {
      if (!supported) {
        Alert.alert("Error", "No email app found");
      } else {
        return Linking.openURL(url);
      }
    })
    .catch((err) => console.error(err));
};

const SupportScreen = ({ navigation }) => {
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
            color="#F1F5F9"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Support</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* How can we help */}
        <View style={styles.helpSection}>
          <Text style={styles.helpTitle}>How can we help?</Text>
          <Text style={styles.helpSubtitle}>
            Search our knowledge base for instant answers.
          </Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Ionicons
            name="search"
            size={moderateScale(20)}
            color="#20DF60"
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Search for articles..."
            placeholderTextColor="#20DF6066"
            style={styles.searchInput}
          />
        </View>

        {/* FAQ Categories */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionLabel}>FAQ CATEGORIES</Text>
          {FAQ_CATEGORIES.map((cat) => (
            <TouchableOpacity key={cat.id} style={styles.faqCard}>
              <View style={styles.faqIconContainer}>
                <Ionicons
                  name={cat.icon}
                  size={moderateScale(22)}
                  color="#20DF60"
                />
              </View>
              <View style={styles.faqInfo}>
                <Text style={styles.faqTitle}>{cat.title}</Text>
                <Text style={styles.faqSubtitle}>{cat.subtitle}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Common Questions */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionLabel}>COMMON QUESTIONS</Text>
          {COMMON_QUESTIONS.map((q, idx) => (
            <TouchableOpacity key={idx} style={styles.questionRow}>
              <Text style={styles.questionText}>{q}</Text>
              <Ionicons
                name="chevron-forward"
                size={moderateScale(20)}
                color="#94A3B8"
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Still need help */}
        <View style={styles.helpCard}>
          <Text style={styles.helpCardTitle}>Still need help?</Text>
          <Text style={styles.helpCardSubtitle}>
            Our sanctuary specialists are available to guide you through any
            difficulties.
          </Text>

          <TouchableOpacity style={styles.emailBtn} onPress={contactSupport}>
            <MaterialCommunityIcons
              name="email-outline"
              size={moderateScale(20)}
              color="#112116"
            />
            <Text style={styles.emailBtnText}>Email Support</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.chatBtn}>
            <Feather
              name="message-square"
              size={moderateScale(20)}
              color="#F1F5F9"
            />
            <Text style={styles.chatBtnText}>Live Chat</Text>
          </TouchableOpacity>

          <Text style={styles.responseTime}>
            TYPICAL RESPONSE TIME:{" "}
            <Text style={styles.responseHighlight}>2 HOURS</Text>
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default SupportScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#112116",
  },
  header: {
    paddingTop: Platform.OS === "ios" ? verticalScale(60) : verticalScale(45),
    paddingHorizontal: scale(16),
    paddingBottom: verticalScale(12),
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
    fontSize: moderateScale(24),
    fontWeight: "bold",
    color: "#F1F5F9",
  },
  scrollContent: {
    paddingBottom: verticalScale(40),
  },
  helpSection: {
    paddingHorizontal: scale(16),
    marginTop: verticalScale(8),
  },
  helpTitle: {
    fontSize: moderateScale(22),
    fontWeight: "bold",
    color: "#F1F5F9",
    lineHeight: moderateScale(28),
  },
  helpSubtitle: {
    fontSize: moderateScale(14),
    color: "#94A3B8",
    marginTop: verticalScale(4),
  },
  searchBar: {
    marginHorizontal: scale(16),
    marginTop: verticalScale(16),
    height: verticalScale(46),
    backgroundColor: "#20DF601A",
    borderRadius: moderateScale(25),
    borderWidth: 1,
    borderColor: "#20DF6033",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: scale(16),
  },
  searchIcon: {
    marginRight: scale(10),
  },
  searchInput: {
    flex: 1,
    fontSize: moderateScale(14),
    color: "#F1F5F9",
  },
  sectionContainer: {
    marginTop: verticalScale(24),
    paddingHorizontal: scale(16),
  },
  sectionLabel: {
    fontSize: moderateScale(12),
    fontWeight: "bold",
    letterSpacing: 1.2,
    color: "#94A3B8",
    marginBottom: verticalScale(12),
  },
  faqCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#20DF600D",
    borderRadius: moderateScale(14),
    paddingVertical: verticalScale(14),
    paddingHorizontal: scale(14),
    marginBottom: verticalScale(10),
    borderWidth: 1,
    borderColor: "#20DF601A",
  },
  faqIconContainer: {
    width: moderateScale(44),
    height: moderateScale(44),
    borderRadius: moderateScale(22),
    backgroundColor: "#20DF601A",
    justifyContent: "center",
    alignItems: "center",
  },
  faqInfo: {
    flex: 1,
    marginLeft: scale(14),
  },
  faqTitle: {
    fontSize: moderateScale(16),
    fontWeight: "bold",
    color: "#F1F5F9",
  },
  faqSubtitle: {
    fontSize: moderateScale(13),
    color: "#94A3B8",
    marginTop: verticalScale(2),
  },
  questionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: verticalScale(14),
    borderBottomWidth: 1,
    borderBottomColor: "#20DF600D",
  },
  questionText: {
    fontSize: moderateScale(15),
    color: "#F1F5F9",
    flex: 1,
  },
  helpCard: {
    marginHorizontal: scale(16),
    marginTop: verticalScale(30),
    backgroundColor: "#20DF600D",
    borderRadius: moderateScale(16),
    borderWidth: 1,
    borderColor: "#20DF601A",
    paddingVertical: verticalScale(24),
    paddingHorizontal: scale(20),
    alignItems: "center",
  },
  helpCardTitle: {
    fontSize: moderateScale(20),
    fontWeight: "bold",
    color: "#F1F5F9",
    textAlign: "center",
  },
  helpCardSubtitle: {
    fontSize: moderateScale(14),
    color: "#94A3B8",
    textAlign: "center",
    marginTop: verticalScale(8),
    lineHeight: moderateScale(20),
  },
  emailBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#20DF60",
    borderRadius: moderateScale(25),
    height: verticalScale(46),
    width: "100%",
    marginTop: verticalScale(20),
    gap: scale(8),
  },
  emailBtnText: {
    color: "#112116",
    fontSize: moderateScale(16),
    fontWeight: "bold",
  },
  chatBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    borderRadius: moderateScale(25),
    height: verticalScale(46),
    width: "100%",
    marginTop: verticalScale(10),
    gap: scale(8),
    borderWidth: 1,
    borderColor: "#94A3B8",
  },
  chatBtnText: {
    color: "#F1F5F9",
    fontSize: moderateScale(16),
    fontWeight: "bold",
  },
  responseTime: {
    fontSize: moderateScale(11),
    color: "#94A3B8",
    letterSpacing: 1,
    marginTop: verticalScale(16),
    fontWeight: "500",
  },
  responseHighlight: {
    color: "#20DF60",
    fontWeight: "bold",
  },
});
