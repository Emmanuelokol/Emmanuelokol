import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
} from "react-native";

console.log("[SignupScreen] Module loading...");

let supabase: typeof import("../../../lib/supabase").supabase;
let phoneStepSchema: typeof import("../../../lib/validations/signup").phoneStepSchema;
let infoStepSchema: typeof import("../../../lib/validations/signup").infoStepSchema;
let conditionsStepSchema: typeof import("../../../lib/validations/signup").conditionsStepSchema;
let HEALTH_CONDITIONS: typeof import("../../../lib/constants/health-conditions").HEALTH_CONDITIONS;
let UGANDA_CITIES: typeof import("../../../lib/constants/health-conditions").UGANDA_CITIES;

try {
  supabase = require("../../../lib/supabase").supabase;
  console.log("[SignupScreen] supabase imported OK");
} catch (e: unknown) {
  console.error("[SignupScreen] FAILED to import supabase:", e instanceof Error ? e.message : e);
}

try {
  const validations = require("../../../lib/validations/signup");
  phoneStepSchema = validations.phoneStepSchema;
  infoStepSchema = validations.infoStepSchema;
  conditionsStepSchema = validations.conditionsStepSchema;
  console.log("[SignupScreen] validation schemas imported OK");
} catch (e: unknown) {
  console.error("[SignupScreen] FAILED to import validations:", e instanceof Error ? e.message : e);
}

try {
  const constants = require("../../../lib/constants/health-conditions");
  HEALTH_CONDITIONS = constants.HEALTH_CONDITIONS;
  UGANDA_CITIES = constants.UGANDA_CITIES;
  console.log("[SignupScreen] constants imported OK");
} catch (e: unknown) {
  console.error("[SignupScreen] FAILED to import constants:", e instanceof Error ? e.message : e);
}

import type { SignupProfileInsert } from "../../../lib/supabase/types";

const STEPS = ["Phone", "About You", "Health"] as const;

console.log("[SignupScreen] Module init complete");

function calculateAge(dob: string): number {
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

export default function SignupScreen() {
  useEffect(() => {
    console.log("[SignupScreen] Component mounted");
  }, []);

  console.log("[SignupScreen] Render");

  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Step 1: Phone
  const [phoneNumber, setPhoneNumber] = useState("+256");

  // Step 2: Info
  const [sex, setSex] = useState("");
  const [city, setCity] = useState("");
  const [dobYear, setDobYear] = useState("");
  const [dobMonth, setDobMonth] = useState("");
  const [dobDay, setDobDay] = useState("");

  // Step 3: Conditions
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);

  function getDobString(): string {
    if (!dobYear || !dobMonth || !dobDay) return "";
    const y = dobYear.padStart(4, "0");
    const m = dobMonth.padStart(2, "0");
    const d = dobDay.padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  function validateStep(): boolean {
    setErrors({});

    if (step === 0) {
      const result = phoneStepSchema.safeParse({ phone_number: phoneNumber });
      if (!result.success) {
        const field = result.error.flatten().fieldErrors;
        setErrors({ phone_number: field.phone_number?.[0] ?? "" });
        return false;
      }
    }

    if (step === 1) {
      const dob = getDobString();
      const result = infoStepSchema.safeParse({ sex, city, dob });
      if (!result.success) {
        const field = result.error.flatten().fieldErrors;
        setErrors({
          sex: field.sex?.[0] ?? "",
          city: field.city?.[0] ?? "",
          dob: field.dob?.[0] ?? "",
        });
        return false;
      }
      const age = calculateAge(dob);
      if (age < 0 || age > 150) {
        setErrors({ dob: "Please enter a valid date of birth" });
        return false;
      }
    }

    if (step === 2) {
      const result = conditionsStepSchema.safeParse({
        existing_conditions: selectedConditions,
      });
      if (!result.success) return false;
    }

    return true;
  }

  function handleNext() {
    if (!validateStep()) return;
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function handleBack() {
    setErrors({});
    setStep((s) => Math.max(s - 1, 0));
  }

  function toggleCondition(condition: string) {
    setSelectedConditions((prev) => {
      if (condition === "None of the above") {
        return prev.includes(condition) ? [] : ["None of the above"];
      }
      const without = prev.filter((c) => c !== "None of the above");
      if (without.includes(condition)) {
        return without.filter((c) => c !== condition);
      }
      return [...without, condition];
    });
  }

  async function handleSignup() {
    if (!validateStep()) return;

    setSubmitting(true);
    const dob = getDobString();
    const age = calculateAge(dob);
    const conditions = selectedConditions.filter(
      (c) => c !== "None of the above"
    );

    try {
      // 1. Create auth user with phone
      const { data: authData, error: authError } = await supabase.auth.signUp({
        phone: phoneNumber,
        password: phoneNumber + "_hommatt",
      });

      if (authError) {
        Alert.alert(
          "Something went wrong",
          "We could not create your account. Please try again."
        );
        setSubmitting(false);
        return;
      }

      const userId = authData.user?.id;
      if (!userId) {
        Alert.alert("Something went wrong", "Please try again.");
        setSubmitting(false);
        return;
      }

      // 2. Insert profile
      const profile: SignupProfileInsert = {
        id: userId,
        phone_number: phoneNumber,
        sex: sex as "male" | "female",
        city,
        dob,
        age,
        existing_conditions: conditions,
      };

      const { error: profileError } = await supabase
        .from("profiles")
        .insert(profile);

      if (profileError) {
        Alert.alert(
          "Almost there",
          "Your account was created but we had trouble saving your details. You can update them later in Settings."
        );
      } else {
        Alert.alert(
          "Welcome to Hommatt Health!",
          "Your account is ready. Let's get you started."
        );
      }
    } catch {
      Alert.alert(
        "Connection problem",
        "Please check your internet and try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Hommatt Health</Text>
          <Text style={styles.subtitle}>
            Create your account — it only takes a minute.
          </Text>
        </View>

        {/* Step indicator */}
        <View style={styles.stepRow}>
          {STEPS.map((label, i) => (
            <View key={label} style={styles.stepItem}>
              <View
                style={[
                  styles.stepDot,
                  i <= step ? styles.stepDotActive : styles.stepDotInactive,
                ]}
              />
              <Text
                style={[
                  styles.stepLabel,
                  i <= step ? styles.stepLabelActive : styles.stepLabelInactive,
                ]}
              >
                {label}
              </Text>
            </View>
          ))}
        </View>

        {/* Step 1: Phone */}
        {step === 0 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>What is your phone number?</Text>
            <Text style={styles.stepDescription}>
              We use this to keep your account safe.
            </Text>
            <TextInput
              style={styles.textInput}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="+256 7XX XXX XXX"
              placeholderTextColor="#9CA3AF"
              keyboardType="phone-pad"
              maxLength={13}
              accessibilityLabel="Phone number"
            />
            {errors.phone_number ? (
              <Text style={styles.errorText}>{errors.phone_number}</Text>
            ) : null}
          </View>
        )}

        {/* Step 2: About You */}
        {step === 1 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Tell us about yourself</Text>

            {/* Sex */}
            <Text style={styles.fieldLabel}>Sex</Text>
            <View style={styles.optionRow}>
              {(["male", "female"] as const).map((opt) => (
                <TouchableOpacity
                  key={opt}
                  style={[
                    styles.optionCard,
                    sex === opt && styles.optionCardSelected,
                  ]}
                  onPress={() => setSex(opt)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: sex === opt }}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.optionText,
                      sex === opt && styles.optionTextSelected,
                    ]}
                  >
                    {opt === "male" ? "Male" : "Female"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {errors.sex ? (
              <Text style={styles.errorText}>{errors.sex}</Text>
            ) : null}

            {/* City */}
            <Text style={styles.fieldLabel}>City</Text>
            <View style={styles.cityGrid}>
              {UGANDA_CITIES.map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[
                    styles.cityCard,
                    city === c && styles.optionCardSelected,
                  ]}
                  onPress={() => setCity(c)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: city === c }}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.cityText,
                      city === c && styles.optionTextSelected,
                    ]}
                  >
                    {c}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {errors.city ? (
              <Text style={styles.errorText}>{errors.city}</Text>
            ) : null}

            {/* Date of Birth */}
            <Text style={styles.fieldLabel}>Date of Birth</Text>
            <Text style={styles.stepDescription}>
              Enter as Day / Month / Year
            </Text>
            <View style={styles.dobRow}>
              <TextInput
                style={[styles.textInput, styles.dobInput]}
                value={dobDay}
                onChangeText={setDobDay}
                placeholder="DD"
                placeholderTextColor="#9CA3AF"
                keyboardType="number-pad"
                maxLength={2}
                accessibilityLabel="Day of birth"
              />
              <TextInput
                style={[styles.textInput, styles.dobInput]}
                value={dobMonth}
                onChangeText={setDobMonth}
                placeholder="MM"
                placeholderTextColor="#9CA3AF"
                keyboardType="number-pad"
                maxLength={2}
                accessibilityLabel="Month of birth"
              />
              <TextInput
                style={[styles.textInput, styles.dobInputYear]}
                value={dobYear}
                onChangeText={setDobYear}
                placeholder="YYYY"
                placeholderTextColor="#9CA3AF"
                keyboardType="number-pad"
                maxLength={4}
                accessibilityLabel="Year of birth"
              />
            </View>
            {errors.dob ? (
              <Text style={styles.errorText}>{errors.dob}</Text>
            ) : null}
          </View>
        )}

        {/* Step 3: Health Conditions */}
        {step === 2 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>
              Do you have any of these conditions?
            </Text>
            <Text style={styles.stepDescription}>
              Tap all that apply. This helps us look after you better.
            </Text>
            <View style={styles.conditionsList}>
              {HEALTH_CONDITIONS.map((condition) => {
                const isSelected = selectedConditions.includes(condition);
                return (
                  <TouchableOpacity
                    key={condition}
                    style={[
                      styles.conditionCard,
                      isSelected && styles.conditionCardSelected,
                    ]}
                    onPress={() => toggleCondition(condition)}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: isSelected }}
                    activeOpacity={0.7}
                  >
                    <View
                      style={[
                        styles.checkbox,
                        isSelected && styles.checkboxSelected,
                      ]}
                    >
                      {isSelected && (
                        <Text style={styles.checkmark}>✓</Text>
                      )}
                    </View>
                    <Text
                      style={[
                        styles.conditionText,
                        isSelected && styles.conditionTextSelected,
                      ]}
                    >
                      {condition}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* Navigation buttons */}
        <View style={styles.navRow}>
          {step > 0 && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBack}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          )}

          {step < STEPS.length - 1 ? (
            <TouchableOpacity
              style={[styles.nextButton, step === 0 && styles.fullWidth]}
              onPress={handleNext}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Continue to next step"
            >
              <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.nextButton, submitting && styles.buttonDisabled]}
              onPress={handleSignup}
              disabled={submitting}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Create account"
            >
              {submitting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.nextButtonText}>Sign Up</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: "#F9FAFB" },
  scrollContent: { padding: 20, paddingBottom: 40 },

  // Header
  header: { alignItems: "center", marginBottom: 24 },
  title: { fontSize: 24, fontWeight: "700", color: "#047857" },
  subtitle: { fontSize: 14, color: "#6B7280", marginTop: 4 },

  // Step indicator
  stepRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginBottom: 28,
  },
  stepItem: { alignItems: "center", gap: 4 },
  stepDot: { width: 12, height: 12, borderRadius: 6 },
  stepDotActive: { backgroundColor: "#047857" },
  stepDotInactive: { backgroundColor: "#D1D5DB" },
  stepLabel: { fontSize: 11 },
  stepLabelActive: { color: "#047857", fontWeight: "600" },
  stepLabelInactive: { color: "#9CA3AF" },

  // Steps
  stepContainer: { marginBottom: 24 },
  stepTitle: { fontSize: 20, fontWeight: "600", color: "#1F2937", marginBottom: 6 },
  stepDescription: { fontSize: 14, color: "#6B7280", marginBottom: 16 },

  // Inputs
  fieldLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
    marginTop: 20,
  },
  textInput: {
    minHeight: 52,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#1F2937",
    backgroundColor: "#FFFFFF",
  },
  errorText: { fontSize: 13, color: "#DC2626", marginTop: 6 },

  // Option cards (sex)
  optionRow: { flexDirection: "row", gap: 12 },
  optionCard: {
    flex: 1,
    minHeight: 52,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  optionCardSelected: {
    borderColor: "#047857",
    backgroundColor: "#ECFDF5",
  },
  optionText: { fontSize: 16, fontWeight: "500", color: "#374151" },
  optionTextSelected: { color: "#047857" },

  // City grid
  cityGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  cityCard: {
    minHeight: 48,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  cityText: { fontSize: 14, fontWeight: "500", color: "#374151" },

  // DOB row
  dobRow: { flexDirection: "row", gap: 10 },
  dobInput: { flex: 1, textAlign: "center" },
  dobInputYear: { flex: 1.5, textAlign: "center" },

  // Conditions
  conditionsList: { gap: 10 },
  conditionCard: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 52,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    gap: 12,
  },
  conditionCardSelected: {
    borderColor: "#047857",
    backgroundColor: "#ECFDF5",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxSelected: {
    backgroundColor: "#047857",
    borderColor: "#047857",
  },
  checkmark: { color: "#FFFFFF", fontSize: 14, fontWeight: "700" },
  conditionText: { fontSize: 15, color: "#374151", flexShrink: 1 },
  conditionTextSelected: { color: "#047857", fontWeight: "500" },

  // Navigation
  navRow: { flexDirection: "row", gap: 12, marginTop: 8 },
  backButton: {
    flex: 1,
    minHeight: 52,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  backButtonText: { fontSize: 16, fontWeight: "600", color: "#6B7280" },
  nextButton: {
    flex: 1,
    minHeight: 52,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#047857",
  },
  nextButtonText: { fontSize: 16, fontWeight: "600", color: "#FFFFFF" },
  fullWidth: { flex: 2 },
  buttonDisabled: { opacity: 0.6 },
});
