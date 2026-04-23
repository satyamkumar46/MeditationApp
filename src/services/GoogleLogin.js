import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { Alert } from "react-native";
import { useDispatch } from "react-redux";
import { setUser } from "../features/slices/userSlice";
import { googleLogin } from "./authService";

const dispatch = useDispatch();

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
});

const handleGoogleLogin = async () => {
  try {
    await GoogleSignin.hasPlayServices();

    const userInfo = await GoogleSignin.signIn();

    const idToken = userInfo.idToken;

    const data = await googleLogin(idToken);

    if (!data.success) {
      Alert.alert("Error", data.message || "Google login failed");
      return;
    }

    dispatch(setUser(data.user));
    navigation.replace("HomeStack");
  } catch (error) {
    Alert.alert("Error", "Google Sign-In failed");
  }
};
