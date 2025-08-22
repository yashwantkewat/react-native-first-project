import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Image,
  Dimensions,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import axiosInstance from "../../service/axiosInstance";

interface Product {
  _id: string;
  productName: string;
  price: number;
  category: string;
  description?: string;
  images?: string[];
}

const { width } = Dimensions.get("window");

const CategoryProductsScreen: React.FC = () => {
  const { category } = useLocalSearchParams<{ category: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await axiosInstance.get("/products");
      const filtered = res.data.filter((p: Product) => p.category === category);
      setProducts(filtered);
    } catch (err: any) {
      console.error("Failed to fetch products:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (category) fetchProducts();
  }, [category]);

  if (loading) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" color="#4CAF50" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, padding: 16, backgroundColor: "#fff" }}>
      <Text style={{ fontSize: 22, fontWeight: "600", marginBottom: 12 }}>
        {category} Products
      </Text>
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 24,
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        {products.length === 0 && (
          <Text style={{ color: "#666" }}>No products found for this category.</Text>
        )}

{products.map((prod) => (
  <View
    key={prod._id}
    style={{
      width: width / 2 - 24,
      backgroundColor: "#F8F9FA",
      borderRadius: 12,
      marginBottom: 16,
      overflow: "hidden",
    }}
  >
    <Image
      source={{
        uri:
          prod.images && prod.images.length > 0
            ? prod.images[0]
            : "https://via.placeholder.com/150",
      }}
      style={{ width: "100%", height: 120, resizeMode: "cover" }}
    />
    <View style={{ padding: 12 }}>
      <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 4 }}>
        {prod.productName}
      </Text>
      {prod.description && (
        <Text style={{ fontSize: 12, color: "#666", marginBottom: 8 }}>
          {prod.description.length > 50
            ? prod.description.substring(0, 50) + "..."
            : prod.description}
        </Text>
      )}
      <Text style={{ fontSize: 14, fontWeight: "500", color: "#4CAF50" }}>
        ₹{prod.price}
      </Text>
    </View>
  </View>
))}

      </ScrollView>
    </SafeAreaView>
  );
};

export default CategoryProductsScreen;
