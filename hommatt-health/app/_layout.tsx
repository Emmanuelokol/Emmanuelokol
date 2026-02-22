import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#F9FAFB" },
          headerTintColor: "#047857",
          headerTitleStyle: { fontWeight: "600" },
          contentStyle: { backgroundColor: "#F9FAFB" },
        }}
      >
        <Stack.Screen
          name="index"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="auth/signup/index"
          options={{ title: "Create Account", headerBackTitle: "Back" }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}
