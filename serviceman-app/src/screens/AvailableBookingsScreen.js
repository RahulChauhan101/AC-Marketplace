import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";

import BookingCard from "../components/BookingCard";
import api from "../services/api";
import { formatService } from "../utils/formatters";

export default function AvailableBookingsScreen() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [acceptingId, setAcceptingId] = useState("");
  const knownJobIds = useRef(new Set());
  const initialized = useRef(false);

  const loadBookings = useCallback(async () => {
    setLoading(true);

    try {
      const { data } = await api.get("/bookings/available");
      const nextBookings = data.data || [];

      if (!initialized.current) {
        nextBookings.forEach((booking) => knownJobIds.current.add(booking._id));
        initialized.current = true;
      } else {
        const newJobs = nextBookings.filter((booking) => !knownJobIds.current.has(booking._id));

        if (newJobs.length > 0) {
          const latestJob = newJobs[0];
          knownJobIds.current.add(latestJob._id);
          Alert.alert(
            "New Job Available",
            `New ${formatService(latestJob.serviceType)} request in ${latestJob.address?.city || "your area"}.`,
            [{ text: "OK" }]
          );
        }
      }

      nextBookings.forEach((booking) => knownJobIds.current.add(booking._id));
      setBookings(nextBookings);
    } catch (error) {
      Alert.alert("Unable to load jobs", error.response?.data?.message || "Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBookings();
    const intervalId = setInterval(loadBookings, 20000);

    return () => clearInterval(intervalId);
  }, [loadBookings]);

  const acceptBooking = async (booking) => {
    setAcceptingId(booking._id);

    try {
      await api.patch(`/bookings/${booking._id}/accept`);
      Alert.alert("Work accepted", "Customer has been notified. This booking is now assigned to you.");
      await loadBookings();
    } catch (error) {
      Alert.alert("Accept failed", error.response?.data?.message || "Please try again.");
    } finally {
      setAcceptingId("");
    }
  };

  const confirmAccept = (booking) => {
    Alert.alert(
      "Accept this work?",
      `Accept ${formatService(booking.serviceType)} for ${booking.customer?.name || "customer"}?`,
      [
        { text: "No", style: "cancel" },
        { text: "Yes", onPress: () => acceptBooking(booking) },
      ]
    );
  };

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl onRefresh={loadBookings} refreshing={loading} />}
      style={styles.screen}
    >
      <Text style={styles.title}>Available Work</Text>
      <Text style={styles.subtitle}>Pending bookings that are not assigned yet.</Text>

      {bookings.length === 0 && !loading ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>No available work</Text>
          <Text style={styles.emptyText}>Pull down to refresh when new requests arrive.</Text>
        </View>
      ) : (
        bookings.map((booking) => (
          <BookingCard
            actionLabel="Accept Work"
            booking={booking}
            key={booking._id}
            loading={acceptingId === booking._id}
            onAction={confirmAccept}
          />
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  empty: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    marginTop: 16,
    padding: 24,
  },
  emptyText: {
    color: "#64748B",
    marginTop: 8,
    textAlign: "center",
  },
  emptyTitle: {
    color: "#0F172A",
    fontSize: 20,
    fontWeight: "900",
  },
  screen: {
    backgroundColor: "#F8FAFC",
    flex: 1,
  },
  subtitle: {
    color: "#64748B",
    lineHeight: 22,
    marginBottom: 16,
    marginTop: 8,
  },
  title: {
    color: "#0F172A",
    fontSize: 30,
    fontWeight: "900",
  },
});
