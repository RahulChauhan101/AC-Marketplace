import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useAuth } from "../context/AuthContext";

export default function DashboardScreen({ onNavigate }) {
  const { logout, refreshProfile, user } = useAuth();

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl onRefresh={refreshProfile} refreshing={false} />}
      style={styles.screen}
    >
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>ServiceWale</Text>
        <Text style={styles.title}>Hi {user?.name?.split(" ")[0] || "Serviceman"}</Text>
        <Text style={styles.subtitle}>
          {user?.isAvailable ? "You are available for bookings." : "You are currently unavailable."}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Service Area</Text>
        <Text style={styles.cardTitle}>{user?.serviceArea?.city || "City not set"}</Text>
        <Text style={styles.cardText}>
          Pincodes: {user?.serviceArea?.pincodes?.join(", ") || "Not listed"}
        </Text>
      </View>

      <View style={styles.grid}>
        <TouchableOpacity onPress={() => onNavigate("available")} style={styles.action}>
          <Text style={styles.actionTitle}>Available Jobs</Text>
          <Text style={styles.actionText}>Accept open bookings near your service area.</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onNavigate("jobs")} style={styles.action}>
          <Text style={styles.actionTitle}>My Jobs</Text>
          <Text style={styles.actionText}>Start work and mark visits completed.</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onNavigate("profile")} style={styles.action}>
          <Text style={styles.actionTitle}>Profile</Text>
          <Text style={styles.actionText}>View services, availability and contact details.</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={logout} style={styles.logout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  action: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 18,
  },
  actionText: {
    color: "#64748B",
    lineHeight: 20,
    marginTop: 8,
  },
  actionTitle: {
    color: "#0F172A",
    fontSize: 18,
    fontWeight: "900",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    marginTop: 16,
    padding: 20,
  },
  cardLabel: {
    color: "#64748B",
    fontWeight: "800",
  },
  cardText: {
    color: "#475569",
    marginTop: 8,
  },
  cardTitle: {
    color: "#2563EB",
    fontSize: 24,
    fontWeight: "900",
    marginTop: 6,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  eyebrow: {
    color: "#BFDBFE",
    fontWeight: "900",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  grid: {
    gap: 14,
    marginTop: 16,
  },
  hero: {
    backgroundColor: "#2563EB",
    borderRadius: 28,
    padding: 24,
  },
  logout: {
    alignItems: "center",
    marginTop: 24,
    padding: 14,
  },
  logoutText: {
    color: "#DC2626",
    fontWeight: "900",
  },
  screen: {
    backgroundColor: "#F8FAFC",
    flex: 1,
  },
  subtitle: {
    color: "#DBEAFE",
    fontSize: 16,
    marginTop: 8,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "900",
    marginTop: 8,
  },
});
