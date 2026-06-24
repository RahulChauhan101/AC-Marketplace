import { StyleSheet, Text, View } from "react-native";

import Button from "../components/Button";
import Screen from "../components/Screen";
import SectionHeader from "../components/SectionHeader";
import { serviceTypes } from "../utils/serviceTypes";
import { useAuth } from "../context/AuthContext";
import { colors } from "../utils/colors";

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();

  return (
    <Screen>
      <SectionHeader
        eyebrow="ACCare"
        title={`Hi ${user?.name?.split(" ")[0] || "Customer"}, book trusted AC service.`}
        description="Find nearby verified servicemen, schedule visits, pay online and leave reviews."
      />

      <View style={styles.ctaCard}>
        <Text style={styles.ctaTitle}>AC not cooling?</Text>
        <Text style={styles.ctaText}>
          Create a booking and our admin team will assign an available serviceman.
        </Text>
        <Button title="Book service" onPress={() => navigation.navigate("Booking")} />
      </View>

      <Text style={styles.sectionTitle}>Popular services</Text>
      <View style={styles.grid}>
        {serviceTypes.map((service) => (
          <View key={service.id} style={styles.serviceCard}>
            <Text style={styles.serviceTitle}>{service.label}</Text>
            <Text style={styles.servicePrice}>{service.price}</Text>
          </View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  ctaCard: {
    backgroundColor: colors.text,
    borderRadius: 24,
    marginBottom: 24,
    padding: 22,
  },
  ctaTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "900",
  },
  ctaText: {
    color: "#CBD5E1",
    fontSize: 15,
    lineHeight: 23,
    marginBottom: 18,
    marginTop: 8,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 12,
  },
  grid: {
    gap: 12,
  },
  serviceCard: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
  },
  serviceTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "900",
  },
  servicePrice: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "800",
    marginTop: 6,
  },
});
