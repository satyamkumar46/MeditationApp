import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ForgotPasswordScreen from "../screens/Auth/ForgotPasswordScreen";
import SignInScreen from "../screens/Auth/SignInScreen";
import SignUpScreen from "../screens/Auth/SignUpScreen";
import OnboardingScreen from "../screens/Onboarding/OnboardingScreen";
import SplashScreen from "../screens/Onboarding/SplashScreen";
import TabNavigator from "./TabNavigator";

export default function StackNavigator() {
  const stack = createNativeStackNavigator();

  return (
    <stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#112116",
        },
        headerTintColor: "#fff",
        headerShadowVisible: false,
      }}
    >
      <stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{ headerShown: false }}
      />

      <stack.Screen
        name="Onboarding"
        component={OnboardingScreen}
        options={{ headerShown: false }}
      />

      <stack.Screen
        name="Sign In"
        component={SignInScreen}
        options={{
          headerShown: false,
        }}
      />
      <stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{ headerShown: false }}
      />
      <stack.Screen
        name="SignUp"
        component={SignUpScreen}
        options={{
          headerShown: false,
        }}
      />

      <stack.Screen
        name="home"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
    </stack.Navigator>
  );
}
