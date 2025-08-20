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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import axiosInstance from "../../../service/axiosInstance";
import Toast from "react-native-toast-message";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // const handleLogin = async () => {
  //   if (!email || !password) {
  //     Toast.show({
  //       type: "error",
  //       text1: "Validation Error",
  //       text2: "Please enter both email and password",
  //     });
  //     return;
  //   }

  //   setLoading(true);
  //   try {
  //     const response = await axiosInstance.post("/users/login", {
  //       email,
  //       password,
  //     });

  //     const { token, name } = response.data;

  //     // ✅ Save token in AsyncStorage
  //     await AsyncStorage.setItem("token", token);

  //     Toast.show({
  //       type: "success",
  //       text1: "Login Successful 🎉",
  //       text2: `Welcome back, ${name}`,
  //     });

  //     router.push("/");
  //   } catch (err: any) {
  //     Toast.show({
  //       type: "error",
  //       text1: "Login Failed",
  //       text2: err.response?.data?.message || "Something went wrong",
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleLogin = async () => {
    if (!email || !password) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Please enter both email and password",
      });
      return;
    }
  
    setLoading(true);
    try {
      const response = await axiosInstance.post("/users/login", {
        email,
        password,
      });
  
      // ✅ abhi backend se userId bhi aayega
      const { token, name, userId } = response.data;
  
      // ✅ Save token and userId
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("userId", userId);
  
      Toast.show({
        type: "success",
        text1: "Login Successful 🎉",
        text2: `Welcome back, ${name}`,
      });
  
      router.push("/");
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: "Login Failed",
        text2: err.response?.data?.message || "Something went wrong",
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
            <Text style={styles.title}>Login</Text>

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

            <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
              <Text style={styles.buttonText}>{loading ? "Logging in..." : "Login"}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push("/screens/authuser/signup")}>
              <Text style={styles.signupLink}>Don’t have an account? Sign Up</Text>
            </TouchableOpacity>
             <TouchableOpacity onPress={() => router.push("/screens/authuser/forget-password")}>
              <Text style={styles.signupLink}>cant't remeber  ? forget-password</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ✅ Toast Component */}
      <Toast />
    </View>
  );
};

export default LoginScreen;

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
  button: {
    backgroundColor: "#2a5bd7",
    paddingVertical: hp("1.8%"),
    borderRadius: 12,
    alignItems: "center",
    marginTop: hp("1%"),
  },
  buttonText: { color: "#fff", fontSize: wp("4.5%"), fontWeight: "bold" },
  signupLink: {
    textAlign: "center",
    marginTop: hp("2%"),
    color: "#2a5bd7",
    fontWeight: "600",
    fontSize: wp("4%"),
  },
});
