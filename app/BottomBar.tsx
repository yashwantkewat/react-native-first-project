import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useOrder } from "./screens/context/OrderContext";
// import { useOrder } from "./context/OrderContext";

export default function BottomBar() {
    const router = useRouter();
    const { orderCount, ordercount} = useOrder(); // 👈 context se le lo

    return (
        <View style={styles.bottomBar}>
            <TouchableOpacity style={styles.tab} onPress={() => router.push("/")}>
                <FontAwesome name="home" size={22} color="white" />
                <Text style={styles.tabText}>Home</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.tab} onPress={() => router.push("/cart")}>
                <View>
                    <FontAwesome name="shopping-cart" size={22} color="white" />
                    {orderCount > 0 && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{orderCount}</Text>
                        </View>
                    )}
                </View>
                <Text style={styles.tabText}>Cart</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.tab}
                onPress={() => router.push("/screens/myorder")}
            >
                <View>

                    <FontAwesome name="shopping-bag" size={22} color="white" />
                    {ordercount > 0 && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{ordercount}</Text>
                        </View>
                    )}
                    <Text style={styles.tabText}>Orders</Text>
                </View>

            </TouchableOpacity>

            <TouchableOpacity style={styles.tab} onPress={() => router.push("/profile")}>
                <FontAwesome name="user" size={22} color="white" />
                <Text style={styles.tabText}>Profile</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    bottomBar: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: "#333",
        paddingVertical: 10,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },
    tab: {
        alignItems: "center",
    },
    tabText: {
        color: "white",
        fontSize: 12,
        marginTop: 2,
    },
    badge: {
        position: "absolute",
        top: -8,
        right: -10,
        backgroundColor: "red",
        borderRadius: 12,
        paddingHorizontal: 5,
        paddingVertical: 1,
        minWidth: 18,
        alignItems: "center",
        justifyContent: "center",
    },
    badgeText: {
        color: "white",
        fontSize: 10,
        fontWeight: "bold",
    },
});
