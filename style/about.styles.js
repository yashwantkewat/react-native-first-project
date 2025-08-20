import {  StyleSheet } from 'react-native';


export default StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff",marginHorizontal:5 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  back: { fontSize: 20, marginRight: 8 },
  headerTitle: { fontSize: 18, fontWeight: "600" },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
 
  section: { fontSize: 16, fontWeight: "600", marginTop: 20, marginBottom: 8 },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  icon: { fontSize: 18, marginRight: 8 },
  input: { flex: 1, height: 40 },
  saveBtn: {
    backgroundColor: "#7CB342",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  saveText: { color: "#fff", fontWeight: "600" },
});
