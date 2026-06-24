import { StyleSheet, Text, TextInput, View } from "react-native";

import { colors } from "../utils/colors";

export default function Input({ label, multiline, style, ...props }) {
  return (
    <View style={style}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        placeholderTextColor="#94A3B8"
        style={[styles.input, multiline && styles.multiline]}
        multiline={multiline}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    color: colors.text,
    fontSize: 15,
    minHeight: 50,
    paddingHorizontal: 14,
  },
  multiline: {
    minHeight: 96,
    paddingTop: 14,
    textAlignVertical: "top",
  },
});
