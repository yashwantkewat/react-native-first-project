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
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance from "../../../service/axiosInstance";

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

  const [image, setImage] = useState<string>("https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZSUyMGxvZ298ZW58MHx8MHx8fDA%3D");
  const [loading, setLoading] = useState(false);

  // Load saved profile from AsyncStorage on mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const stored = await AsyncStorage.getItem("userProfile");
        if (stored) {
          const data: UserProfile = JSON.parse(stored);
          setFormData(data);
          setImage(data.profileImage || "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZSUyMGxvZ298ZW58MHx8MHx8fDA%3D");
        }
      } catch (err) {
        console.error("Failed to load profile from storage:", err);
      }
    };
    loadProfile();
  }, []);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Toast.show({
        type: "error",
        text1: "Permission Denied",
        text2: "Gallery access is required to select an image.",
      });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
      selectionLimit: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setImage(result.assets[0].uri);
    }
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
    if (error) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: error,
      });
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (value) data.append(key, value as string);
      });

      if (image && !image.startsWith("http")) {
        const filename = image.split("/").pop() || "profile.jpg";
        const fileType = filename.split(".").pop() || "jpg";

        data.append("profileImage", {
          uri: image,
          name: filename,
          type: `image/${fileType}`,
        } as any);
      }

      const res = await axiosInstance.put("/users/profile", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Profile updated successfully!",
      });

      // ✅ Save updated profile in AsyncStorage
      const updatedProfile: UserProfile = {
        ...formData,
        profileImage: image,
      };
      await AsyncStorage.setItem("userProfile", JSON.stringify(updatedProfile));

      setFormData(updatedProfile); // live update
    } catch (err: any) {
      console.error(err);
      Toast.show({
        type: "error",
        text1: "Update Failed",
        text2: err.response?.data?.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ScrollView
        contentContainerStyle={[styles.container, loading && { opacity: 0.7 }]}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity onPress={pickImage} style={styles.imageWrapper}>
          <Image
            source={{ uri: image || "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZSUyMGxvZ298ZW58MHx8MHx8fDA%3D" }}
            style={styles.profileImage}
          />
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

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.7 }]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Update Profile</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
      <Toast />
    </>
  );
};

export default ProfileUpdateScreen;

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#fff" },
  imageWrapper: { alignItems: "center", marginBottom: 20 },
  profileImage: { width: 120, height: 120, borderRadius: 60, borderWidth: 2, borderColor: "#ddd" },
  changePhotoText: { color: "#007BFF", marginTop: 8, fontSize: 14 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === "ios" ? 12 : 8,
    marginBottom: 12,
    fontSize: 16,
  },
  button: { backgroundColor: "#7CB342", paddingVertical: 14, borderRadius: 8, alignItems: "center", marginTop: 20 },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});


