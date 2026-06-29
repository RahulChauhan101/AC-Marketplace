import { StyleSheet, Text, View } from "react-native";

export default function BrandLogo({ suffix = "", centered = false, light = false }) {
  return (
    <View style={[styles.brand, centered && styles.brandCentered]}>
      <View style={styles.brandMark}>
        <Text style={styles.brandMarkText}>SW</Text>
      </View>
      <Text style={[styles.brandName, light && styles.brandNameLight]}>
        <Text style={styles.brandAccent}>S</Text>ervice
        <Text style={styles.brandAccent}>W</Text>ale
        {suffix ? <Text style={styles.brandSuffix}>{suffix}</Text> : null}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  brand: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
  },
  brandAccent: {
    color: "#F97316",
    fontWeight: "900",
  },
  brandCentered: {
    justifyContent: "center",
  },
  brandMark: {
    alignItems: "center",
    backgroundColor: "#F97316",
    borderRadius: 16,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  brandMarkText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },
  brandName: {
    color: "#0F172A",
    fontSize: 22,
    fontWeight: "900",
  },
  brandNameLight: {
    color: "#FFFFFF",
  },
  brandSuffix: {
    color: "#64748B",
    fontWeight: "700",
  },
});
