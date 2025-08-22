// OrderHistoryScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from "react-native";
import axiosInstance from "../../service/axiosInstance";
import { AntDesign } from "@expo/vector-icons";
import { Link } from "expo-router";

interface OrderItem {
  productId: {
    _id: string;
    productName: string;
    price: number;
    images?: string[];
  };
  quantity: number;
  total: number;
}

interface Order {
  _id: string;
  items: OrderItem[];
  total: number;
  status: string;
  createdAt: string;
}

const OrderHistoryScreen = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await axiosInstance.get("/cart/order-history");
      if (res.data.orders) setOrders(res.data.orders);
    } catch (err) {
      console.log("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="green" />
        <Text style={{ marginTop: 10 }}>Loading Orders...</Text>
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={{ fontSize: 16, color: "gray" }}>No orders found</Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: Order }) => {
    return (
      <View style={styles.card}>
        {/* Order Header */}
        <View style={styles.orderHeader}>
          <Text style={styles.orderId}>#{item._id.slice(-6)}</Text>
          <Text
            style={[
              styles.status,
              item.status === "Pending"
                ? { color: "orange" }
                : item.status === "Delivered"
                ? { color: "green" }
                : { color: "red" },
            ]}
          >
            {item.status}
          </Text>
        </View>

        {/* Products */}
        {item.items.map((i, index) => (
          <View key={index} style={styles.itemRow}>
            {i.productId.images && i.productId.images.length > 0 ? (
              <Image
                source={{ uri: i.productId.images[0] }}
                style={styles.itemImage}
              />
            ) : (
              <View style={[styles.itemImage, styles.imagePlaceholder]}>
                <Text style={{ fontSize: 10, color: "gray" }}>No Img</Text>
              </View>
            )}

            <View style={{ flex: 1 }}>
              <Text style={styles.itemName}>{i.productId.productName}</Text>
              <Text style={styles.itemQty}>
                Qty: {i.quantity} × ₹{i.productId.price}
              </Text>
            </View>

            <Text style={styles.itemTotal}>₹{i.total.toFixed(2)}</Text>
          </View>
        ))}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.date}>
            {new Date(item.createdAt).toLocaleDateString()}{" "}
            {new Date(item.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
          <Text style={styles.total}>
            Total: ₹{(item.total ?? 0).toFixed(2)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f8f8f8" }}>
      {/* 🔝 Custom Header */}
      <View style={styles.header}>
        <Link href="/" asChild>
          <TouchableOpacity style={styles.backBtn}>
            <AntDesign name="arrowleft" size={24} color="#333" />
          </TouchableOpacity>
        </Link>
        <Text style={styles.headerTitle}>Order History</Text>
        <View style={{ width: 40 }} /> 
        {/* spacing ke liye right side */}
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ padding: 15, paddingBottom: 100 }}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: "#fff",
    elevation: 3,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },

  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  orderId: { fontWeight: "700", fontSize: 16, color: "#333" },
  status: { fontWeight: "700", fontSize: 14 },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
    borderBottomWidth: 0.5,
    borderColor: "#eee",
    paddingBottom: 6,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  imagePlaceholder: {
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
  },
  itemName: { fontSize: 15, fontWeight: "500", color: "#333" },
  itemQty: { fontSize: 13, color: "gray", marginTop: 2 },
  itemTotal: { fontSize: 15, fontWeight: "600", color: "#000" },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    alignItems: "center",
  },
  date: { fontSize: 12, color: "gray" },
  total: { fontSize: 16, fontWeight: "700", color: "green" },
});

export default OrderHistoryScreen;
