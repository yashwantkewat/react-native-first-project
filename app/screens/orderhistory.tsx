// OrderHistoryScreen.tsx
import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  ActivityIndicator, 
  TouchableOpacity,
  ScrollView
} from "react-native";
import axiosInstance from "../../service/axiosInstance";

interface OrderItem {
  productId: {
    _id: string;
    name: string;
    price: number;
  };
  quantity: number;
  total: number;
}

interface Order {
  _id: string;
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  tax: number;
  total: number;
  status: string;
  createdAt: string;
}

const OrderHistoryScreen = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
        const res = await axiosInstance.get("/cart/order-history")
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
        <View style={styles.header}>
          <Text style={styles.orderId}>Order ID: {item._id.slice(-6)}</Text>
          <Text style={[styles.status, item.status === "Pending" ? {color: "orange"} : {color: "green"}]}>
            {item.status}
          </Text>
        </View>

        {item.items.map((i, index) => (
  <View key={index} style={styles.itemRow}>
    <Text style={styles.itemName}>{i.productId.name}</Text>
    <Text style={styles.itemQty}>x{i.quantity ?? 0}</Text>
    <Text style={styles.itemTotal}>
      ${ (i.total ?? i.quantity * i.productId.price ?? 0).toFixed(2) }
    </Text>
  </View>
))}

<View style={styles.totals}>
  <Text>Subtotal: ${ (item.subtotal ?? 0).toFixed(2) }</Text>
  <Text>Delivery: ${ (item.deliveryCharge ?? 0).toFixed(2) }</Text>
  <Text>Tax: ${ (item.tax ?? 0).toFixed(2) }</Text>
  <Text style={styles.total}>Total: ${ (item.total ?? 0).toFixed(2) }</Text>
</View>


        <Text style={styles.date}>
          Ordered on: {new Date(item.createdAt).toLocaleDateString()} {new Date(item.createdAt).toLocaleTimeString()}
        </Text>
      </View>
    );
  };

  return (
    <FlatList
      data={orders}
      keyExtractor={(item) => item._id}
      contentContainerStyle={{ padding: 15, paddingBottom: 100 }}
      renderItem={renderItem}
    />
  );
};

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
  },
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  orderId: { fontWeight: "600", fontSize: 14 },
  status: { fontWeight: "700" },
  itemRow: { flexDirection: "row", justifyContent: "space-between", marginVertical: 2 },
  itemName: { flex: 2, fontSize: 14, color: "#333" },
  itemQty: { flex: 1, textAlign: "center", fontSize: 14 },
  itemTotal: { flex: 1, textAlign: "right", fontSize: 14 },
  totals: { marginTop: 10 },
  total: { fontWeight: "700", marginTop: 3 },
  date: { marginTop: 10, fontSize: 12, color: "gray" },
});

export default OrderHistoryScreen;
