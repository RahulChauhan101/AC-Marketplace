import { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";

import Button from "../components/Button";
import Input from "../components/Input";
import Screen from "../components/Screen";
import SectionHeader from "../components/SectionHeader";
import { useAuth } from "../context/AuthContext";
import { colors } from "../utils/colors";

export default function ProfileScreen() {
  const { logout, updateProfile, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    street: user?.address?.street || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
    pincode: user?.address?.pincode || "",
    landmark: user?.address?.landmark || "",
  });

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const save = async () => {
    setLoading(true);
    try {
      await updateProfile({
        name: form.name,
        phone: form.phone,
        address: {
          street: form.street,
          city: form.city,
          state: form.state,
          pincode: form.pincode,
          landmark: form.landmark,
        },
      });
      Alert.alert("Profile updated", "Your customer details were saved.");
    } catch (error) {
      Alert.alert("Update failed", error.response?.data?.message || "Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <SectionHeader
        eyebrow="Profile"
        title="Manage your account."
        description="Keep customer details and default service address up to date."
      />

      <View style={styles.card}>
        <Input label="Name" value={form.name} onChangeText={(value) => update("name", value)} />
        <Input
          label="Phone"
          keyboardType="phone-pad"
          style={styles.gap}
          value={form.phone}
          onChangeText={(value) => update("phone", value)}
        />
        <Input label="Street" style={styles.gap} value={form.street} onChangeText={(value) => update("street", value)} />
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
        <Button title="Save profile" loading={loading} onPress={save} style={styles.submit} />
        <Button title="Logout" variant="secondary" onPress={logout} style={styles.logout} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 22,
    borderWidth: 1,
    padding: 18,
  },
  gap: {
    marginTop: 14,
  },
  submit: {
    marginTop: 20,
  },
  logout: {
    marginTop: 12,
  },
});
