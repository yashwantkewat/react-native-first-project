import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert, ScrollView } from "react-native";
import axiosInstance from "../../service/axiosInstance";
import Icon from "react-native-vector-icons/MaterialIcons";

interface User {
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

const AboutMeScreen: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchAboutMe = async () => {
    try {
      const res = await axiosInstance.get("/users/about-me");
      setUser(res.data.user);
    } catch (error: any) {
      console.error(error);
      Alert.alert("Error", error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAboutMe();
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.loader}>
        <Text style={styles.errorText}>No user data found</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>About Me</Text>

      <View style={styles.card}>
        <View style={styles.row}>
          <Icon name="person" size={24} color="#4CAF50" />
          <Text style={styles.value}>{user.name}</Text>
        </View>

        <View style={styles.row}>
          <Icon name="email" size={24} color="#4CAF50" />
          <Text style={styles.value}>{user.email}</Text>
        </View>

        <View style={styles.row}>
          <Icon name="verified-user" size={24} color="#4CAF50" />
          <Text style={styles.value}>{user.role}</Text>
        </View>

        <View style={styles.row}>
          <Icon name="calendar-today" size={24} color="#4CAF50" />
          <Text style={styles.value}>
            {new Date(user.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default AboutMeScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F8F8F8",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ddd",
  },
  value: {
    fontSize: 16,
    color: "#555",
    marginLeft: 10,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F8F8",
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
});
