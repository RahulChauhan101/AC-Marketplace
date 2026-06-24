import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { useAuth } from "../context/AuthContext";
import BookingScreen from "../screens/BookingScreen";
import HomeScreen from "../screens/HomeScreen";
import LoginScreen from "../screens/LoginScreen";
import NearbySearchScreen from "../screens/NearbySearchScreen";
import PaymentScreen from "../screens/PaymentScreen";
import ProfileScreen from "../screens/ProfileScreen";
import RegisterScreen from "../screens/RegisterScreen";
import ReviewsScreen from "../screens/ReviewsScreen";
import { colors } from "../utils/colors";

const AuthStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
}

function CustomerTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: { fontSize: 12, fontWeight: "800" },
        tabBarStyle: { borderTopColor: colors.border, height: 64, paddingBottom: 8 },
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarIcon: Icon("H") }} />
      <Tab.Screen
        name="Nearby"
        component={NearbySearchScreen}
        options={{ tabBarIcon: Icon("N") }}
      />
      <Tab.Screen
        name="Booking"
        component={BookingScreen}
        options={{ tabBarIcon: Icon("B") }}
      />
      <Tab.Screen
        name="Payments"
        component={PaymentScreen}
        options={{ tabBarIcon: Icon("P") }}
      />
      <Tab.Screen
        name="Reviews"
        component={ReviewsScreen}
        options={{ tabBarIcon: Icon("R") }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarIcon: Icon("U") }}
      />
    </Tab.Navigator>
  );
}

const Icon = (label) =>
  function TabIcon({ color }) {
    return <Text style={{ color, fontSize: 18 }}>{label}</Text>;
  };

export default function RootNavigator() {
  const { booting, isAuthenticated } = useAuth();

  if (booting) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading ACCare...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <CustomerTabs /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loading: {
    alignItems: "center",
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: "center",
  },
  loadingText: {
    color: colors.muted,
    fontSize: 15,
    fontWeight: "700",
    marginTop: 12,
  },
});
