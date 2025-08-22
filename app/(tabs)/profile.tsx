import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Platform,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance from "../../service/axiosInstance";
import { useRouter } from "expo-router";

interface UserProfile {
  name: string;
  phone: string;
  address: string;
  zipcode: string;
  city: string;
  country: string;
  password?: string;
  profileImage?: string;
}

const ProfileUpdateScreen: React.FC = () => {
  const router = useRouter();

  const [formData, setFormData] = useState<UserProfile>({
    name: "",
    phone: "",
    address: "",
    zipcode: "",
    city: "",
    country: "",
    password: "",
    profileImage: "",
  });

  const [image, setImage] = useState<string>("https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=500&auto=format&fit=crop&q=60");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const stored = await AsyncStorage.getItem("userProfile");
        if (stored) {
          const data: UserProfile = JSON.parse(stored);
          setFormData(data);
          setImage(data.profileImage || image);
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      }
    };
    loadProfile();
  }, []);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Toast.show({ type: "error", text1: "Permission Denied", text2: "Gallery access required." });
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets?.length > 0) setImage(result.assets[0].uri);
  };

  const handleChange = (key: keyof UserProfile, value: string) => {
    setFormData({ ...formData, [key]: value });
  };

  const validateForm = (): string | null => {
    if (!formData.name.trim()) return "Name is required";
    if (!formData.phone.trim() || formData.phone.length < 10) return "Valid phone is required";
    if (!formData.address.trim()) return "Address is required";
    if (!formData.city.trim()) return "City is required";
    if (!formData.country.trim()) return "Country is required";
    return null;
  };

  const handleSubmit = async () => {
    const error = validateForm();
    if (error) return Toast.show({ type: "error", text1: "Validation Error", text2: error });
    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) data.append(key, String(value));
      });
      if (image && !image.startsWith("http")) {
        const filename = image.split("/").pop() || "profile.jpg";
        const fileType = filename.split(".").pop() || "jpg";
        data.append("profileImage", { uri: image, name: filename, type: `image/${fileType}` } as any);
      }
      const token = await AsyncStorage.getItem("token");
      const res = await axiosInstance.put("/users/profile", data, {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
      });
      const updatedProfile: UserProfile = res.data.user;
      Toast.show({ type: "success", text1: "Success", text2: "Profile updated successfully!" });
      await AsyncStorage.setItem("userProfile", JSON.stringify(updatedProfile));
      setFormData(updatedProfile);
      setImage(updatedProfile.profileImage || image);
    } catch (err: any) {
      console.error("Profile update error:", err.response?.data || err.message);
      Toast.show({ type: "error", text1: "Update Failed", text2: err.response?.data?.message || "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        await axiosInstance.post("/users/logout", {}, { headers: { Authorization: `Bearer ${token}` } });
      }
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("userProfile");
      router.replace("/screens/authuser/Login");
    } catch (err: any) {
      console.error("Logout error:", err.response?.data || err.message);
      Toast.show({ type: "error", text1: "Logout Failed", text2: err.response?.data?.message || "Something went wrong" });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 120 }} keyboardShouldPersistTaps="handled">
        <TouchableOpacity onPress={pickImage} style={styles.imageWrapper}>
          <Image source={{ uri: image }} style={styles.profileImage} />
          <Text style={styles.changePhotoText}>Change Photo</Text>
        </TouchableOpacity>

        {[
          { key: "name", label: "Full Name" },
          { key: "phone", label: "Phone" },
          { key: "address", label: "Address" },
          { key: "zipcode", label: "Zip Code" },
          { key: "city", label: "City" },
          { key: "country", label: "Country" },
          { key: "password", label: "New Password" },
        ].map((field) => (
          <TextInput
            key={field.key}
            style={styles.input}
            placeholder={field.label}
            value={formData[field.key as keyof UserProfile] || ""}
            secureTextEntry={field.key === "password"}
            onChangeText={(text) => handleChange(field.key as keyof UserProfile, text)}
          />
        ))}

        <TouchableOpacity style={[styles.button, loading && { opacity: 0.7 }]} onPress={handleSubmit} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Update Profile</Text>}
        </TouchableOpacity>
      </ScrollView>

      {/* Logout button sticky at bottom */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>

      <Toast />
    </SafeAreaView>
  );
};

export default ProfileUpdateScreen;

const styles = StyleSheet.create({
  imageWrapper: { alignItems: "center", marginBottom: 20 },
  profileImage: { width: 120, height: 120, borderRadius: 60, borderWidth: 2, borderColor: "#ddd" },
  changePhotoText: { color: "#007BFF", marginTop: 8, fontSize: 14 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, paddingHorizontal: 14, paddingVertical: Platform.OS === "ios" ? 12 : 8, marginBottom: 12, fontSize: 16 },
  button: { backgroundColor: "#7CB342", paddingVertical: 14, borderRadius: 8, alignItems: "center", marginTop: 20 },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  logoutButton: { position: "absolute", bottom: 70, left: 20, right: 20, backgroundColor: "#7CB342", paddingVertical: 14, borderRadius: 8, alignItems: "center" },
  logoutButtonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});
