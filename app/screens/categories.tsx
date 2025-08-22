import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import styles from "../../style/categories.styles";
import { Link, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance from "../../service/axiosInstance";

interface Product {
  _id: string;
  productName: string;
  category: string;
  price: number;
  description?: string;
  images?: string[];
}


const categoryColors: Record<string, { bg: string; icon: string }> = {
  grocery: { bg: "#E8F5E8", icon: "#4CAF50" },
  flower: { bg: "#FFF3E0", icon: "#FF9800" },
  electronics: { bg: "#E3F2FD", icon: "#2196F3" },
  clothes: { bg: "#FCE4EC", icon: "#E91E63" },
};

const CategoriesScreen = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  
const fetchCategories = async () => {
  try {
    const token = await AsyncStorage.getItem("token");

    // explicitly type the response
    const res = await axiosInstance.get<Product[]>("/products", {
      headers: { Authorization: `Bearer ${token}` },
    });

    // filter products with valid category and extract string categories
    const uniqueCategories: string[] = Array.from(
      new Set(
        res.data
          .filter((p) => p.category && typeof p.category === "string")
          .map((p) => p.category as string)
      )
    );

    setCategories(uniqueCategories);
  } catch (err: any) {
    console.error("Error fetching categories:", err.response?.data || err.message);
  } finally {
    setLoading(false);
  }
};
  

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCategoryPress = (name: string) => {
    router.push(`/screens/CategoryProducts?category=${name}`);
  };

  if (loading) {
    return (
      <SafeAreaView
        style={[styles.container, { justifyContent: "center", alignItems: "center" }]}
      >
        <ActivityIndicator size="large" color="#4CAF50" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Link href="/" style={styles.backButton}>
            <Text style={styles.backArrow}>←</Text>
          </Link>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Categories</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterIcon}>☰</Text>
        </TouchableOpacity>
      </View>

      {/* Categories Grid */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.categoriesGrid}>
          {categories.map((cat) => {
            const color = categoryColors[cat] || { bg: "#E0E0E0", icon: "#666" };
            return (
              <TouchableOpacity
                key={cat}
                style={styles.categoryItem}
                onPress={() => handleCategoryPress(cat)}
              >
                <View style={[styles.iconContainer, { backgroundColor: color.bg }]}>
                  <Text style={[styles.categoryIcon, { color: color.icon }]}>
                    {cat[0].toUpperCase()} {/* first letter */}
                  </Text>
                </View>
                <Text style={styles.categoryName}>{cat}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CategoriesScreen;
