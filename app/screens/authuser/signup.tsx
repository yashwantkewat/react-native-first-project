import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { router } from "expo-router";
import axiosInstance from "../../../service/axiosInstance";
import Toast from "react-native-toast-message";

interface ApiResponse {
  message: string;
  user?: { id: string; name: string; email: string };
  token?: string;
}

const SignUpScreen: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!name.trim()) {
      Toast.show({ type: "error", text1: "Validation Error", text2: "Full name is required" });
      return false;
    }
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      Toast.show({ type: "error", text1: "Validation Error", text2: "Enter a valid email address" });
      return false;
    }
    if (password.length < 6) {
      Toast.show({ type: "error", text1: "Validation Error", text2: "Password must be at least 6 characters" });
      return false;
    }
    if (!agreeTerms) {
      Toast.show({ type: "error", text1: "Validation Error", text2: "You must agree to the terms & conditions" });
      return false;
    }
    return true;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const { data } = await axiosInstance.post<ApiResponse>("/users/register", {
        name,
        email,
        password,
      });

      Toast.show({
        type: "success",
        text1: "Signup Successful 🎉",
        text2: `Welcome, ${data.user?.name || "User"}`,
      });

      setTimeout(() => {
        router.replace("/screens/authuser/Login");
      }, 1500);

    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Signup Failed",
        text2: error.response?.data?.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.wrapper}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.card}>
            <Text style={styles.title}>Signup</Text>

            <TextInput
              placeholder="Full name"
              placeholderTextColor="#999"
              style={styles.input}
              value={name}
              onChangeText={setName}
            />

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
              placeholder="Password"
              placeholderTextColor="#999"
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <View style={styles.checkboxRow}>
              <TouchableOpacity
                style={[styles.checkbox, agreeTerms && styles.checkboxChecked]}
                onPress={() => setAgreeTerms(!agreeTerms)}
              />
              <Text style={styles.termsText}>I agree to the terms & conditions</Text>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={loading}>
              <Text style={styles.buttonText}>{loading ? "Signing up..." : "Signup"}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push("/screens/authuser/Login")}>
              <Text style={styles.loginLink}>Already have an account? Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ✅ Toast Component */}
      <Toast />
    </View>
  );
};

export default SignUpScreen;

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
  title: {
    fontSize: wp("7%"),
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: hp("3%"),
    color: "#2a5bd7",
  },
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
  checkboxRow: { flexDirection: "row", alignItems: "center", marginBottom: hp("2%") },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: "#888",
    borderRadius: 4,
    marginRight: 8,
    backgroundColor: "#fff",
  },
  checkboxChecked: { backgroundColor: "#2a5bd7" },
  termsText: { fontSize: wp("3.5%"), color: "#555" },
  button: {
    backgroundColor: "#2a5bd7",
    paddingVertical: hp("1.8%"),
    borderRadius: 12,
    alignItems: "center",
    marginTop: hp("1%"),
  },
  buttonText: { color: "#fff", fontSize: wp("4.5%"), fontWeight: "bold" },
  loginLink: { textAlign: "center", marginTop: hp("2%"), color: "#2a5bd7", fontWeight: "600", fontSize: wp("4%") },
});
