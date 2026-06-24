import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

import api from "../services/api";
import Button from "../components/Button";
import Input from "../components/Input";
import Screen from "../components/Screen";
import SectionHeader from "../components/SectionHeader";
import { acTypes, serviceTypes } from "../utils/serviceTypes";
import { useAuth } from "../context/AuthContext";
import { colors } from "../utils/colors";

export default function BookingScreen() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    serviceType: "repair",
    issueDescription: "",
    scheduledAt: "",
    brand: "",
    model: "",
    capacity: "",
    acType: "split",
    street: user?.address?.street || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
    pincode: user?.address?.pincode || "",
    landmark: user?.address?.landmark || "",
    notes: "",
  });

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const submit = async () => {
    if (!form.issueDescription || !form.scheduledAt || !form.street || !form.city || !form.pincode) {
      Alert.alert("Missing details", "Issue, schedule and service address are required.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/bookings", {
        serviceType: form.serviceType,
        issueDescription: form.issueDescription,
        scheduledAt: form.scheduledAt,
        notes: form.notes,
        acDetails: {
          brand: form.brand,
          model: form.model,
          capacity: form.capacity,
          acType: form.acType,
        },
        address: {
          street: form.street,
          city: form.city,
          state: form.state,
          pincode: form.pincode,
          landmark: form.landmark,
        },
      });

      Alert.alert("Booking created", "A serviceman will be assigned soon.");
      setForm((current) => ({ ...current, issueDescription: "", notes: "" }));
    } catch (error) {
      Alert.alert("Booking failed", error.response?.data?.message || "Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <SectionHeader
        eyebrow="Booking"
        title="Schedule an AC service."
        description="Choose service details, preferred time and service address."
      />

      <Text style={styles.label}>Service type</Text>
      <View style={styles.chips}>
        {serviceTypes.map((service) => (
          <Pressable
            key={service.id}
            onPress={() => update("serviceType", service.id)}
            style={[
              styles.chip,
              form.serviceType === service.id && styles.chipActive,
            ]}
          >
            <Text
              style={[
                styles.chipText,
                form.serviceType === service.id && styles.chipTextActive,
              ]}
            >
              {service.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <Input
        label="Issue description"
        multiline
        value={form.issueDescription}
        onChangeText={(value) => update("issueDescription", value)}
        placeholder="AC not cooling, leakage, noise..."
      />
      <Input
        label="Preferred schedule"
        style={styles.gap}
        value={form.scheduledAt}
        onChangeText={(value) => update("scheduledAt", value)}
        placeholder="2026-06-24T18:30:00"
      />

      <View style={styles.card}>
        <Text style={styles.cardTitle}>AC details</Text>
        <Input label="Brand" value={form.brand} onChangeText={(value) => update("brand", value)} />
        <Input label="Model" style={styles.gap} value={form.model} onChangeText={(value) => update("model", value)} />
        <Input
          label="Capacity"
          style={styles.gap}
          value={form.capacity}
          onChangeText={(value) => update("capacity", value)}
          placeholder="1.5 ton"
        />
        <Text style={[styles.label, styles.gap]}>AC type</Text>
        <View style={styles.chips}>
          {acTypes.map((type) => (
            <Pressable
              key={type}
              onPress={() => update("acType", type)}
              style={[styles.smallChip, form.acType === type && styles.chipActive]}
            >
              <Text
                style={[
                  styles.chipText,
                  form.acType === type && styles.chipTextActive,
                ]}
              >
                {type}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Service address</Text>
        <Input label="Street" value={form.street} onChangeText={(value) => update("street", value)} />
        <Input label="City" style={styles.gap} value={form.city} onChangeText={(value) => update("city", value)} />
        <Input label="State" style={styles.gap} value={form.state} onChangeText={(value) => update("state", value)} />
        <Input
          label="Pincode"
          keyboardType="number-pad"
          style={styles.gap}
          value={form.pincode}
          onChangeText={(value) => update("pincode", value)}
        />
        <Input
          label="Landmark"
          style={styles.gap}
          value={form.landmark}
          onChangeText={(value) => update("landmark", value)}
        />
      </View>

      <Input
        label="Additional notes"
        multiline
        style={styles.gap}
        value={form.notes}
        onChangeText={(value) => update("notes", value)}
      />
      <Button title="Create booking" loading={loading} onPress={submit} style={styles.submit} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  label: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "900",
    marginBottom: 8,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  smallChip: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "800",
    textTransform: "capitalize",
  },
  chipTextActive: {
    color: "#FFFFFF",
  },
  gap: {
    marginTop: 14,
  },
  card: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 20,
    borderWidth: 1,
    marginTop: 18,
    padding: 16,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 14,
  },
  submit: {
    marginTop: 20,
  },
});
