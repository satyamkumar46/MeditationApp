import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  Alert,
  Dimensions,
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

const { width, height } = Dimensions.get("window");

// Responsive scaling helpers
const scale = (size) => (width / 390) * size;
const verticalScale = (size) => (height / 844) * size;
const moderateScale = (size, factor = 0.5) =>
  size + (scale(size) - size) * factor;

const SignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPasswod] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleSignIn = () => {
    if (!email && !password) {
      Alert.alert("Missing Fields", "Please enter email and password");
    } else if (!email) {
      Alert.alert("Missing Fields", "Email is required");
    } else if (!password) {
      Alert.alert("Missing Fields", "Password is required");
    } else {
      navigation.navigate("home");
    }
  };

  const handlePasswordShow = () => {
    setIsPasswordVisible(!isPasswordVisible);
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
                source={require("../../assest/images/ContainerLogo.png")}
                style={styles.titleLogo}
              />
            </View>
          </View>

          <View style={styles.headerText}>
            <Text style={styles.orgTxt}>Welcome Back</Text>
          </View>
          <View style={styles.subHeaderContainer}>
            <Text style={styles.subHeadText}>
              Take a deep breath and reconnect with your inner peace.
            </Text>
          </View>
        </View>

        {/* input field */}
        <View style={styles.inputSection}>
          <View style={styles.inputBox}>
            <Text style={styles.emailText}>Email Address</Text>
            <View style={styles.emailBox}>
              <TextInput
                placeholder="name@example.com"
                onChangeText={setEmail}
                value={email}
                style={styles.placeholderText}
                placeholderTextColor={"#94A3B8"}
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

          {/* forgot password */}
          <Pressable
            style={styles.forgotPassword}
            onPress={() => navigation.navigate("ForgotPassword")}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </Pressable>

          {/* button */}
          <Pressable style={styles.signInBtn} onPress={handleSignIn}>
            <Text style={styles.signInText}>Sign In</Text>
          </Pressable>

          {/* continue text */}
          <View style={styles.continueText}>
            <View style={styles.dividerLine} />
            <Text style={styles.orText}>OR CONTINUE WITH</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* google button */}
          <View style={styles.btns}>
            <Pressable style={styles.googleBtn}>
              <Image
                source={require("../../assest/images/google-logo.png")}
                style={styles.logoImage}
              />
              <Text style={styles.btnText}>Google</Text>
            </Pressable>

            <Pressable style={styles.googleBtn}>
              <Image
                source={require("../../assest/images/apple-logo.png")}
                style={styles.logoImage}
              />
              <Text style={styles.btnText}>ios</Text>
            </Pressable>
          </View>
        </View>

        {/* bottom section */}
        <View style={styles.bottomBar}>
          <Text style={styles.newAccount}>New to Serenity?</Text>
          <Pressable onPress={() => navigation.navigate("SignUp")}>
            <Text style={styles.signUpText}>Sign Up</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignInScreen;

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
    paddingTop: verticalScale(125),
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
    alignItems: "center",
    justifyContent: "center",
  },
  titleLogo: {
    height: scale(25),
    width: scale(25),
  },
  headerText: {
    paddingTop: verticalScale(8),
    alignItems: "center",
  },
  orgTxt: {
    color: "#F1F5F9",
    fontSize: moderateScale(30),
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
    paddingVertical: verticalScale(30),
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
