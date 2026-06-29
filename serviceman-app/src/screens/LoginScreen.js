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

import BrandLogo from "../components/BrandLogo";
import { useAuth } from "../context/AuthContext";

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const submit = async () => {
    if (!email || !password) {
      setErrorMessage("Enter email and password.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      await login({ email, password });
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Login failed. Try again.";
      setErrorMessage(message);

      if (Platform.OS !== "web") {
        Alert.alert("Login failed", message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.screen}
    >
      <BrandLogo centered />
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

      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
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
  errorText: {
    color: "#DC2626",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 16,
    textAlign: "center",
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
    marginTop: 24,
  },
});
