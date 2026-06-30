import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import BrandLogo from "../components/BrandLogo";
import { useAuth } from "../context/AuthContext";
import { serviceTypes } from "../utils/serviceTypes";

export default function RegisterScreen({ onGoLogin }) {
  const { register } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    city: "",
    pincodes: "",
  });
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const toggleCategory = (categoryId) => {
    setSelectedCategories((current) =>
      current.includes(categoryId)
        ? current.filter((item) => item !== categoryId)
        : [...current, categoryId]
    );
  };

  const submit = async () => {
    const pincodes = form.pincodes
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);

    if (!form.name || !form.email || !form.password) {
      setErrorMessage("Name, email and password are required.");
      return;
    }

    if (!form.city || pincodes.length === 0) {
      setErrorMessage("Enter your service city and at least one pincode.");
      return;
    }

    if (selectedCategories.length === 0) {
      setErrorMessage("Select at least one service category.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        phone: form.phone.trim(),
        serviceCategories: selectedCategories,
        serviceArea: {
          city: form.city.trim(),
          pincodes,
        },
      });
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Registration failed. Try again.";
      setErrorMessage(message);

      if (Platform.OS !== "web") {
        Alert.alert("Registration failed", message);
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
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <BrandLogo centered />
        <Text style={styles.title}>Create Serviceman Account</Text>
        <Text style={styles.description}>
          Register to receive nearby bookings and manage your jobs on ServiceWale.
        </Text>

        <TextInput
          onChangeText={(value) => updateField("name", value)}
          placeholder="Full name"
          style={styles.input}
          value={form.name}
        />
        <TextInput
          autoCapitalize="none"
          keyboardType="email-address"
          onChangeText={(value) => updateField("email", value)}
          placeholder="Email"
          style={styles.input}
          value={form.email}
        />
        <TextInput
          onChangeText={(value) => updateField("password", value)}
          placeholder="Password (min 6 characters)"
          secureTextEntry
          style={styles.input}
          value={form.password}
        />
        <TextInput
          keyboardType="phone-pad"
          onChangeText={(value) => updateField("phone", value)}
          placeholder="Phone"
          style={styles.input}
          value={form.phone}
        />
        <TextInput
          onChangeText={(value) => updateField("city", value)}
          placeholder="Service city"
          style={styles.input}
          value={form.city}
        />
        <TextInput
          onChangeText={(value) => updateField("pincodes", value)}
          placeholder="Pincodes (comma separated)"
          style={styles.input}
          value={form.pincodes}
        />

        <Text style={styles.sectionLabel}>Service Categories</Text>
        <View style={styles.chips}>
          {serviceTypes.map((service) => {
            const selected = selectedCategories.includes(service.id);

            return (
              <TouchableOpacity
                key={service.id}
                onPress={() => toggleCategory(service.id)}
                style={[styles.chip, selected && styles.chipSelected]}
              >
                <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                  {service.logo} {service.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity disabled={loading} onPress={submit} style={styles.button}>
          <Text style={styles.buttonText}>{loading ? "Creating account..." : "Register"}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onGoLogin} style={styles.linkButton}>
          <Text style={styles.linkText}>
            Already have an account? <Text style={styles.linkAccent}>Login</Text>
          </Text>
        </TouchableOpacity>

        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: "#F97316",
    borderRadius: 16,
    marginTop: 20,
    paddingVertical: 15,
    width: "100%",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },
  chip: {
    backgroundColor: "#FFFFFF",
    borderColor: "#CBD5E1",
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chipSelected: {
    backgroundColor: "#FFEDD5",
    borderColor: "#F97316",
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10,
  },
  chipText: {
    color: "#475569",
    fontSize: 12,
    fontWeight: "700",
  },
  chipTextSelected: {
    color: "#EA580C",
    fontWeight: "900",
  },
  content: {
    alignItems: "center",
    padding: 24,
    paddingBottom: 40,
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
  linkAccent: {
    color: "#EA580C",
    fontWeight: "900",
  },
  linkButton: {
    marginTop: 16,
    paddingVertical: 8,
  },
  linkText: {
    color: "#64748B",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  screen: {
    backgroundColor: "#F8FAFC",
    flex: 1,
  },
  sectionLabel: {
    alignSelf: "flex-start",
    color: "#0F172A",
    fontSize: 14,
    fontWeight: "900",
    marginTop: 18,
  },
  title: {
    color: "#0F172A",
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 10,
    marginTop: 24,
    textAlign: "center",
  },
});
