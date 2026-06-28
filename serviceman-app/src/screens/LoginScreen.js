import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useAuth } from "../context/AuthContext";

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!email || !password) {
      Alert.alert("Missing details", "Enter email and password.");
      return;
    }

    setLoading(true);

    try {
      await login({ email, password });
    } catch (error) {
      Alert.alert("Login failed", error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.screen}
    >
      <View style={styles.logo}>
        <Text style={styles.logoText}>SW</Text>
      </View>
      <Text style={styles.eyebrow}>ServiceWale</Text>
      <Text style={styles.title}>Serviceman Login</Text>
      <Text style={styles.description}>
        Sign in with your serviceman account to manage bookings and status updates.
      </Text>

      <TextInput
        autoCapitalize="none"
        keyboardType="email-address"
        onChangeText={setEmail}
        placeholder="Email"
        style={styles.input}
        value={email}
      />
      <TextInput
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
        style={styles.input}
        value={password}
      />

      <TouchableOpacity disabled={loading} onPress={submit} style={styles.button}>
        <Text style={styles.buttonText}>{loading ? "Logging in..." : "Login"}</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: "#F97316",
    borderRadius: 16,
    marginTop: 18,
    paddingVertical: 15,
    width: "100%",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },
  description: {
    color: "#475569",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 18,
    textAlign: "center",
  },
  eyebrow: {
    color: "#2563EB",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 2,
    marginTop: 20,
    textTransform: "uppercase",
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderColor: "#CBD5E1",
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    width: "100%",
  },
  logo: {
    alignItems: "center",
    backgroundColor: "#2563EB",
    borderRadius: 24,
    height: 72,
    justifyContent: "center",
    width: 72,
  },
  logoText: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "900",
  },
  screen: {
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  title: {
    color: "#0F172A",
    fontSize: 32,
    fontWeight: "900",
    marginBottom: 10,
    marginTop: 8,
  },
});
