import auth, { GoogleAuthProvider } from "@react-native-firebase/auth";
import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
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
import { setUser } from "../../features/slices/userSlice";
import { googleLogin, login } from "../../services/authService";
import {
  getScreenWidth,
  moderateScale,
  scale,
  verticalScale,
} from "../../utility/helpers";
import { saveToken } from "../../utility/storage";

const width = getScreenWidth();

const SignInScreen = ({ navigation, setSession }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "989828482149-cu7fcl1sjp44g3ak56pmj194fs9btn9q.apps.googleusercontent.com",
      offlineAccess: true,
    });
  }, []);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await GoogleSignin.hasPlayServices();

      await GoogleSignin.signOut();

      const { data } = await GoogleSignin.signIn();

      const idToken = data?.idToken;
      console.log("idToken:", idToken);

      if (!idToken) {
        Alert.alert("No account selected");
        return;
      }

      const googleCredential = GoogleAuthProvider.credential(idToken);

      const userCredential =
        await auth().signInWithCredential(googleCredential);

      const firebaseToken = await userCredential.user.getIdToken(true);

      console.log("Firebase Token:", firebaseToken);

      const res = await googleLogin(firebaseToken);

      if (!res.success) {
        Alert.alert("Error", "Login failed on server");
        return;
      }

      dispatch(
        setUser({
          name: res.data.user.name,
          photo: res.data.user.photo,
          bio: res.data.user.bio,
          following: res.data.user.following || 0,
          streak: res.data.user.streak || 0,
          session: res.data.user.session || 0,
          minutes: res.data.user.minutes || 0,
        }),
      );
      await saveToken(res.data.token);

      setSession(true);
    } catch (error) {
      console.error(
        "Google Sign-In error:",
        error?.code,
        error?.message,
        error,
      );
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert("No account selected");
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert("Sign-in already in progress");
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert("Play services not available");
      } else {
        Alert.alert(
          "Google Sign-In Failed",
          error?.message || "Something went wrong. Please try again.",
        );
      }
      Alert.alert(
        "Google Sign-In Failed",
        error?.message || "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    if (!email && !password) {
      Alert.alert("Missing Fields", "Please enter email and password");
      return;
    }
    if (!email) {
      Alert.alert("Missing Fields", "Email is required");
      return;
    }

    if (!password) {
      Alert.alert("Missing Fields", "Password is required");
      return;
    }

    try {
      setLoading(true);
      const res = await login({ email, password });

      if (res.success && res.data?.token) {
        dispatch(
          setUser({
            name: res.data.user.name,
            photo: res.data.user.photo,
            bio: res.data.user.bio,
            following: res.data.user.following || 0,
            streak: 0,
            session: 0,
            minutes: 0,
          }),
        );
        setSession(true);
        await saveToken(res.data.token);
      }
    } catch (error) {
      Alert.alert("Login Failed", error.message);
    } finally {
      setLoading(false);
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
                source={require("../../../assets/images/containerLogo.png")}
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
                  onChangeText={setPassword}
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
          <TouchableOpacity
            style={[styles.signInBtn, loading && { opacity: 0.7 }]}
            onPress={handleSignIn}
          >
            {loading ? (
              <ActivityIndicator color="#112116" />
            ) : (
              <Text style={styles.signInText}>Sign In</Text>
            )}
          </TouchableOpacity>

          {/* continue text */}
          <View style={styles.continueText}>
            <View style={styles.dividerLine} />
            <Text style={styles.orText}>OR CONTINUE WITH</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* google button */}
          <View style={styles.btns}>
            <Pressable style={styles.googleBtn} onPress={handleGoogleLogin}>
              <Image
                source={require("../../../assets/images/google-logo.png")}
                style={styles.logoImage}
              />
              <Text style={styles.btnText}>Google</Text>
            </Pressable>

            <Pressable style={styles.googleBtn}>
              <Image
                source={require("../../../assets/images/apple-logo.png")}
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
