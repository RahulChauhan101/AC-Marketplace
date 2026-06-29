import { Alert, ScrollView, StyleSheet, Switch, Text, View } from "react-native";

import { useAuth } from "../context/AuthContext";
import { formatService } from "../utils/formatters";

export default function ProfileScreen() {
  const { updateProfile, user } = useAuth();

  const toggleAvailability = async (value) => {
    try {
      await updateProfile({ isAvailable: value });
    } catch (error) {
      Alert.alert("Update failed", error.response?.data?.message || "Please try again.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.content} style={styles.screen}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.subtitle}>Your serviceman account details from ServiceWale.</Text>

      <View style={styles.card}>
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.text}>{user?.email}</Text>
        <Text style={styles.text}>{user?.phone || "Phone not set"}</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.row}>
          <View>
            <Text style={styles.label}>Availability</Text>
            <Text style={styles.text}>{user?.isAvailable ? "Available" : "Unavailable"}</Text>
          </View>
          <Switch
            onValueChange={toggleAvailability}
            thumbColor={user?.isAvailable ? "#F97316" : "#E2E8F0"}
            value={Boolean(user?.isAvailable)}
          />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Service Area</Text>
        <Text style={styles.name}>{user?.serviceArea?.city || "City not set"}</Text>
        <Text style={styles.text}>
          Pincodes: {user?.serviceArea?.pincodes?.join(", ") || "Not listed"}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Service Categories</Text>
        <View style={styles.chips}>
          {(user?.serviceCategories || []).map((category) => (
            <Text key={category} style={styles.chip}>
              {formatService(category)}
            </Text>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    marginTop: 16,
    padding: 18,
  },
  chip: {
    backgroundColor: "#FFEDD5",
    borderRadius: 999,
    color: "#EA580C",
    fontSize: 12,
    fontWeight: "800",
    overflow: "hidden",
    paddingHorizontal: 10,
    paddingVertical: 7,
    textTransform: "capitalize",
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  label: {
    color: "#64748B",
    fontWeight: "900",
  },
  name: {
    color: "#0F172A",
    fontSize: 22,
    fontWeight: "900",
    marginTop: 6,
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  screen: {
    backgroundColor: "#F8FAFC",
    flex: 1,
  },
  subtitle: {
    color: "#64748B",
    lineHeight: 22,
    marginTop: 8,
  },
  text: {
    color: "#475569",
    marginTop: 8,
  },
  title: {
    color: "#0F172A",
    fontSize: 30,
    fontWeight: "900",
  },
});
