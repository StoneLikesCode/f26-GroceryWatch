import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function App() {
  const [status, setStatus] = useState("Checking API...");

  useEffect(() => {
    fetch(`${API_URL}/health`)
      .then((res) => res.json())
      .then((data) => setStatus(`API: ${data.status}, DB: ${data.db}`))
      .catch(() => setStatus("API unreachable"));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>GroceryWatch</Text>
      <Text>Compare grocery prices near you.</Text>
      <Text style={styles.status}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 32, fontWeight: "bold", marginBottom: 8 },
  status: { marginTop: 24, color: "#666" },
});