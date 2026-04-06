import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Octicons from "react-native-vector-icons/Octicons";
import { useDispatch } from "react-redux";
import { setName } from "../../features/slices/userSlice";
import {
  getScreenWidth,
  moderateScale,
  scale,
  verticalScale,
} from "../../utility/helpers";
import { supabase } from "../../utility/supabase";

const width = getScreenWidth();

const SignUpScreen = ({ navigation }) => {
  const [fullname, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPasswod] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const dispatch = useDispatch();

  const handlePasswordShow = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleCreateAccount = async () => {
    if (!email && !password && !fullname) {
      Alert.alert("Missing Fields", "All are required");
      return;
    } else if (!email) {
      Alert.alert("Missing Fields", "Email is required");
      return;
    } else if (!password) {
      Alert.alert("Missing Fields", "Password is required");
      return;
    } else if (!fullname) {
      Alert.alert("Missing Fields", "Name is required");
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        Alert.alert("Error", error.message);
        return;
      }

      const user = data.user;

      const { error: dbError } = await supabase.from("profiles").insert([
        {
          id: user.id,
          name: fullname,
          image_url: null,
          email: user.email,
        },
      ]);

      if (dbError) {
        Alert.alert("DB Error", dbError.message);
      }

      Alert.alert("Success", "Account created successfully");

      dispatch(setName(fullname));
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* header title */}
        <View style={styles.title}>
          {/* logo */}
          <View style={styles.logoBox}>
            <View style={styles.circle}>
              <Image
                source={require("../../../assets/images/person-logo.png")}
                style={styles.personLogo}
              />
            </View>
          </View>

          <View style={styles.headerText}>
            <Text style={styles.orgTxt}>Begin Your Journey</Text>
          </View>
          <View style={styles.subHeaderContainer}>
            <Text style={styles.subHeadText}>
              Join our community of mindfulness and find your inner peace.
            </Text>
          </View>
        </View>

        {/* input field */}
        <View style={styles.inputSection}>
          <View style={styles.inputBox}>
            <Text style={styles.emailText}>Full Name</Text>
            <View style={styles.emailBox}>
              <TextInput
                placeholder="Enter your name"
                style={styles.placeholderText}
                placeholderTextColor={"#94A3B8"}
                value={fullname}
                onChangeText={setFullName}
              />
            </View>
          </View>

          <View style={styles.inputBox}>
            <Text style={styles.emailText}>Email Address</Text>
            <View style={styles.emailBox}>
              <TextInput
                placeholder="name@example.com"
                style={styles.placeholderText}
                placeholderTextColor={"#94A3B8"}
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
            </View>
          </View>
          {/* password */}
          <View style={styles.inputBox}>
            <Text style={styles.emailText}>Password</Text>
            <View style={styles.passwordBoxContainer}>
              <View style={styles.passwordTextContainer}>
                <TextInput
                  placeholder="Enter your Password"
                  onChangeText={setPasswod}
                  value={password}
                  style={styles.placeholderText}
                  placeholderTextColor={"#94A3B8"}
                  secureTextEntry={!isPasswordVisible}
                />
              </View>
              <TouchableOpacity
                style={styles.passwordIconContainer}
                onPress={handlePasswordShow}
              >
                <Octicons
                  name={!isPasswordVisible ? "eye" : "eye-closed"}
                  color="#20DF6066"
                  size={24}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* button */}
          <Pressable style={styles.signInBtn} onPress={handleCreateAccount}>
            <Text style={styles.signInText}>Create Account</Text>
          </Pressable>
        </View>

        {/* bottom section */}
        <View style={styles.bottomBar}>
          <Text style={styles.newAccount}>Already have an account?</Text>
          <Pressable onPress={() => navigation.navigate("SignIn")}>
            <Text style={styles.signUpText}>Log In</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#112116",
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    paddingBottom: verticalScale(20),
  },
  title: {
    paddingTop: verticalScale(100),
    paddingHorizontal: scale(40),
    alignItems: "center",
    marginBottom: verticalScale(10),
  },
  logoBox: {
    height: scale(60),
    width: scale(60),
    justifyContent: "center",
    alignItems: "center",
  },
  circle: {
    backgroundColor: "#20DF604D",
    height: scale(60),
    width: scale(60),
    borderCurve: "circular",
    borderRadius: scale(30),
    borderColor: "#20DF60",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  personLogo: {
    height: scale(25),
    width: scale(25),
  },
  headerText: {
    paddingTop: verticalScale(8),
    alignItems: "center",
  },
  orgTxt: {
    color: "#F1F5F9",
    fontSize: moderateScale(28),
    fontWeight: "bold",
    letterSpacing: 0.8,
  },
  subHeaderContainer: {
    paddingTop: verticalScale(6),
    paddingHorizontal: scale(12),
    width: width * 0.85,
  },
  subHeadText: {
    color: "#94A3B8",
    lineHeight: moderateScale(20),
    fontSize: moderateScale(15),
    textAlign: "center",
  },
  inputSection: {
    width: width,
    paddingHorizontal: scale(24),
    gap: verticalScale(12),
  },
  inputBox: {
    width: "100%",
    gap: verticalScale(6),
  },
  emailText: {
    color: "#CBD5E1",
    fontSize: moderateScale(14),
    lineHeight: moderateScale(20),
    textAlign: "left",
    fontWeight: "500",
    paddingHorizontal: scale(6),
  },
  emailBox: {
    borderColor: "#20DF6033",
    borderWidth: 1,
    height: verticalScale(52),
    width: "100%",
    borderRadius: scale(12),
    justifyContent: "center",
  },
  passwordBoxContainer: {
    borderColor: "#20DF6033",
    borderWidth: 1,
    height: verticalScale(52),
    width: "100%",
    borderRadius: scale(12),
    justifyContent: "center",
    flexDirection: "row",
  },
  passwordTextContainer: {
    flexDirection: "row",
    flex: 1,
  },
  passwordIconContainer: {
    justifyContent: "center",
    padding: scale(10),
  },
  placeholderText: {
    paddingHorizontal: scale(12),
    color: "#F1F5F9",
    fontSize: moderateScale(15),
  },
  forgotPassword: {
    width: "100%",
    paddingHorizontal: scale(4),
    paddingBottom: verticalScale(4),
  },
  forgotPasswordText: {
    color: "#20DF60",
    fontSize: moderateScale(14),
    fontWeight: "500",
    textAlign: "right",
    lineHeight: moderateScale(20),
  },
  signInBtn: {
    height: verticalScale(52),
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#20DF60",
    borderRadius: scale(12),
    marginTop: verticalScale(4),
  },
  signInText: {
    fontSize: moderateScale(17),
    fontWeight: "bold",
    lineHeight: moderateScale(28),
    textAlign: "center",
    color: "#112116",
  },
  continueText: {
    flexDirection: "row",
    width: "100%",
    paddingVertical: verticalScale(16),
    justifyContent: "center",
    alignItems: "center",
    gap: scale(12),
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#64748B40",
  },
  orText: {
    color: "#64748B",
    fontSize: moderateScale(13),
    fontWeight: "500",
  },
  btns: {
    width: "100%",
    flexDirection: "row",
    gap: scale(16),
  },
  googleBtn: {
    flex: 1,
    height: verticalScale(52),
    gap: scale(10),
    borderColor: "#20DF6033",
    borderWidth: 1,
    borderRadius: scale(12),
    backgroundColor: "#20DF600D",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  logoImage: {
    height: scale(20),
    width: scale(20),
  },
  btnText: {
    color: "#F1F5F9",
    fontWeight: "500",
    fontSize: moderateScale(16),
  },
  bottomBar: {
    flexDirection: "row",
    width: "100%",
    paddingVertical: verticalScale(140),
    justifyContent: "center",
    alignItems: "center",
    gap: scale(8),
    marginTop: "auto",
  },
  newAccount: {
    color: "#94A3B8",
    fontSize: moderateScale(14),
  },
  signUpText: {
    color: "#20DF60",
    fontWeight: "bold",
    fontSize: moderateScale(14),
  },
});
