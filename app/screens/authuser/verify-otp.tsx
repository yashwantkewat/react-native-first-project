// app/verify-otp.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import axiosInstance from "../../../service/axiosInstance";
import axios from "axios";import { useLocalSearchParams } from "expo-router";


export default function VerifyOTP() {
  const { email: initialEmail } = useLocalSearchParams() as { email?: string };
  const [email, setEmail] = useState<string>(initialEmail ?? "");
  const [otp, setOtp] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (initialEmail) setEmail(initialEmail);
  }, [initialEmail]);

  const handleVerify = async () => {
    if (!email || !otp) {
      Alert.alert("Error", "Please enter email and OTP");
      return;
    }
    setLoading(true);
    try {
      const res = await axiosInstance.post("/users/verify-otp", { email, otp });
      Alert.alert("Success", res.data?.message || "OTP verified");
      // go to reset password with params
      router.push({
        pathname: "/screens/reset-password",
        params: { email, otp },
      } as any);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        Alert.alert("Error", err.response?.data?.message || "OTP verification failed");
      } else if (err instanceof Error) {
        Alert.alert("Error", err.message);
      } else {
        Alert.alert("Error", "An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.wrapper}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.card}>
            <Text style={styles.title}>Verify OTP</Text>
            <Text style={styles.subtitle}>Enter the 6-digit OTP sent to your email</Text>

            <TextInput
              placeholder="Email address"
              placeholderTextColor="#999"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInput
              placeholder="Enter OTP"
              placeholderTextColor="#999"
              style={styles.input}
              value={otp}
              onChangeText={setOtp}
              keyboardType="numeric"
            />

            <TouchableOpacity style={styles.button} onPress={handleVerify} disabled={loading}>
              <Text style={styles.buttonText}>{loading ? "Verifying..." : "Verify OTP"}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push("/screens/authuser/forget-password")}>
              <Text style={styles.link}>Resend / Back</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: "#f1f6fc" },
  container: { flexGrow: 1, justifyContent: "center", paddingHorizontal: wp("5%") },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: wp("6%"),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  title: { fontSize: wp("7%"), fontWeight: "700", color: "#2a5bd7", textAlign: "center", marginBottom: hp("1%") },
  subtitle: { textAlign: "center", color: "#666", marginBottom: hp("3%") },
  input: {
    backgroundColor: "#f9f9f9",
    paddingVertical: hp("1.5%"),
    paddingHorizontal: wp("4%"),
    borderRadius: 12,
    fontSize: wp("4%"),
    marginBottom: hp("2%"),
    borderWidth: 1,
    borderColor: "#ddd",
    color: "#000",
  },
  button: { backgroundColor: "#2a5bd7", paddingVertical: hp("1.8%"), borderRadius: 12, alignItems: "center", marginTop: hp("1%") },
  buttonText: { color: "#fff", fontSize: wp("4.5%"), fontWeight: "700" },
  link: { textAlign: "center", marginTop: hp("2%"), color: "#2a5bd7", fontWeight: "600", fontSize: wp("4%") },
});
