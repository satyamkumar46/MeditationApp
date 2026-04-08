import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

export const googleLogin = async () => {
  try {
    await GoogleSignin.hasPlayServices();

    const userInfo = await GoogleSignin.signIn();

    const googleCredential = auth.GoogleAuthProvider.credential(
      userInfo.idToken,
    );

    const userCredential = await auth().signInWithCredential(googleCredential);
    return userCredential.user;
  } catch (error) {
    console.log("Login Error:", error);
  }
};
