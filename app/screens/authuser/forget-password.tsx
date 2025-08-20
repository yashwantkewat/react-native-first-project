// app/forgot-password.tsx
import React, { useState } from "react";
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
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSendOtp = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email");
      return;
    }

    setLoading(true);
    try {
      const res = await axiosInstance.post("/users/forget-password", { email });
      Alert.alert("Success", res.data?.message || "OTP sent to email");
      // navigate to verify page and pass email
      router.push({
        pathname: "/screens/verify-otp",
        params: { email },
      } as any);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        Alert.alert("Error", err.response?.data?.message || "Failed to send OTP");
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
            <Text style={styles.title}>Forgot Password</Text>
            <Text style={styles.subtitle}>Enter your email to receive an OTP</Text>

            <TextInput
              placeholder="Email address"
              placeholderTextColor="#999"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TouchableOpacity style={styles.button} onPress={handleSendOtp} disabled={loading}>
              <Text style={styles.buttonText}>{loading ? "Sending..." : "Send OTP"}</Text>
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
