import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import axiosInstance from "../../service/axiosInstance";
import Toast from "react-native-toast-message";

interface CartItem {
  _id: string;
  productId: {
    _id: string;
    name: string;
    price: number;
    images: string[];
  };
  quantity: number;
  total: number;
}

const CheckoutScreen = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [subTotal, setSubTotal] = useState(0);
  const deliveryCharge = 3.5;

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await axiosInstance.get("/cart");
      setCart(res.data);

      // ✅ calculate subtotal
      const subtotal = res.data.reduce(
        (sum: number, item: CartItem) => sum + item.total,
        0
      );
      setSubTotal(subtotal);
    } catch (err) {
      console.log("Error fetching cart", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    try {
      const res = await axiosInstance.post("/cart/checkout");
      
      // ✅ Show success toast
      Toast.show({
        type: "success",
        text1: "Success 🎉",
        text2: "Your order has been placed successfully!",
        position: "top",
      });
  
      setCart([]); // empty cart after checkout
      setSubTotal(0);
    } catch (err) {
      console.log("Checkout error", err);
      
      // ✅ Show error toast
      Toast.show({
        type: "error",
        text1: "Error ❌",
        text2: "Failed to checkout. Please try again.",
        position: "top",
      });
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="green" style={{ marginTop: 50 }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Cart</Text>

      <FlatList
        data={cart}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <Image
              source={{ uri: item.productId.images[0] }}
              style={styles.image}
            />
            <View style={styles.info}>
              <Text style={styles.name}>{item.productId.name}</Text>
              <Text style={styles.price}>${item.productId.price.toFixed(2)}</Text>
            </View>
            <Text style={styles.qty}>x{item.quantity}</Text>
            <Text style={styles.total}>${item.total.toFixed(2)}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 20, color: "gray" }}>
            Your cart is empty 🛒
          </Text>
        }
      />

      {/* Bottom Summary */}
      <View style={styles.summary}>
        <View style={styles.row}>
          <Text style={styles.label}>Subtotal</Text>
          <Text style={styles.value}>${subTotal.toFixed(2)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Delivery</Text>
          <Text style={styles.value}>${deliveryCharge.toFixed(2)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>
            ${(subTotal + deliveryCharge).toFixed(2)}
          </Text>
        </View>

        <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout}>
          <Text style={styles.checkoutText}>placeorder</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 15,
    color: "#333",
  },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 12,
    marginVertical: 6,
    padding: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  image: { width: 60, height: 60, borderRadius: 8 },
  info: { flex: 1, marginLeft: 12 },
  name: { fontSize: 15, fontWeight: "500", color: "#222" },
  price: { fontSize: 13, color: "#666", marginTop: 3 },
  qty: { fontSize: 14, fontWeight: "bold", marginRight: 10, color: "#444" },
  total: { fontSize: 15, fontWeight: "bold", color: "green" },
  summary: {
    backgroundColor: "#fff",
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  label: { fontSize: 15, color: "#666" },
  value: { fontSize: 15, fontWeight: "500", color: "#333" },
  totalLabel: { fontSize: 17, fontWeight: "bold", color: "#000" },
  totalValue: { fontSize: 17, fontWeight: "bold", color: "green" },
  checkoutBtn: {
    marginTop: 16,
    backgroundColor: "green",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  checkoutText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 1,
  },
});

export default CheckoutScreen;
