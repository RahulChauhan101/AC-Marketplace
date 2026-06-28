import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { formatDate, formatService } from "../utils/formatters";

export default function BookingCard({ actionLabel, booking, loading, onAction }) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{formatService(booking.serviceType)}</Text>
        <Text style={styles.status}>{booking.status}</Text>
      </View>

      <Text style={styles.description}>{booking.issueDescription}</Text>
      <Text style={styles.meta}>Customer: {booking.customer?.name || "Customer"}</Text>
      <Text style={styles.meta}>Phone: {booking.customer?.phone || "Not available"}</Text>
      <Text style={styles.meta}>Schedule: {formatDate(booking.scheduledAt)}</Text>
      <Text style={styles.meta}>
        Address: {booking.address?.street}, {booking.address?.city} {booking.address?.pincode}
      </Text>

      {booking.pricing?.totalAmount > 0 && (
        <Text style={styles.amount}>Total: ₹{booking.pricing.totalAmount}</Text>
      )}

      {actionLabel && (
        <TouchableOpacity
          disabled={loading}
          onPress={() => onAction?.(booking)}
          style={[styles.button, loading && styles.buttonDisabled]}
        >
          <Text style={styles.buttonText}>{loading ? "Please wait..." : actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  amount: {
    color: "#2563EB",
    fontSize: 16,
    fontWeight: "900",
    marginTop: 10,
  },
  button: {
    alignItems: "center",
    backgroundColor: "#F97316",
    borderRadius: 14,
    marginTop: 16,
    paddingVertical: 12,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "900",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    marginBottom: 16,
    padding: 18,
  },
  description: {
    color: "#475569",
    lineHeight: 22,
    marginTop: 10,
  },
  header: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
  },
  meta: {
    color: "#64748B",
    fontSize: 13,
    marginTop: 8,
  },
  status: {
    backgroundColor: "#DBEAFE",
    borderRadius: 999,
    color: "#1D4ED8",
    fontSize: 12,
    fontWeight: "800",
    overflow: "hidden",
    paddingHorizontal: 10,
    paddingVertical: 5,
    textTransform: "capitalize",
  },
  title: {
    color: "#0F172A",
    flex: 1,
    fontSize: 20,
    fontWeight: "900",
    textTransform: "capitalize",
  },
});
