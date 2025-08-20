import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import axiosInstance from "../../service/axiosInstance";
import Toast from "react-native-toast-message"; // 👈 import

interface Product {
  _id: string;
  name: string;
  price: number;
  weight: string;
  images: string[];
}

const VegetablesScreen = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axiosInstance.get("/products");
        setProducts(res.data);
      } catch (err) {
        console.log("Error fetching products", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const addToCart = async (productId: string) => {
    try {
      await axiosInstance.post("/cart", {
        productId,
        quantity: 1,
      });

      // ✅ Success toast
      Toast.show({
        type: "success",
        text1: "Added to Cart",
        text2: "Product has been added successfully 👌",
      });
    } catch (err) {
      console.log("Error adding to cart", err);

      // ❌ Error toast
      Toast.show({
        type: "error",
        text1: "Failed",
        text2: "Could not add product to cart ❌",
      });
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="green" style={{ marginTop: 50 }} />;
  }

  return (
    <FlatList
      data={products}
      numColumns={2}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Image source={{ uri: item.images[0] }} style={styles.image} />
          <Text style={styles.price}>${item.price.toFixed(2)}</Text>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.weight}>{item.weight}</Text>

          <TouchableOpacity style={styles.cartBtn} onPress={() => addToCart(item._id)}>
            <AntDesign name="shoppingcart" size={16} color="green" />
            <Text style={styles.cartText}> Add to cart</Text>
          </TouchableOpacity>
        </View>
      )}
      contentContainerStyle={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    padding: 8,
  },
  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    margin: 8,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: "center",
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  price: {
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 8,
  },
  name: {
    fontSize: 14,
    color: "#333",
  },
  weight: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
  },
  cartBtn: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "green",
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    justifyContent: "center",
    marginTop: 6,
  },
  cartText: {
    color: "green",
    fontSize: 12,
  },
});

export default VegetablesScreen;
