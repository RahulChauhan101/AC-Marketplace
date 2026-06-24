import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

import Button from "../components/Button";
import Input from "../components/Input";
import Screen from "../components/Screen";
import SectionHeader from "../components/SectionHeader";
import { useAuth } from "../context/AuthContext";
import { colors } from "../utils/colors";

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!form.email || !form.password) {
      Alert.alert("Missing details", "Please enter email and password.");
      return;
    }

    setLoading(true);
    try {
      await login(form);
    } catch (error) {
      Alert.alert("Login failed", error.response?.data?.message || "Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <View style={styles.hero}>
        <Text style={styles.logo}>AC</Text>
        <SectionHeader
          eyebrow="Customer app"
          title="Login to book AC service."
          description="Access nearby technicians, bookings, payments and reviews."
        />
      </View>

      <View style={styles.card}>
        <Input
          label="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={form.email}
          onChangeText={(email) => setForm({ ...form, email })}
        />
        <Input
          label="Password"
          secureTextEntry
          style={styles.inputGap}
          value={form.password}
          onChangeText={(password) => setForm({ ...form, password })}
        />
        <Button title="Login" loading={loading} onPress={submit} style={styles.submit} />

        <Pressable onPress={() => navigation.navigate("Register")}>
          <Text style={styles.link}>New customer? Create an account</Text>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    marginTop: 24,
  },
  logo: {
    backgroundColor: colors.primary,
    borderRadius: 18,
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 24,
    overflow: "hidden",
    padding: 14,
    textAlign: "center",
    width: 58,
  },
  card: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 22,
    borderWidth: 1,
    padding: 18,
  },
  inputGap: {
    marginTop: 16,
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
