import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useUpcomingEvents } from "@shared/hooks/events";
import { format } from "date-fns";
import { pl } from "date-fns/locale";

export default function CalendarScreen() {
  const { groups, hasEvents, totalEvents } = useUpcomingEvents();

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>📅 Kalendarz</Text>
        <Text style={styles.subtitle}>
          {hasEvents ? `Masz ${totalEvents} nadchodzących wydarzeń` : "Twoje nadchodzące wydarzenia"}
        </Text>

        {hasEvents ? (
          groups.map((group, index) => (
            <View key={index} style={styles.section}>
              <Text style={styles.sectionTitle}>{group.title}</Text>
              {group.events.map((event) => (
                <View key={event.id} style={styles.eventItem}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <Text style={styles.eventTime}>
                    {event.allDay ? "Cały dzień" : format(new Date(event.start), "HH:mm", { locale: pl })}
                  </Text>
                  {event.description && <Text style={styles.eventDescription}>{event.description}</Text>}
                  {event.location && <Text style={styles.eventLocation}>📍 {event.location}</Text>}
                  <Text style={styles.eventCategory}>🏷️ {event.category}</Text>
                </View>
              ))}
            </View>
          ))
        ) : (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Brak wydarzeń</Text>
            <Text style={styles.noEvents}>Nie masz żadnych nadchodzących wydarzeń w kalendarzu.</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Funkcje kalendarza</Text>
          <Text style={styles.feature}>📆 Widok miesięczny i tygodniowy</Text>
          <Text style={styles.feature}>➕ Dodawanie wydarzeń</Text>
          <Text style={styles.feature}>🔔 Przypomnienia</Text>
          <Text style={styles.feature}>🔄 Synchronizacja z Google Calendar</Text>
          <Text style={styles.feature}>📍 Lokalizacje wydarzeń</Text>
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
  eventItem: {
    padding: 15,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#007AFF",
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  eventTime: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  eventDescription: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
    fontStyle: "italic",
  },
  eventLocation: {
    fontSize: 14,
    color: "#007AFF",
    marginBottom: 4,
  },
  eventCategory: {
    fontSize: 12,
    color: "#888",
    textTransform: "uppercase",
  },
  noEvents: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    fontStyle: "italic",
  },
  feature: {
    fontSize: 16,
    color: "#555",
    marginBottom: 8,
    lineHeight: 20,
  },
});
