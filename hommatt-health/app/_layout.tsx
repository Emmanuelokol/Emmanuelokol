import { Stack } from "expo-router";
import { StatusBar } from "react-native";

export default function RootLayout() {
  return (
    <>
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
    </>
  );
}
