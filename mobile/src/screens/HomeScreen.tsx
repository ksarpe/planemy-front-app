import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { StatusBar } from "expo-status-bar";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>🚀 AiPlanner Mobile</Text>
        <Text style={styles.subtitle}>Twoja mobilna aplikacja do zarządzania zadaniami</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📱 Funkcje</Text>
          <Text style={styles.feature}>✅ Zarządzanie zadaniami</Text>
          <Text style={styles.feature}>🛒 Lista zakupów</Text>
          <Text style={styles.feature}>📅 Kalendarz wydarzeń</Text>
          <Text style={styles.feature}>💰 Śledzenie płatności</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔧 Status</Text>
          <Text style={styles.status}>✅ Shared API: Połączone</Text>
          <Text style={styles.status}>✅ TypeScript: Skonfigurowane</Text>
          <Text style={styles.status}>✅ React Native: Gotowe</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  section: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  feature: {
    fontSize: 16,
    color: "#555",
    marginBottom: 8,
  },
  status: {
    fontSize: 16,
    color: "#00A86B",
    marginBottom: 8,
  },
});
