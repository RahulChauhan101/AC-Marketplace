import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

import api from "../services/api";
import Button from "../components/Button";
import Input from "../components/Input";
import Screen from "../components/Screen";
import SectionHeader from "../components/SectionHeader";
import { serviceTypes } from "../utils/serviceTypes";
import { colors } from "../utils/colors";

const defaultRegion = {
  latitude: 28.6139,
  longitude: 77.209,
  latitudeDelta: 0.12,
  longitudeDelta: 0.12,
};

export default function NearbySearchScreen({ navigation }) {
  const [region, setRegion] = useState(defaultRegion);
  const [city, setCity] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [servicemen, setServicemen] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    locateCustomer();
  }, []);

  const locateCustomer = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Location disabled", "Enable location to center the map near you.");
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    setRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.08,
      longitudeDelta: 0.08,
    });
  };

  const search = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/servicemen", {
        params: {
          city,
          serviceType,
        },
      });
      setServicemen(data.data.servicemen);
    } catch (error) {
      Alert.alert("Search failed", error.response?.data?.message || "Unable to load servicemen.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen scroll={false}>
      <SectionHeader
        eyebrow="Nearby search"
        title="Find AC servicemen near you."
        description="Use Google Maps and filters to discover available technicians."
      />

      <View style={styles.filters}>
        <Input label="City" value={city} onChangeText={setCity} placeholder="Delhi" />
        <Input
          label="Service type"
          value={serviceType}
          onChangeText={setServiceType}
          placeholder={serviceTypes.map((service) => service.id).join(", ")}
          style={styles.gap}
        />
        <Button title="Search nearby" loading={loading} onPress={search} style={styles.gap} />
      </View>

      <View style={styles.mapWrap}>
        <MapView style={styles.map} region={region} onRegionChangeComplete={setRegion}>
          <Marker coordinate={region} title="Your area" pinColor={colors.primary} />
          {servicemen.map((serviceman, index) => (
            <Marker
              key={serviceman._id}
              coordinate={{
                latitude: region.latitude + (index + 1) * 0.006,
                longitude: region.longitude + (index + 1) * 0.004,
              }}
              title={serviceman.name}
              description={serviceman.serviceArea?.city || "Available serviceman"}
            />
          ))}
        </MapView>
      </View>

      <View style={styles.results}>
        <Text style={styles.resultsTitle}>{servicemen.length} servicemen found</Text>
        {servicemen.slice(0, 2).map((serviceman) => (
          <View key={serviceman._id} style={styles.resultCard}>
            <Text style={styles.name}>{serviceman.name}</Text>
            <Text style={styles.meta}>
              {serviceman.serviceArea?.city || "City not listed"} -{" "}
              {(serviceman.serviceCategories || []).join(", ") || "AC services"}
            </Text>
          </View>
        ))}
        <Button
          title="Book with available serviceman"
          variant="secondary"
          onPress={() => navigation.navigate("Booking")}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  filters: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
  },
  gap: {
    marginTop: 12,
  },
  mapWrap: {
    borderRadius: 22,
    flex: 1,
    marginTop: 14,
    minHeight: 220,
    overflow: "hidden",
  },
  map: {
    flex: 1,
  },
  results: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    marginTop: 14,
    padding: 14,
  },
  resultsTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 10,
  },
  resultCard: {
    backgroundColor: colors.background,
    borderRadius: 14,
    marginBottom: 10,
    padding: 12,
  },
  name: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "900",
  },
  meta: {
    color: colors.muted,
    fontSize: 13,
    marginTop: 4,
  },
});
