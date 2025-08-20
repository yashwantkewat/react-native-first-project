import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6F8",
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 180,
    backgroundColor: "#E5E7EB",
  },
  info: {
    padding: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
  },
  price: {
    fontSize: 14,
    fontWeight: "600",
    color: "#10B981",
    marginTop: 4,
  },
  category: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6B7280",
    marginTop: 2,
  },
  description: {
    fontSize: 13,
    color: "#4B5563",
    marginTop: 6,
    lineHeight: 18,
  },
});
