import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ForgotPasswordScreen from "../screens/Auth/ForgotPasswordScreen";
import SignInScreen from "../screens/Auth/SignInScreen";
import SignUpScreen from "../screens/Auth/SignUpScreen";
import CategoryDetailScreen from "../screens/CategoryDetail/CategoryDetailScreen";
import CollectionScreen from "../screens/Collection/CollectionScreen";
import NotificationScreen from "../screens/Notification/NotificationScreen";
import OnboardingScreen from "../screens/Onboarding/OnboardingScreen";
import SplashScreen from "../screens/Onboarding/SplashScreen";
import PlayerScreen from "../screens/Player/PlayerScreen";
import EditProfileScreen from "../screens/Profile/EditProfileScreen";
import NotificationSettingScreen from "../screens/Profile/NotificationSettingScreen";
import RecommendedScreen from "../screens/Recommended/RecommendedScreen";
import RemainderScreen from "../screens/Remainder/RemainderScreen";
import SleepScreen from "../screens/Sleep/SleepScreen";
import SupportScreen from "../screens/Support/SupportScreen";
import TeacherProfileScreen from "../screens/TeacherProfile/TeacherProfileScreen";
import TimerScreen from "../screens/Timer/TimerScreen";
import TopTeachersScreen from "../screens/TopTeachers/TopTeachersScreen";
import TabNavigator from "./TabNavigator";

export default function StackNavigator({ session, setSession }) {
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
      {!session ? (
        <>
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
            name="SignIn"
            options={{
              headerShown: false,
            }}
          >
            {(props) => <SignInScreen {...props} setSession={setSession} />}
          </stack.Screen>
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
        </>
      ) : (
        <>
          <stack.Screen
            name="HomeStack"
            component={TabNavigator}
            options={{ headerShown: false }}
          />
          <stack.Screen
            name="EditProfile"
            component={EditProfileScreen}
            options={{ headerShown: false }}
          />
          <stack.Screen
            name="NotificationSettings"
            component={NotificationSettingScreen}
            options={{ headerShown: false }}
          />
          <stack.Screen
            name="Recommended"
            component={RecommendedScreen}
            options={{ headerShown: false }}
          />
          <stack.Screen
            name="Support"
            component={SupportScreen}
            options={{ headerShown: false }}
          />
          <stack.Screen
            name="Timer"
            component={TimerScreen}
            options={{ headerShown: false }}
          />
          <stack.Screen
            name="Remainder"
            component={RemainderScreen}
            options={{ headerShown: false }}
          />
          <stack.Screen
            name="Notification"
            component={NotificationScreen}
            options={{ headerShown: false }}
          />
          <stack.Screen
            name="TopTeachers"
            component={TopTeachersScreen}
            options={{ headerShown: false }}
          />
          <stack.Screen
            name="Sleep"
            component={SleepScreen}
            options={{ headerShown: false }}
          />
          <stack.Screen
            name="TeacherProfile"
            component={TeacherProfileScreen}
            options={{ headerShown: false }}
          />
          <stack.Screen
            name="CategoryDetail"
            component={CategoryDetailScreen}
            options={{ headerShown: false }}
          />

          <stack.Screen
            name="Collection"
            component={CollectionScreen}
            options={{ headerShown: false }}
          />

          <stack.Screen
            name="Player"
            component={PlayerScreen}
            options={{ headerShown: false }}
          />
        </>
      )}
    </stack.Navigator>
  );
}
