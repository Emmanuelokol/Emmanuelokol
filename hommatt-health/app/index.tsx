import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Logo area */}
      <View style={styles.logoArea}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>H</Text>
        </View>
        <Text style={styles.appName}>Hommatt Health</Text>
        <Text style={styles.tagline}>
          Quality healthcare for everyone in Uganda
        </Text>
      </View>

      {/* Features preview */}
      <View style={styles.features}>
        <FeatureRow
          icon="📋"
          title="Find hospitals near you"
          description="Search clinics and facilities in your city"
        />
        <FeatureRow
          icon="📅"
          title="Book appointments"
          description="Schedule visits without waiting in line"
        />
        <FeatureRow
          icon="🔒"
          title="Your health records"
          description="Safe and private, only you can see them"
        />
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.signupButton}
          onPress={() => router.push("/auth/signup")}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Create a new account"
        >
          <Text style={styles.signupButtonText}>Get Started</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => {
            /* TODO: navigate to login */
          }}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Log in to existing account"
        >
          <Text style={styles.loginButtonText}>
            I already have an account
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function FeatureRow({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <View style={styles.featureRow}>
      <Text style={styles.featureIcon}>{icon}</Text>
      <View style={styles.featureText}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDescription}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40,
  },

  // Logo
  logoArea: { alignItems: "center" },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#047857",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  logoText: { fontSize: 32, fontWeight: "700", color: "#FFFFFF" },
  appName: { fontSize: 28, fontWeight: "700", color: "#1F2937" },
  tagline: {
    fontSize: 15,
    color: "#6B7280",
    marginTop: 6,
    textAlign: "center",
  },

  // Features
  features: { gap: 20, marginVertical: 32 },
  featureRow: { flexDirection: "row", alignItems: "center", gap: 14 },
  featureIcon: { fontSize: 28 },
  featureText: { flex: 1 },
  featureTitle: { fontSize: 16, fontWeight: "600", color: "#1F2937" },
  featureDescription: { fontSize: 13, color: "#6B7280", marginTop: 2 },

  // Actions
  actions: { gap: 12 },
  signupButton: {
    minHeight: 54,
    backgroundColor: "#047857",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  signupButtonText: { fontSize: 17, fontWeight: "600", color: "#FFFFFF" },
  loginButton: {
    minHeight: 54,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  loginButtonText: { fontSize: 16, fontWeight: "500", color: "#374151" },
});
