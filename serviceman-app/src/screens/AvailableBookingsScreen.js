import { useCallback, useEffect, useState } from "react";
import { Alert, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";

import BookingCard from "../components/BookingCard";
import api from "../services/api";

export default function AvailableBookingsScreen() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [acceptingId, setAcceptingId] = useState("");

  const loadBookings = useCallback(async () => {
    setLoading(true);

    try {
      const { data } = await api.get("/bookings/available");
      setBookings(data.data || []);
    } catch (error) {
      Alert.alert("Unable to load jobs", error.response?.data?.message || "Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const acceptBooking = async (booking) => {
    setAcceptingId(booking._id);

    try {
      await api.patch(`/bookings/${booking._id}/accept`);
      Alert.alert("Job accepted", "This booking is now assigned to you.");
      await loadBookings();
    } catch (error) {
      Alert.alert("Accept failed", error.response?.data?.message || "Please try again.");
    } finally {
      setAcceptingId("");
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl onRefresh={loadBookings} refreshing={loading} />}
      style={styles.screen}
    >
      <Text style={styles.title}>Available Jobs</Text>
      <Text style={styles.subtitle}>Pending bookings that are not assigned yet.</Text>

      {bookings.length === 0 && !loading ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>No available jobs</Text>
          <Text style={styles.emptyText}>Pull down to refresh when new requests arrive.</Text>
        </View>
      ) : (
        bookings.map((booking) => (
          <BookingCard
            actionLabel="Accept Job"
            booking={booking}
            key={booking._id}
            loading={acceptingId === booking._id}
            onAction={acceptBooking}
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
