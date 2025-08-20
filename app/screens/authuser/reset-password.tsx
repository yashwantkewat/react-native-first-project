// app/reset-password.tsx
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
import { useLocalSearchParams } from "expo-router";
import { router } from "expo-router";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import axiosInstance from "../../../service/axiosInstance";
import axios from "axios";

export default function ResetPassword() {
  const params = useLocalSearchParams() as { email?: string; otp?: string };
  const [email, setEmail] = useState<string>(params.email ?? "");
  const [otp, setOtp] = useState<string>(params.otp ?? "");
  const [password, setPassword] = useState<string>("");
  const [confirm, setConfirm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (params.email) setEmail(params.email);
    if (params.otp) setOtp(params.otp);
  }, [params]);

  const handleReset = async () => {
    if (!email || !otp || !password || !confirm) {
      Alert.alert("Error", "All fields are required");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Error", "Password should be at least 6 characters");
      return;
    }
    if (password !== confirm) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await axiosInstance.post("/users/reset-password", { email, otp, newPassword: password });
      Alert.alert("Success", res.data?.message || "Password reset successful");
      // Optionally navigate to login
      router.replace("/screens/authuser/Login");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        Alert.alert("Error", err.response?.data?.message || "Password reset failed");
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
            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.subtitle}>Set a new password for your account</Text>

            <TextInput placeholder="Email address" placeholderTextColor="#999" style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />

            <TextInput placeholder="OTP" placeholderTextColor="#999" style={styles.input} value={otp} onChangeText={setOtp} keyboardType="numeric" />

            <TextInput placeholder="New password" placeholderTextColor="#999" style={styles.input} value={password} onChangeText={setPassword} secureTextEntry />

            <TextInput placeholder="Confirm password" placeholderTextColor="#999" style={styles.input} value={confirm} onChangeText={setConfirm} secureTextEntry />

            <TouchableOpacity style={styles.button} onPress={handleReset} disabled={loading}>
              <Text style={styles.buttonText}>{loading ? "Resetting..." : "Reset Password"}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push("/screens/authuser/Login")}>
              <Text style={styles.link}>Back to Login</Text>
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
