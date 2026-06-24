import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

import Button from "../components/Button";
import Input from "../components/Input";
import Screen from "../components/Screen";
import SectionHeader from "../components/SectionHeader";
import { useAuth } from "../context/AuthContext";
import { colors } from "../utils/colors";

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const submit = async () => {
    if (!form.name || !form.email || !form.password) {
      Alert.alert("Missing details", "Name, email and password are required.");
      return;
    }

    setLoading(true);
    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone,
        address: {
          street: form.street,
          city: form.city,
          state: form.state,
          pincode: form.pincode,
        },
      });
    } catch (error) {
      Alert.alert("Registration failed", error.response?.data?.message || "Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <SectionHeader
        eyebrow="Register"
        title="Create your customer account."
        description="Save your address and book AC services faster."
      />

      <View style={styles.card}>
        <Input label="Full name" value={form.name} onChangeText={(value) => update("name", value)} />
        <Input
          label="Phone"
          keyboardType="phone-pad"
          style={styles.gap}
          value={form.phone}
          onChangeText={(value) => update("phone", value)}
        />
        <Input
          label="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.gap}
          value={form.email}
          onChangeText={(value) => update("email", value)}
        />
        <Input
          label="Password"
          secureTextEntry
          style={styles.gap}
          value={form.password}
          onChangeText={(value) => update("password", value)}
        />
        <Input
          label="Street address"
          style={styles.gap}
          value={form.street}
          onChangeText={(value) => update("street", value)}
        />
        <Input label="City" style={styles.gap} value={form.city} onChangeText={(value) => update("city", value)} />
        <Input label="State" style={styles.gap} value={form.state} onChangeText={(value) => update("state", value)} />
        <Input
          label="Pincode"
          keyboardType="number-pad"
          style={styles.gap}
          value={form.pincode}
          onChangeText={(value) => update("pincode", value)}
        />

        <Button title="Register" loading={loading} onPress={submit} style={styles.submit} />
        <Pressable onPress={() => navigation.navigate("Login")}>
          <Text style={styles.link}>Already have an account? Login</Text>
        </Pressable>
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
  link: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "800",
    marginTop: 18,
    textAlign: "center",
  },
});
