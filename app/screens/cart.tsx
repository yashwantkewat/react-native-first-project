import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,Alert
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import axiosInstance from "../../service/axiosInstance";
import Toast from 'react-native-toast-message';

interface CartItem {
  _id: string;
  productId: {
    _id: string;
    name: string;
    price: number;
    weight: string;
    images: string[];
  };
  quantity: number;
  total: number;
}

const CartScreen = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [promo, setPromo] = useState("");

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

  const subtotal = cartItems.reduce((sum, item) => sum + item.total, 0);
  const delivery = subtotal > 0 ? 3.5 : 0;
  const total = subtotal + delivery;

  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={styles.message}>Loading cart...</Text>
      </View>
    );
  }

  if (cartItems.length === 0) {
    return (
      <View style={styles.center}>
        <AntDesign name="shoppingcart" size={50} color="gray" />
        <Text style={styles.message}>Your cart is empty</Text>
      </View>
    );
  }

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
      Toast.show({
        type: 'error',
        text1: 'Cart Empty',
        text2: 'Please add items to checkout'
      });
      return;
    }
  
    try {
      const res = await axiosInstance.post("/cart/create-order");
  
      if (res.status === 201) {
        Toast.show({
          type: 'success',
          text1: 'Success 🎉',
          text2: 'Your order has been placed successfully!'
        });
        setCartItems([]); // Empty cart
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error ❌',
          text2: res.data.message || 'Failed to place order'
        });
      }
    } catch (err: any) {
      console.log("Order Error:", err);
      Toast.show({
        type: 'error',
        text1: 'Error ❌',
        text2: err.response?.data?.message || 'Something went wrong'
      });
    }
  };
  
  return (
    <View style={{ flex: 1, backgroundColor: "#f8f8f8" }}>
      {/* Cart Items */}
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingBottom: 220 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.productId.images[0] }} style={styles.image} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.name}>{item.productId.name}</Text>
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
        )}
      />

    

      {/* Totals */}
      <View style={styles.totalsWrapper}>
      
        <View style={[styles.totalRow, { marginTop: 8 }]}>
          <Text style={styles.totalMain}>Total</Text>
          <Text style={styles.totalMain}>${total.toFixed(2)}</Text>
        </View>
      </View>

      {/* Checkout Button */}
    
<TouchableOpacity style={styles.checkoutBtn} onPress={handle_order}>
  <Text style={styles.checkoutText}>ordernow</Text>
</TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  message: { marginTop: 10, fontSize: 16, color: "gray" },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 12,
    marginVertical: 12,
    marginHorizontal: 15,
    alignItems: "center",
    elevation: 2,
  },
  image: {
    width: 120,
    height: 70,
    borderRadius: 35,
    resizeMode: "cover",
  },
  name: { fontSize: 15, fontWeight: "600", color: "#333" },
  price: { fontSize: 14, color: "#666", marginVertical: 4 },
  qtyWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    backgroundColor: "#f2f2f2",
    borderRadius: 20,
    paddingHorizontal: 8,
  },
  qtyBtn: {
    backgroundColor: "green",
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginHorizontal: 8,
  },
  qtyBtnText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  qtyText: { fontSize: 15, fontWeight: "600", color: "#333" },

  
  totalsWrapper: {
    backgroundColor: "#fff",
    marginTop: 15,
    marginHorizontal: 15,
    borderRadius: 10,
    padding: 15,
    elevation: 2,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 3,
  },
  totalLabel: { fontSize: 14, color: "#666" },
  totalValue: { fontSize: 14, fontWeight: "600", color: "#333" },
  totalMain: { fontSize: 16, fontWeight: "700", color: "#000" },

  checkoutBtn: {
    backgroundColor: "green",
    marginHorizontal: 20,
    marginVertical: 15,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    elevation: 3,
  },
  checkoutText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});

export default CartScreen;


// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   StyleSheet,
//   Image,
//   TextInput,
//   Alert,
//   ActivityIndicator
// } from "react-native";
// import { AntDesign } from "@expo/vector-icons";
// import axiosInstance from "../../service/axiosInstance";
// import RazorpayCheckout from "react-native-razorpay";

// interface CartItem {
//   _id: string;
//   productId: {
//     _id: string;
//     name: string;
//     price: number;
//     weight: string;
//     images: string[];
//   };
//   quantity: number;
//   total: number;
// }

// const CartScreen = () => {
//   const [cartItems, setCartItems] = useState<CartItem[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [promo, setPromo] = useState("");

//   const fetchCart = async () => {
//     try {
//       const res = await axiosInstance.get("/cart");
//       setCartItems(res.data);
//     } catch (err) {
//       console.log("Error fetching cart", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCart();
//   }, []);

//   const updateCart = async (cartId: string, newQty: number) => {
//     try {
//       await axiosInstance.put(`/cart/${cartId}`, { quantity: newQty });
//       fetchCart();
//     } catch (err) {
//       console.log("Error updating cart", err);
//     }
//   };

//   const increaseQty = (item: CartItem) => updateCart(item._id, item.quantity + 1);
//   const decreaseQty = (item: CartItem) => item.quantity > 1 && updateCart(item._id, item.quantity - 1);

//   const removeFromCart = async (cartId: string) => {
//     try {
//       await axiosInstance.delete(`/cart/${cartId}`);
//       fetchCart();
//     } catch (err) {
//       console.log("Error removing cart item", err);
//       Alert.alert("Error", "Failed to remove item");
//     }
//   };

//   const subtotal = cartItems.reduce((sum, item) => sum + item.total, 0);
//   const delivery = subtotal > 0 ? 3.5 : 0;
//   const total = subtotal + delivery;

//   // ------------------- PAYMENT -------------------
//   const handleCheckout = async () => {
//     if (cartItems.length === 0) return Alert.alert("Cart Empty", "Add items to checkout");

//     try {
//       // 1️⃣ Create order + payment order on backend
//       const res = await axiosInstance.post("/cart/checkout"); 
//       const { paymentOrder, order } = res.data;

//       // 2️⃣ Razorpay checkout
//       const options = {
//         description: "Order Payment",
//         currency: "INR",
//         key: "NWzOqMdFKeAqXuYzX6IdGUlp",
//         amount: paymentOrder.amount,
//         order_id: paymentOrder.id,
//         name: "My Shop",
//         prefill: {
//           email: "customer@example.com",
//           contact: "9999999999",
//           name: "John Doe"
//         },
//         theme: { color: "#53a20e" }
//       };

      
//       RazorpayCheckout.open(options)
//         .then(async (paymentSuccess: any) => {
//           // 3️⃣ Verify payment on backend
//           await axiosInstance.post("/verify-payment", {
//             razorpay_order_id: paymentSuccess.razorpay_order_id,
//             razorpay_payment_id: paymentSuccess.razorpay_payment_id,
//             razorpay_signature: paymentSuccess.razorpay_signature,
//             orderId: order._id
//           });

//           Alert.alert("Success 🎉", "Payment successful & order placed!");
//           fetchCart();
//         })
//         .catch((error: any) => {
//           console.log("Payment failed", error);
//           Alert.alert("Payment Failed ❌", "Try again!");
//         });

//     } catch (err) {
//       console.log("Checkout error", err);
//       Alert.alert("Error ❌", "Failed to checkout. Please try again.");
//     }
//   };

//   if (loading) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator size="large" color="green" />
//         <Text style={styles.message}>Loading cart...</Text>
//       </View>
//     );
//   }

//   if (cartItems.length === 0) {
//     return (
//       <View style={styles.center}>
//         <AntDesign name="shoppingcart" size={50} color="gray" />
//         <Text style={styles.message}>Your cart is empty</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={{ flex: 1, backgroundColor: "#f8f8f8" }}>
//       {/* Cart Items */}
//       <FlatList
//         data={cartItems}
//         keyExtractor={(item) => item._id}
//         contentContainerStyle={{ paddingBottom: 250 }}
//         renderItem={({ item }) => (
//           <View style={styles.card}>
//             <Image source={{ uri: item.productId.images[0] }} style={styles.image} />
//             <View style={{ flex: 1, marginLeft: 12 }}>
//               <Text style={styles.name}>{item.productId.name}</Text>
//               <Text style={styles.price}>${item.productId.price.toFixed(2)}</Text>
//               <View style={styles.qtyWrapper}>
//                 <TouchableOpacity onPress={() => decreaseQty(item)} style={styles.qtyBtn}>
//                   <Text style={styles.qtyBtnText}>-</Text>
//                 </TouchableOpacity>
//                 <Text style={styles.qtyText}>{item.quantity}</Text>
//                 <TouchableOpacity onPress={() => increaseQty(item)} style={styles.qtyBtn}>
//                   <Text style={styles.qtyBtnText}>+</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity onPress={() => removeFromCart(item._id)}>
//                   <AntDesign name="delete" size={20} color="red" style={{ marginLeft: 15 }} />
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </View>
//         )}
//       />

//       {/* Promo Code */}
//       <View style={styles.promoWrapper}>
//         <TextInput
//           style={styles.promoInput}
//           placeholder="Promo Code"
//           value={promo}
//           onChangeText={setPromo}
//         />
//         <TouchableOpacity style={styles.applyBtn}>
//           <Text style={styles.applyText}>Apply</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Totals */}
//       <View style={styles.totalsWrapper}>
//         <View style={[styles.totalRow, { marginTop: 8 }]}>
//           <Text style={styles.totalMain}>Total</Text>
//           <Text style={styles.totalMain}>${total.toFixed(2)}</Text>
//         </View>
//       </View>

//       {/* Checkout Button */}
//       <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout}>
//         <Text style={styles.checkoutText}>CHECK OUT & PAY</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// // ------------------- STYLES -------------------
// const styles = StyleSheet.create({
//   center: { flex: 1, justifyContent: "center", alignItems: "center" },
//   message: { marginTop: 10, fontSize: 16, color: "gray" },
//   card: {
//     flexDirection: "row",
//     backgroundColor: "#fff",
//     borderRadius: 15,
//     padding: 12,
//     marginVertical: 12,
//     marginHorizontal: 15,
//     alignItems: "center",
//     elevation: 2,
//   },
//   image: { width: 120, height: 70, borderRadius: 15, resizeMode: "cover" },
//   name: { fontSize: 15, fontWeight: "600", color: "#333" },
//   price: { fontSize: 14, color: "#666", marginVertical: 4 },
//   qtyWrapper: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginTop: 8,
//     backgroundColor: "#f2f2f2",
//     borderRadius: 20,
//     paddingHorizontal: 8,
//   },
//   qtyBtn: {
//     backgroundColor: "green",
//     borderRadius: 20,
//     paddingVertical: 4,
//     paddingHorizontal: 10,
//     marginHorizontal: 8,
//   },
//   qtyBtnText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
//   qtyText: { fontSize: 15, fontWeight: "600", color: "#333" },
//   promoWrapper: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginHorizontal: 15,
//     marginTop: 10,
//     backgroundColor: "#fff",
//     borderRadius: 10,
//     padding: 8,
//     elevation: 2,
//   },
//   promoInput: { flex: 1, paddingHorizontal: 10, fontSize: 14 },
//   applyBtn: {
//     backgroundColor: "red",
//     borderRadius: 8,
//     paddingVertical: 8,
//     paddingHorizontal: 15,
//   },
//   applyText: { color: "#fff", fontWeight: "600" },
//   totalsWrapper: {
//     backgroundColor: "#fff",
//     marginTop: 15,
//     marginHorizontal: 15,
//     borderRadius: 10,
//     padding: 15,
//     elevation: 2,
//   },
//   totalRow: { flexDirection: "row", justifyContent: "space-between", marginVertical: 3 },
//   totalMain: { fontSize: 16, fontWeight: "700", color: "#000" },
//   checkoutBtn: {
//     backgroundColor: "green",
//     marginHorizontal: 20,
//     marginVertical: 15,
//     borderRadius: 12,
//     paddingVertical: 14,
//     alignItems: "center",
//     elevation: 3,
//   },
//   checkoutText: { color: "#fff", fontSize: 16, fontWeight: "700" },
// });

// export default CartScreen;
