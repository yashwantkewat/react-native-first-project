import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Dimensions,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import styles from "../../style/AddAddressScreen.styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance from "../../service/axiosInstance";

const { width } = Dimensions.get("window");

const AddAddressScreen = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    zip: "",
    city: "",
    country: "",
  });

  const [loading, setLoading] = useState(true);

  // Fetch profile and prefill form
  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      const res = await axiosInstance.get("/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const user = res.data.user;

      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "", // ensure backend is returning phone field
      }));
    } catch (err: any) {
      console.error("Failed to fetch profile:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    const { name, email, phone, address } = formData;
    if (!name || !email || !phone || !address) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    // 🔁 API call for saving address
    console.log("Sending data to API...", formData);
    Alert.alert("Success", "Address submitted");
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Add Address</Text>

      <ScrollView contentContainerStyle={styles.form}>
        {[
          { label: "Name", field: "name", icon: "person-outline" },
          { label: "Email", field: "email", icon: "mail-outline" },
          { label: "Phone", field: "phone", icon: "call-outline" },
          { label: "Address", field: "address", icon: "location-outline" },
          { label: "Zip", field: "zip", icon: "mail-open-outline" },
          { label: "City", field: "city", icon: "business-outline" },
          { label: "Country", field: "country", icon: "globe-outline" },
        ].map(({ label, field, icon }) => (
          <View key={field} style={styles.inputContainer}>
            <Icon name={icon} size={20} color="#666" style={styles.icon} />
            <TextInput
              placeholder={label}
              value={formData[field as keyof typeof formData]}
              onChangeText={(value) => handleChange(field, value)}
              style={styles.input}
              placeholderTextColor="#999"
            />
          </View>
        ))}

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit Address</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddAddressScreen;
