import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
  Alert,
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
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../../features/slices/userSlice";
import { updateProfileApi } from "../../services/userService";
import { getUserFromCache, saveUserToCache } from "../../utility/cache";
import { moderateScale, scale, verticalScale } from "../../utility/helpers";

const EditProfileScreen = ({ navigation }) => {
  const [inputName, setInputName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const dispatch = useDispatch();

  const profileImage = useSelector((state) => state.user.profileImage);

  const user = useSelector((state) => state.user);

  const openGallery = async () => {
    try {
      // Ask permission
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("Permission Denied", "Allow gallery access");
        return;
      }

      // Open gallery
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        setSelectedImage(uri);
      }
    } catch (err) {
      Alert.alert("Error", err);
    }
  };

  const handleSave = async () => {
    if (!inputName && !selectedImage && !bio) {
      return Alert.alert("No changes made");
    }

    try {
      const formData = new FormData();

      if (inputName) formData.append("name", inputName);
      if (bio) formData.append("bio", bio);

      if (selectedImage) {
        formData.append("photo", {
          uri: selectedImage,
          name: "profile.jpg",
          type: "image/jpeg",
        });
      }

      const res = await updateProfileApi(formData);

      if (res.success) {
        const updatedName  = res.data?.user?.name;
        const updatedBio   = res.data?.user?.bio;
        const updatedPhoto = res.data?.user?.photo;

        // Only update name/bio/photo in Redux — never touch session/minutes/streak
        dispatch(updateProfile({ name: updatedName, bio: updatedBio, photo: updatedPhoto }));

        // Patch the local cache (spread existing so stats are preserved)
        try {
          const existing = await getUserFromCache() || {};
          await saveUserToCache({
            ...existing,
            ...(updatedName  != null && { name:  updatedName }),
            ...(updatedBio   != null && { bio:   updatedBio }),
            ...(updatedPhoto != null && { photo: updatedPhoto }),
          });
        } catch (_) {}

        Alert.alert("Success", "Profile updated successfully");
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong");
    }
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
              source={
                selectedImage
                  ? { uri: selectedImage }
                  : profileImage
                    ? { uri: profileImage }
                    : require("../../../assets/images/face.jpg")
              }
              style={styles.avatar}
            />
          </View>
          <TouchableOpacity onPress={openGallery}>
            <Text style={styles.changePhotoText}>Change Photo</Text>
          </TouchableOpacity>
        </View>

        {/* Name Field */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Name</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={inputName}
              onChangeText={setInputName}
              placeholderTextColor="#F1F5F940"
              placeholder="Enter your name"
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
