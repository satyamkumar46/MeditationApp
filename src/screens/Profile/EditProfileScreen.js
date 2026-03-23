import { useState } from "react";
import {
    Dimensions,
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
import Ionicons from "react-native-vector-icons/Ionicons";

// Base design dimensions (iPhone 14 Pro)
const BASE_WIDTH = 390;
const BASE_HEIGHT = 844;

// Responsive scaling helpers
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const scale = (size) => (SCREEN_WIDTH / BASE_WIDTH) * size;
const verticalScale = (size) => (SCREEN_HEIGHT / BASE_HEIGHT) * size;
const moderateScale = (size, factor = 0.5) =>
  size + (scale(size) - size) * factor;

const EditProfileScreen = ({ navigation }) => {
  const [name, setName] = useState();
  const [email, setEmail] = useState("alex.rivers@meditation.com");
  const [bio, setBio] = useState(
    "Finding peace in the daily rhythm of life.\nFocused on mindfulness and breathwork.",
  );

  const handleSave = () => {
    // Save logic here
    navigation?.goBack?.();
  };

  const handleCancel = () => {
    navigation?.goBack?.();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#112116" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerIconBtn}
          onPress={() => navigation?.goBack?.()}
        >
          <Ionicons
            name="arrow-back"
            size={moderateScale(22)}
            color="#F1F5F9"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={styles.headerIconBtn} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={require("../../assest/images/face.jpg")}
              style={styles.avatar}
            />
            {/* Camera badge */}
            <View style={styles.cameraBadge}>
              <Ionicons
                name="camera"
                size={moderateScale(14)}
                color="#F1F5F9"
              />
            </View>
          </View>
          <TouchableOpacity>
            <Text style={styles.changePhotoText}>Change Photo</Text>
          </TouchableOpacity>
        </View>

        {/* Name Field */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Name</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={name}
              onChangeText={setName}
              placeholderTextColor="#F1F5F940"
              placeholder="Enter your name"
            />
          </View>
        </View>

        {/* Email Field */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Email</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={email}
              onChangeText={setEmail}
              placeholderTextColor="#F1F5F940"
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        {/* Bio Field */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Bio</Text>
          <View style={[styles.inputContainer, styles.bioInputContainer]}>
            <TextInput
              style={[styles.textInput, styles.bioInput]}
              value={bio}
              onChangeText={setBio}
              placeholderTextColor="#F1F5F940"
              placeholder="Tell us about yourself"
              multiline
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Save Changes</Text>
        </TouchableOpacity>

        {/* Cancel Button */}
        <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
          <Text style={styles.cancelBtnText}>Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#112116",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: Platform.OS === "ios" ? verticalScale(60) : verticalScale(45),
    paddingHorizontal: scale(20),
    paddingBottom: verticalScale(10),
  },
  headerIconBtn: {
    width: moderateScale(40),
    height: moderateScale(40),
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    color: "#F1F5F9",
    fontSize: moderateScale(20),
    fontWeight: "bold",
  },
  scrollContent: {
    paddingBottom: verticalScale(40),
    paddingHorizontal: scale(20),
  },
  avatarSection: {
    alignItems: "center",
    paddingTop: verticalScale(20),
    paddingBottom: verticalScale(24),
  },
  avatarContainer: {
    width: moderateScale(120),
    height: moderateScale(120),
    borderRadius: moderateScale(60),
    borderWidth: 3,
    borderColor: "#20DF6040",
    backgroundColor: "#1a3a25",
    overflow: "hidden",
    marginBottom: verticalScale(12),
    position: "relative",
  },
  avatar: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  cameraBadge: {
    position: "absolute",
    bottom: moderateScale(4),
    right: moderateScale(4),
    width: moderateScale(32),
    height: moderateScale(32),
    borderRadius: moderateScale(16),
    backgroundColor: "#20DF60",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#112116",
  },
  changePhotoText: {
    color: "#20DF60",
    fontSize: moderateScale(14),
    fontWeight: "600",
  },
  fieldContainer: {
    marginBottom: verticalScale(20),
  },
  fieldLabel: {
    color: "#F1F5F999",
    fontSize: moderateScale(13),
    fontWeight: "500",
    marginBottom: verticalScale(8),
  },
  inputContainer: {
    backgroundColor: "#0D3320",
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: "#20DF6030",
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(14),
  },
  textInput: {
    color: "#F1F5F9",
    fontSize: moderateScale(16),
    fontWeight: "400",
    padding: 0,
    margin: 0,
  },
  bioInputContainer: {
    minHeight: verticalScale(100),
    paddingVertical: verticalScale(14),
  },
  bioInput: {
    minHeight: verticalScale(80),
    lineHeight: moderateScale(22),
  },
  saveBtn: {
    backgroundColor: "#20DF60",
    borderRadius: moderateScale(14),
    paddingVertical: verticalScale(16),
    alignItems: "center",
    marginTop: verticalScale(16),
    marginBottom: verticalScale(14),
  },
  saveBtnText: {
    color: "#112116",
    fontSize: moderateScale(17),
    fontWeight: "bold",
  },
  cancelBtn: {
    alignItems: "center",
    paddingVertical: verticalScale(10),
  },
  cancelBtnText: {
    color: "#F1F5F999",
    fontSize: moderateScale(16),
    fontWeight: "500",
  },
});
