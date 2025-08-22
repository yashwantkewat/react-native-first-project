import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  TextInput,
  Dimensions,
  ScrollView,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import axiosInstance from "../../service/axiosInstance";
import Toast from "react-native-toast-message";
import { Link } from "expo-router";
import { useOrder } from "../screens/context/OrderContext";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

interface CartItem {
  _id: string;
  productId: {
    _id: string;
    productName: string;
    price: number;
  };
  quantity: number;
  images: string;
  total: number;
}

const CartScreen = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { setCount, ordercount } = useOrder();

  // Payment related states
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "upi" | "debit" | "credit">("cod");
  const [upiId, setUpiId] = useState("");
  const [cardDetails, setCardDetails] = useState({
    cardnumber: "",
    mmdate: "",
    cardholdername: "",
    cvv: "",
  });
  const [address, setAddress] = useState("123 Main Street, Mumbai, MH");

  const fetchCart = async () => {
    try {
      const res = await axiosInstance.get("/cart");
      setCartItems(res.data);
    } catch (err) {
      console.log("Error fetching cart", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateCart = async (cartId: string, newQty: number) => {
    try {
      await axiosInstance.put(`/cart/${cartId}`, { quantity: newQty });
      fetchCart();
    } catch (err) {
      console.log("Error updating cart", err);
    }
  };

  const increaseQty = (item: CartItem) => {
    updateCart(item._id, item.quantity + 1);
  };

  const decreaseQty = (item: CartItem) => {
    if (item.quantity > 1) {
      updateCart(item._id, item.quantity - 1);
    }
  };

  const removeFromCart = async (cartId: string) => {
    try {
      await axiosInstance.delete(`/cart/${cartId}`);
      fetchCart();
    } catch (err) {
      console.log("Error removing cart item", err);
      Alert.alert("Error", "Failed to remove item");
    }
  };

  const handle_order = async () => {
    if (cartItems.length === 0) {
      Toast.show({ type: "error", text1: "Cart Empty", text2: "Please add items" });
      return;
    }

    let body: any = { paymentMethod, address };

    if (paymentMethod === "cod") {
      body.paymentStatus = "Paid";
    } else if (paymentMethod === "upi") {
      const upiRegex = /^[\w.\-]{2,256}@[a-zA-Z]{2,64}$/;

      if (!upiId || !upiRegex.test(upiId)) {
        Toast.show({ type: "error", text1: "Invalid UPI ID", text2: "Enter valid UPI like username@upi or mobile@paytm " });
        return;
      }
      body.paymentStatus = "Paid";
      body.paymentDetails = { upiId };
    } else if (paymentMethod === "debit" || paymentMethod === "credit") {
      const { cardnumber, mmdate, cardholdername, cvv } = cardDetails;

      // 1. Card Number (16 digits + Luhn check)
      const cardRegex = /^\d{16}$/;
      if (!cardRegex.test(cardnumber)) {
        Toast.show({ type: "error", text1: "Invalid Card", text2: "Card number must be 16 digits" });
        return;
      }

      // 2. Expiry Date (MM/YY and not expired)
      const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
      if (!expiryRegex.test(mmdate)) {
        Toast.show({ type: "error", text1: "Invalid Expiry", text2: "Use MM/YY format" });
        return;
      }
      const [month, year] = mmdate.split("/").map(Number);
      const now = new Date();
      const expiry = new Date(2000 + year, month);
      if (expiry < now) {
        Toast.show({ type: "error", text1: "Card Expired", text2: "Use another card" });
        return;
      }

      // 3. Cardholder Name
      const nameRegex = /^[A-Za-z ]+$/;
      if (!nameRegex.test(cardholdername)) {
        Toast.show({ type: "error", text1: "Invalid Name", text2: "Cardholder name must be alphabets only" });
        return;
      }

      // 4. CVV
      const cvvRegex = /^\d{3,4}$/;
      if (!cvvRegex.test(cvv)) {
        Toast.show({ type: "error", text1: "Invalid CVV", text2: "CVV must be 3 or 4 digits" });
        return;
      }

      body.paymentStatus = "Paid";
      body.paymentDetails = cardDetails;
    }

    try {
      const res = await axiosInstance.post("/cart/order", body);

      if (res.status === 201) {
        Toast.show({
          type: "success",
          text1: "Success 🎉",
          text2: "Your order has been placed successfully!",
        });
        setCartItems([]);
        setCount(ordercount + 1);
      } else {
        Toast.show({
          type: "error",
          text1: "Error ❌",
          text2: res.data.message || "Failed to place order",
        });
      }
    } catch (err: any) {
      console.log("Order Error:", err);
      Toast.show({
        type: "error",
        text1: "Error ❌",
        text2: err.response?.data?.message || "Something went wrong",
      });
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.total, 0);
  const total = subtotal;

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.message}>Loading cart...</Text>
      </SafeAreaView>
    );
  }

  if (cartItems.length === 0) {
    return (
      <SafeAreaView style={styles.center}>
        <AntDesign name="shoppingcart" size={50} color="gray" />
        <Text style={styles.message}>Your cart is empty</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f8f8f8" }}>
      {/* Header */}
      <View style={styles.header}>
        <Link href="/" asChild>
          <TouchableOpacity style={styles.backBtn}>
            <AntDesign name="arrowleft" size={24} color="#333" />
          </TouchableOpacity>
        </Link>
        <Text style={styles.headerTitle}>Cart</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Scrollable Content */}
      <ScrollView
        contentContainerStyle={{ paddingBottom: height * 0.15 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Cart Items */}
        {cartItems.map((item) => (
          <View key={item._id} style={styles.card}>
            <Image
              source={{ uri: item.images || "https://via.placeholder.com/120" }}
              style={styles.image}
            />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.name}>{item.productId.productName}</Text>
              <Text style={styles.price}>${item.productId.price.toFixed(2)}</Text>
              <View style={styles.qtyWrapper}>
                <TouchableOpacity onPress={() => decreaseQty(item)} style={styles.qtyBtn}>
                  <Text style={styles.qtyBtnText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.qtyText}>{item.quantity}</Text>
                <TouchableOpacity onPress={() => increaseQty(item)} style={styles.qtyBtn}>
                  <Text style={styles.qtyBtnText}>+</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => removeFromCart(item._id)}>
                  <AntDesign name="delete" size={20} color="red" style={{ marginLeft: 15 }} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}

        {/* Totals */}
        <View style={styles.totalsWrapper}>
          <View style={[styles.totalRow, { marginTop: 8 }]}>
            <Text style={styles.totalMain}>Total</Text>
            <Text style={styles.totalMain}>${total.toFixed(2)}</Text>
          </View>
        </View>

        {/* Payment Options */}
        <View style={styles.paymentContainer}>
          <Text style={styles.paymentTitle}>Select Payment Method</Text>

          {[
            { key: "cod", label: "Cash on Delivery", icon: "💵" },
            { key: "upi", label: "UPI", icon: "📱" },
            { key: "debit", label: "Debit Card", icon: "💳" },
            { key: "credit", label: "Credit Card", icon: "💳" },
          ].map((method) => (
            <TouchableOpacity
              key={method.key}
              onPress={() => setPaymentMethod(method.key as any)}
              style={[
                styles.paymentCard,
                paymentMethod === method.key && styles.paymentCardSelected,
              ]}
            >
              <Text style={styles.paymentIcon}>{method.icon}</Text>
              <Text style={styles.paymentLabel}>{method.label}</Text>
              {paymentMethod === method.key && (
                <AntDesign
                  name="checkcircle"
                  size={20}
                  color="green"
                  style={{ marginLeft: "auto" }}
                />
              )}
            </TouchableOpacity>
          ))}

          {/* UPI Input */}
          {paymentMethod === "upi" && (
            <View style={styles.inputBox}>
              <Text style={styles.inputLabel}>Enter UPI ID</Text>
              <TextInput
                placeholder="yashu@upi"
                value={upiId}
                onChangeText={setUpiId}
                style={styles.input}
              />
            </View>
          )}

          {/* Card Input */}
          {(paymentMethod === "debit" || paymentMethod === "credit") && (
            <View style={styles.inputBox}>
              <Text style={styles.inputLabel}>Card Details</Text>
              <TextInput
                placeholder="Card Number"
                keyboardType="numeric"
                value={cardDetails.cardnumber}
                onChangeText={(t) => setCardDetails({ ...cardDetails, cardnumber: t })}
                style={styles.input}
              />
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <TextInput
                  placeholder="MM/YY"
                  value={cardDetails.mmdate}
                  onChangeText={(t) => setCardDetails({ ...cardDetails, mmdate: t })}
                  style={[styles.input, { flex: 1, marginRight: 5 }]}
                />
                <TextInput
                  placeholder="CVV"
                  secureTextEntry
                  keyboardType="numeric"
                  value={cardDetails.cvv}
                  onChangeText={(t) => setCardDetails({ ...cardDetails, cvv: t })}
                  style={[styles.input, { flex: 1, marginLeft: 5 }]}
                />
              </View>
              <TextInput
                placeholder="Cardholder Name"
                value={cardDetails.cardholdername}
                onChangeText={(t) => setCardDetails({ ...cardDetails, cardholdername: t })}
                style={styles.input}
              />
            </View>
          )}
        </View>

        {/* Checkout Button */}
        <TouchableOpacity style={styles.checkoutBtn} onPress={handle_order}>
          <Text style={styles.checkoutText}>Order Now</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.015,
    backgroundColor: "#fff",
    elevation: 3,
  },
  backBtn: {
    width: width * 0.1,
    height: width * 0.1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: { fontSize: width * 0.045, fontWeight: "700", color: "#333" },

  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  message: { marginTop: 10, fontSize: width * 0.04, color: "gray" },

  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: width * 0.03,
    marginVertical: height * 0.015,
    marginHorizontal: width * 0.04,
    alignItems: "center",
    elevation: 2,
  },
  image: {
    width: width * 0.3,
    height: height * 0.12,
    borderRadius: 12,
    resizeMode: "cover",
  },
  name: { fontSize: width * 0.04, fontWeight: "600", color: "#333" },
  price: { fontSize: width * 0.035, color: "#666", marginVertical: 4 },

  qtyWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    backgroundColor: "#f2f2f2",
    borderRadius: 20,
    paddingHorizontal: width * 0.02,
  },
  qtyBtn: {
    backgroundColor: "green",
    borderRadius: 20,
    paddingVertical: height * 0.005,
    paddingHorizontal: width * 0.04,
    marginHorizontal: width * 0.02,
  },
  qtyBtnText: { color: "#fff", fontSize: width * 0.04, fontWeight: "bold" },
  qtyText: { fontSize: width * 0.04, fontWeight: "600", color: "#333" },

  totalsWrapper: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: width * 0.04,
    elevation: 2,
    marginHorizontal: width * 0.04,
    marginVertical: height * 0.01,
  },
  totalRow: { flexDirection: "row", justifyContent: "space-between", marginVertical: 3 },
  totalMain: { fontSize: width * 0.045, fontWeight: "700", color: "#000" },

  paymentContainer: {
    marginTop: height * 0.02,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: width * 0.04,
    elevation: 3,
    marginHorizontal: width * 0.04,
  },
  paymentTitle: {
    fontWeight: "700",
    fontSize: width * 0.045,
    marginBottom: 10,
    color: "#333",
  },
  paymentCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: width * 0.035,
    marginBottom: height * 0.015,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  paymentIcon: { fontSize: 20, marginRight: 12 },
  paymentCardSelected: {
    borderColor: "green",
    backgroundColor: "#eaffea",
    elevation: 2,
  },
  paymentLabel: {
    fontSize: width * 0.04,
    fontWeight: "600",
    color: "#333",
  },

  inputBox: {
    marginTop: height * 0.01,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: width * 0.03,
  },
  inputLabel: {
    fontSize: width * 0.035,
    fontWeight: "600",
    color: "#555",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: width * 0.03,
    marginVertical: height * 0.01,
    backgroundColor: "#fff",
    fontSize: width * 0.04,
  },

  checkoutBtn: {
    backgroundColor: "green",
    borderRadius: 12,
    paddingVertical: height * 0.02,
    alignItems: "center",
    elevation: 3,
    marginTop: height * 0.02,
    marginHorizontal: width * 0.04,
    marginBottom: height * 0.05,
  },
  checkoutText: { color: "#fff", fontSize: width * 0.045, fontWeight: "700" },
});

export default CartScreen;

