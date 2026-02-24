import { useEffect, useState } from "react";
import { View, Text, Platform, StyleSheet } from "react-native";
import { ErrorBoundary } from "../components/ErrorBoundary";

console.log("[_layout] Module loaded — platform:", Platform.OS);

// Lazy-import heavy deps to isolate crashes
let Stack: typeof import("expo-router").Stack | null = null;
let SafeAreaProvider: typeof import("react-native-safe-area-context").SafeAreaProvider | null = null;
let StatusBarComponent: typeof import("react-native").StatusBar | null = null;

try {
  Stack = require("expo-router").Stack;
  console.log("[_layout] expo-router Stack loaded OK");
} catch (e: unknown) {
  const msg = e instanceof Error ? e.message : String(e);
  console.error("[_layout] FAILED to load expo-router:", msg);
}

try {
  SafeAreaProvider = require("react-native-safe-area-context").SafeAreaProvider;
  console.log("[_layout] SafeAreaProvider loaded OK");
} catch (e: unknown) {
  const msg = e instanceof Error ? e.message : String(e);
  console.error("[_layout] FAILED to load SafeAreaProvider:", msg);
}

try {
  StatusBarComponent = require("react-native").StatusBar;
  console.log("[_layout] StatusBar loaded OK");
} catch (e: unknown) {
  const msg = e instanceof Error ? e.message : String(e);
  console.error("[_layout] FAILED to load StatusBar:", msg);
}

function LayoutInner() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    console.log("[_layout] LayoutInner mounted");
    setMounted(true);
  }, []);

  console.log("[_layout] LayoutInner render — mounted:", mounted);

  // If expo-router failed to load, show a diagnostic screen
  if (!Stack) {
    return (
      <View style={diagnosticStyles.container}>
        <Text style={diagnosticStyles.heading}>Router failed to load</Text>
        <Text style={diagnosticStyles.detail}>
          expo-router Stack component could not be imported. Check the logs for
          details.
        </Text>
      </View>
    );
  }

  const StackComponent = Stack;

  const content = (
    <>
      {StatusBarComponent ? (
        <StatusBarComponent barStyle="dark-content" backgroundColor="#F9FAFB" />
      ) : null}
      <StackComponent
        screenOptions={{
          headerStyle: { backgroundColor: "#F9FAFB" },
          headerTintColor: "#047857",
          headerTitleStyle: { fontWeight: "600" },
          contentStyle: { backgroundColor: "#F9FAFB" },
        }}
      >
        <StackComponent.Screen
          name="index"
          options={{ headerShown: false }}
        />
        <StackComponent.Screen
          name="auth/signup/index"
          options={{ title: "Create Account", headerBackTitle: "Back" }}
        />
      </StackComponent>
    </>
  );

  if (SafeAreaProvider) {
    const Provider = SafeAreaProvider;
    return <Provider>{content}</Provider>;
  }

  // Fallback without SafeAreaProvider
  console.warn("[_layout] Rendering without SafeAreaProvider");
  return content;
}

export default function RootLayout() {
  console.log("[_layout] RootLayout render");
  return (
    <ErrorBoundary label="RootLayout">
      <LayoutInner />
    </ErrorBoundary>
  );
}

const diagnosticStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFBEB",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  heading: {
    fontSize: 20,
    fontWeight: "700",
    color: "#92400E",
    marginBottom: 12,
  },
  detail: {
    fontSize: 14,
    color: "#78350F",
    textAlign: "center",
    lineHeight: 22,
  },
});
