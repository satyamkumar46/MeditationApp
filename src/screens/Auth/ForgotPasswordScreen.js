import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { useRef, useState } from "react";
import {
  Animated,
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
import Ionicons from "react-native-vector-icons/Ionicons";

const { width, height } = Dimensions.get("window");

// Responsive scaling helpers
const scale = (size) => (width / 390) * size;
const verticalScale = (size) => (height / 844) * size;
const moderateScale = (size, factor = 0.5) =>
  size + (scale(size) - size) * factor;

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1); // 1: Enter email, 2: OTP verification, 3: Reset password

  // Animation values
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  // OTP input refs
  const otpRefs = useRef([]);

  const animateTransition = (callback) => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -30,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      callback();
      slideAnim.setValue(30);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const handleSendCode = () => {
    if (email.trim()) {
      animateTransition(() => setStep(2));
    }
  };

  const handleVerifyOtp = () => {
    const otpCode = otp.join("");
    if (otpCode.length === 4) {
      animateTransition(() => setStep(3));
    }
  };

  const handleResetPassword = () => {
    if (newPassword && confirmPassword && newPassword === confirmPassword) {
      navigation.navigate("Sign In");
    }
  };

  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const getHeaderInfo = () => {
    switch (step) {
      case 1:
        return {
          icon: "lock-closed-outline",
          title: "Forgot Password?",
          subtitle:
            "No worries! Enter your email address and we'll send you a code to reset your password.",
        };
      case 2:
        return {
          icon: "shield-checkmark-outline",
          title: "Verify Code",
          subtitle: `We've sent a 4-digit verification code to ${email}. Enter it below.`,
        };
      case 3:
        return {
          icon: "key-outline",
          title: "New Password",
          subtitle:
            "Create a strong password to keep your mindfulness journey secure.",
        };
      default:
        return {};
    }
  };

  const headerInfo = getHeaderInfo();

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar style="light" />

      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            if (step > 1) {
              animateTransition(() => setStep(step - 1));
            } else {
              navigation.goBack();
            }
          }}
          style={styles.backButton}
        >
          <Ionicons
            name="arrow-back"
            size={moderateScale(22)}
            color="#F1F5F9"
          />
        </TouchableOpacity>

        {/* Step indicators */}
        <View style={styles.stepIndicator}>
          {[1, 2, 3].map((s) => (
            <View
              key={s}
              style={[
                styles.stepDot,
                s === step && styles.stepDotActive,
                s < step && styles.stepDotCompleted,
              ]}
            />
          ))}
        </View>

        <View style={{ width: moderateScale(40) }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header Section */}
        <Animated.View
          style={[
            styles.headerSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Icon Circle */}
          <View style={styles.iconContainer}>
            <LinearGradient
              colors={["#20DF6030", "#20DF6010"]}
              style={styles.iconCircle}
            >
              <Ionicons
                name={headerInfo.icon}
                size={moderateScale(32)}
                color="#20DF60"
              />
            </LinearGradient>
          </View>

          <Text style={styles.titleText}>{headerInfo.title}</Text>
          <Text style={styles.subtitleText}>{headerInfo.subtitle}</Text>
        </Animated.View>

        {/* Form Content - Animated */}
        <Animated.View
          style={[
            styles.formSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Step 1: Email Input */}
          {step === 1 && (
            <View style={styles.stepContent}>
              <View style={styles.inputBox}>
                <Text style={styles.labelText}>Email Address</Text>
                <View style={styles.inputContainer}>
                  <Ionicons
                    name="mail-outline"
                    size={moderateScale(18)}
                    color="#94A3B8"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    placeholder="name@example.com"
                    onChangeText={setEmail}
                    value={email}
                    style={styles.inputText}
                    placeholderTextColor="#94A3B8"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </View>

              <Pressable style={styles.primaryBtn} onPress={handleSendCode}>
                <LinearGradient
                  colors={["#2aed4a", "#1bc83a", "#15a830"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.btnGradient}
                >
                  <Text style={styles.primaryBtnText}>Send Reset Code</Text>
                  <Ionicons
                    name="arrow-forward"
                    size={moderateScale(18)}
                    color="#0a1a0f"
                    style={{ marginLeft: scale(6) }}
                  />
                </LinearGradient>
              </Pressable>
            </View>
          )}

          {/* Step 2: OTP Verification */}
          {step === 2 && (
            <View style={styles.stepContent}>
              <View style={styles.otpContainer}>
                {otp.map((digit, index) => (
                  <View
                    key={index}
                    style={[
                      styles.otpBox,
                      digit && styles.otpBoxFilled,
                    ]}
                  >
                    <TextInput
                      ref={(ref) => (otpRefs.current[index] = ref)}
                      style={styles.otpInput}
                      value={digit}
                      onChangeText={(value) => handleOtpChange(value, index)}
                      onKeyPress={(e) => handleOtpKeyPress(e, index)}
                      keyboardType="number-pad"
                      maxLength={1}
                      selectTextOnFocus
                    />
                  </View>
                ))}
              </View>

              {/* Resend Timer */}
              <View style={styles.resendContainer}>
                <Text style={styles.resendText}>Didn't receive the code? </Text>
                <TouchableOpacity>
                  <Text style={styles.resendLink}>Resend</Text>
                </TouchableOpacity>
              </View>

              <Pressable style={styles.primaryBtn} onPress={handleVerifyOtp}>
                <LinearGradient
                  colors={["#2aed4a", "#1bc83a", "#15a830"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.btnGradient}
                >
                  <Text style={styles.primaryBtnText}>Verify Code</Text>
                  <Ionicons
                    name="checkmark-circle"
                    size={moderateScale(18)}
                    color="#0a1a0f"
                    style={{ marginLeft: scale(6) }}
                  />
                </LinearGradient>
              </Pressable>
            </View>
          )}

          {/* Step 3: New Password */}
          {step === 3 && (
            <View style={styles.stepContent}>
              <View style={styles.inputBox}>
                <Text style={styles.labelText}>New Password</Text>
                <View style={styles.inputContainer}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={moderateScale(18)}
                    color="#94A3B8"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    placeholder="Create new password"
                    onChangeText={setNewPassword}
                    value={newPassword}
                    style={styles.inputText}
                    placeholderTextColor="#94A3B8"
                    secureTextEntry
                  />
                </View>
              </View>

              <View style={styles.inputBox}>
                <Text style={styles.labelText}>Confirm Password</Text>
                <View style={styles.inputContainer}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={moderateScale(18)}
                    color="#94A3B8"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    placeholder="Confirm your password"
                    onChangeText={setConfirmPassword}
                    value={confirmPassword}
                    style={styles.inputText}
                    placeholderTextColor="#94A3B8"
                    secureTextEntry
                  />
                </View>
              </View>

              {/* Password strength hints */}
              <View style={styles.hintsContainer}>
                <View style={styles.hintRow}>
                  <Ionicons
                    name={
                      newPassword.length >= 8
                        ? "checkmark-circle"
                        : "ellipse-outline"
                    }
                    size={moderateScale(16)}
                    color={newPassword.length >= 8 ? "#20DF60" : "#64748B"}
                  />
                  <Text
                    style={[
                      styles.hintText,
                      newPassword.length >= 8 && styles.hintTextActive,
                    ]}
                  >
                    At least 8 characters
                  </Text>
                </View>
                <View style={styles.hintRow}>
                  <Ionicons
                    name={
                      /[A-Z]/.test(newPassword)
                        ? "checkmark-circle"
                        : "ellipse-outline"
                    }
                    size={moderateScale(16)}
                    color={/[A-Z]/.test(newPassword) ? "#20DF60" : "#64748B"}
                  />
                  <Text
                    style={[
                      styles.hintText,
                      /[A-Z]/.test(newPassword) && styles.hintTextActive,
                    ]}
                  >
                    One uppercase letter
                  </Text>
                </View>
                <View style={styles.hintRow}>
                  <Ionicons
                    name={
                      /[0-9]/.test(newPassword)
                        ? "checkmark-circle"
                        : "ellipse-outline"
                    }
                    size={moderateScale(16)}
                    color={/[0-9]/.test(newPassword) ? "#20DF60" : "#64748B"}
                  />
                  <Text
                    style={[
                      styles.hintText,
                      /[0-9]/.test(newPassword) && styles.hintTextActive,
                    ]}
                  >
                    One number
                  </Text>
                </View>
              </View>

              <Pressable
                style={styles.primaryBtn}
                onPress={handleResetPassword}
              >
                <LinearGradient
                  colors={["#2aed4a", "#1bc83a", "#15a830"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.btnGradient}
                >
                  <Text style={styles.primaryBtnText}>Reset Password</Text>
                </LinearGradient>
              </Pressable>
            </View>
          )}
        </Animated.View>

        {/* Bottom Link */}
        <View style={styles.bottomBar}>
          <Text style={styles.bottomText}>Remember your password? </Text>
          <Pressable onPress={() => navigation.navigate("Sign In")}>
            <Text style={styles.bottomLink}>Sign In</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#112116",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: Platform.OS === "ios" ? verticalScale(60) : verticalScale(45),
    paddingHorizontal: scale(20),
    paddingBottom: verticalScale(10),
  },
  backButton: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: "#20DF600D",
    borderWidth: 1,
    borderColor: "#20DF6020",
    justifyContent: "center",
    alignItems: "center",
  },
  stepIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(8),
  },
  stepDot: {
    width: moderateScale(8),
    height: moderateScale(8),
    borderRadius: moderateScale(4),
    backgroundColor: "#64748B40",
  },
  stepDotActive: {
    width: moderateScale(24),
    backgroundColor: "#20DF60",
  },
  stepDotCompleted: {
    backgroundColor: "#20DF6080",
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    paddingBottom: verticalScale(20),
  },
  headerSection: {
    paddingTop: verticalScale(30),
    paddingHorizontal: scale(30),
    alignItems: "center",
    marginBottom: verticalScale(30),
  },
  iconContainer: {
    marginBottom: verticalScale(20),
  },
  iconCircle: {
    width: moderateScale(72),
    height: moderateScale(72),
    borderRadius: moderateScale(36),
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#20DF6030",
  },
  titleText: {
    color: "#F1F5F9",
    fontSize: moderateScale(28),
    fontWeight: "bold",
    letterSpacing: 0.5,
    marginBottom: verticalScale(10),
    textAlign: "center",
  },
  subtitleText: {
    color: "#94A3B8",
    fontSize: moderateScale(14),
    lineHeight: moderateScale(22),
    textAlign: "center",
    letterSpacing: 0.2,
  },
  formSection: {
    width: width,
    paddingHorizontal: scale(24),
  },
  stepContent: {
    gap: verticalScale(16),
  },
  inputBox: {
    width: "100%",
    gap: verticalScale(6),
  },
  labelText: {
    color: "#CBD5E1",
    fontSize: moderateScale(14),
    lineHeight: moderateScale(20),
    textAlign: "left",
    fontWeight: "500",
    paddingHorizontal: scale(6),
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#20DF6033",
    borderWidth: 1,
    height: verticalScale(52),
    width: "100%",
    borderRadius: scale(12),
    backgroundColor: "#20DF600A",
  },
  inputIcon: {
    paddingLeft: scale(14),
  },
  inputText: {
    flex: 1,
    paddingHorizontal: scale(10),
    color: "#F1F5F9",
    fontSize: moderateScale(15),
  },

  // OTP Styles
  otpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: scale(14),
    paddingVertical: verticalScale(10),
  },
  otpBox: {
    width: moderateScale(60),
    height: moderateScale(60),
    borderRadius: scale(14),
    borderWidth: 1.5,
    borderColor: "#20DF6033",
    backgroundColor: "#20DF600A",
    justifyContent: "center",
    alignItems: "center",
  },
  otpBoxFilled: {
    borderColor: "#20DF60",
    backgroundColor: "#20DF6015",
  },
  otpInput: {
    color: "#F1F5F9",
    fontSize: moderateScale(24),
    fontWeight: "bold",
    textAlign: "center",
    width: "100%",
    height: "100%",
  },
  resendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: verticalScale(4),
  },
  resendText: {
    color: "#94A3B8",
    fontSize: moderateScale(13),
  },
  resendLink: {
    color: "#20DF60",
    fontSize: moderateScale(13),
    fontWeight: "bold",
  },

  // Password Hints
  hintsContainer: {
    gap: verticalScale(8),
    paddingHorizontal: scale(6),
    paddingVertical: verticalScale(4),
  },
  hintRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(8),
  },
  hintText: {
    color: "#64748B",
    fontSize: moderateScale(13),
  },
  hintTextActive: {
    color: "#20DF60",
  },

  // Button
  primaryBtn: {
    borderRadius: scale(12),
    overflow: "hidden",
    elevation: 6,
    shadowColor: "#1ed760",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    marginTop: verticalScale(8),
  },
  btnGradient: {
    paddingVertical: verticalScale(16),
    borderRadius: scale(12),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  primaryBtnText: {
    fontSize: moderateScale(16),
    fontWeight: "700",
    color: "#0a1a0f",
    letterSpacing: 0.5,
  },

  // Bottom
  bottomBar: {
    flexDirection: "row",
    width: "100%",
    paddingVertical: verticalScale(30),
    justifyContent: "center",
    alignItems: "center",
    gap: scale(4),
    marginTop: "auto",
  },
  bottomText: {
    color: "#94A3B8",
    fontSize: moderateScale(14),
  },
  bottomLink: {
    color: "#20DF60",
    fontWeight: "bold",
    fontSize: moderateScale(14),
  },
});
