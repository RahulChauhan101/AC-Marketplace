import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";

import { colors } from "../utils/colors";

export default function Button({ title, onPress, loading, variant = "primary", style }) {
  const isSecondary = variant === "secondary";

  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      style={({ pressed }) => [
        styles.button,
        isSecondary ? styles.secondary : styles.primary,
        pressed && styles.pressed,
        loading && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isSecondary ? colors.primary : "#FFFFFF"} />
      ) : (
        <Text style={[styles.text, isSecondary ? styles.secondaryText : styles.primaryText]}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    borderRadius: 14,
    justifyContent: "center",
    minHeight: 50,
    paddingHorizontal: 18,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: "#FFFFFF",
    borderColor: colors.border,
    borderWidth: 1,
  },
  text: {
    fontSize: 15,
    fontWeight: "800",
  },
  primaryText: {
    color: "#FFFFFF",
  },
  secondaryText: {
    color: colors.primary,
  },
  disabled: {
    opacity: 0.7,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
  },
});
