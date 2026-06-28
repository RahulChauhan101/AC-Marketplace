import { useCallback, useEffect, useState } from "react";
import { Alert, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";

import BookingCard from "../components/BookingCard";
import api from "../services/api";

const nextAction = (status) => {
  if (status === "confirmed") {
    return { label: "Start Work", status: "in_progress" };
  }

  if (status === "in_progress") {
    return { label: "Mark Completed", status: "completed" };
  }

  return null;
};

export default function MyBookingsScreen() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState("");

  const loadBookings = useCallback(async () => {
    setLoading(true);

    try {
      const { data } = await api.get("/bookings");
      setBookings(data.data.bookings || []);
    } catch (error) {
      Alert.alert("Unable to load bookings", error.response?.data?.message || "Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const updateStatus = async (booking) => {
    const action = nextAction(booking.status);

    if (!action) {
      return;
    }

    setUpdatingId(booking._id);

    try {
      await api.patch(`/bookings/${booking._id}`, {
        status: action.status,
        servicemanNote: `Updated to ${action.status} from serviceman app`,
      });
      await loadBookings();
    } catch (error) {
      Alert.alert("Update failed", error.response?.data?.message || "Please try again.");
    } finally {
      setUpdatingId("");
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl onRefresh={loadBookings} refreshing={loading} />}
      style={styles.screen}
    >
      <Text style={styles.title}>My Jobs</Text>
      <Text style={styles.subtitle}>Bookings assigned to your serviceman account.</Text>

      {bookings.length === 0 && !loading ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>No assigned jobs</Text>
          <Text style={styles.emptyText}>Accepted bookings will appear here.</Text>
        </View>
      ) : (
        bookings.map((booking) => {
          const action = nextAction(booking.status);

          return (
            <BookingCard
              actionLabel={action?.label}
              booking={booking}
              key={booking._id}
              loading={updatingId === booking._id}
              onAction={updateStatus}
            />
          );
        })
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
