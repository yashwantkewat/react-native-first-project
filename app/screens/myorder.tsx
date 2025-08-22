import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import axiosInstance from "../../service/axiosInstance";
import dayjs from "dayjs";

const { width } = Dimensions.get("window");
const BOTTOM_BAR_HEIGHT = 100; // 👈 adjust according to your BottomBar height

type OrderItem = {
  image: string;
  price: number;
  quantity: number;
  productName: string, // ✅ product name add

};

type Order = {
  status: string;
  expectedDelivery?: string;   // 👈 deliveryDate → expectedDelivery
  items: OrderItem[];
};


type ApiResponse = {
  orders: Order[];
};

const formatCurrency = (n: number) => {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(n);
  } catch {
    return `₹${Math.round(n)}`;
  }
};

const OrderHistoryMinimal: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setError(null);
    try {
      const res = await axiosInstance.get<ApiResponse>("/cart/order-history");
      setOrders(res.data?.orders ?? []);
    } catch (e: any) {
      setError(e?.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchOrders();
  }, [fetchOrders]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.muted}>Loading your orders…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={fetchOrders}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {/* ✅ Header */}
      <View style={styles.header}>
        <Link href="/" asChild>
          <TouchableOpacity>
            <Ionicons name="arrow-back" size={24} color="#111827" />
          </TouchableOpacity>
        </Link>
        <Text style={styles.headerTitle}>MY ORDERS</Text>
        <View style={{ width: 24 }} />
      </View>

      {orders.length === 0 ? (
        <View style={[styles.center, { paddingBottom: BOTTOM_BAR_HEIGHT }]}>
          <Text style={styles.emptyTitle}>No orders yet</Text>
          <Text style={styles.muted}>You’ll see your past orders here.</Text>
          <TouchableOpacity style={styles.shopBtn}>
            <Text style={styles.shopText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(_, idx) => `order-${idx}`}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: BOTTOM_BAR_HEIGHT }, // 👈 extra space for BottomBar
          ]}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item }) => <OrderCard order={item} />}
        />
      )}
    </View>
  );
};

const OrderCard: React.FC<{ order: Order }> = ({ order }) => {
  const total = useMemo(
    () =>
      order.items.reduce(
        (acc, it) => acc + (it.price || 0) * (it.quantity || 0),
        0
      ),
    [order.items]
  );

  const normalizeImageUrl = (url: string) => {
    if (!url) return "";
    return url.replace("http://localhost:5000", "http://10.0.2.2:5000");
  };


  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{order.status}</Text>
        <Text style={styles.dateText}>
          {order.expectedDelivery
            ? `Expected Delivery: ${dayjs(order.expectedDelivery).format("DD MMM, YYYY")}`
            : ""}
        </Text>

      </View>




      <View style={styles.itemsWrap}>
        {order.items.map((it, idx) => (
          <View style={styles.itemRow} key={`${idx}-${it.image}`}>

            <Image
              source={{ uri: normalizeImageUrl(it.image) }}
              style={styles.itemImage}
              resizeMode="cover"
            />

            <View style={styles.itemRight}>
              <View style={styles.itemTopRow}>
                <Text style={styles.qtyChip}>{it.productName}</Text>
                <Text style={styles.qtyChip}>Qty: {it.quantity}</Text>
                <Text style={styles.priceText}>{formatCurrency(it.price)}</Text>
              </View>

            </View>
          </View>
        ))}
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.totalWrap}>
          <Text style={styles.totalLabel}>Order Total</Text>
          <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
        </View>
        <View style={styles.feedbackEmptyBadge}>
          <Text style={styles.feedbackEmptyText}>Add feedback</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: width * 0.05,
    paddingVertical: width * 0.04,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e5e7eb",
    backgroundColor: "#fff",
  },
  headerTitle: {
    fontSize: width * 0.045,
    fontWeight: "700",
    textTransform: "uppercase",
    color: "#111827",
  },

  listContent: {
    padding: width * 0.04,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: width * 0.06,
  },
  muted: {
    marginTop: 8,
    color: "#6b7280",
    fontSize: width * 0.035,
  },
  errorText: {
    color: "#ef4444",
    fontSize: width * 0.04,
    marginBottom: 12,
    textAlign: "center",
  },
  retryBtn: {
    paddingHorizontal: width * 0.04,
    paddingVertical: width * 0.025,
    borderRadius: 12,
    backgroundColor: "#111827",
  },
  retryText: {
    color: "#fff",
    fontWeight: "600",
  },
  emptyTitle: {
    fontSize: width * 0.05,
    fontWeight: "700",
    marginBottom: 6,
  },
  shopBtn: {
    marginTop: 14,
    paddingHorizontal: width * 0.04,
    paddingVertical: width * 0.025,
    borderRadius: 12,
    backgroundColor: "#2563eb",
  },
  shopText: { color: "#fff", fontWeight: "600" },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: width * 0.035,
    marginBottom: width * 0.035,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    width: "100%",
  },
  cardHeader: {
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: width * 0.04,
    fontWeight: "700",
    color: "#10b981",
    marginBottom: 2,
  },
  dateText: {
    color: "#6b7280",
    fontSize: width * 0.033,
  },
  itemsWrap: {
    marginTop: 6,
  },
  itemRow: {
    flexDirection: "row",
    paddingVertical: width * 0.025,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e5e7eb",
  },
  itemImage: {
    width: width * 0.18,
    height: width * 0.18,
    borderRadius: 12,
    backgroundColor: "#f3f4f6",
  },
  itemRight: {
    flex: 1,
    marginLeft: width * 0.03,
    justifyContent: "center",
  },
  itemTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  qtyChip: {
    fontSize: width * 0.035,
    fontWeight: "600",
    paddingHorizontal: width * 0.025,
    paddingVertical: width * 0.015,
    borderRadius: 999,
    backgroundColor: "#f1f5f9",
    overflow: "hidden",
  },
  priceText: {
    fontSize: width * 0.04,
    fontWeight: "700",
  },
  lineTotal: {
    marginTop: 4,
    color: "#6b7280",
    fontSize: width * 0.032,
  },
  cardFooter: {
    marginTop: 10,
  },
  totalWrap: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: width * 0.035,
    color: "#374151",
  },
  totalValue: {
    fontSize: width * 0.045,
    fontWeight: "800",
  },
  feedbackEmptyBadge: {
    borderRadius: 12,
    padding: width * 0.025,
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  feedbackEmptyText: {
    fontSize: width * 0.033,
    color: "#6b7280",
  },
});

export default OrderHistoryMinimal;
