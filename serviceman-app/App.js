import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { AuthProvider, useAuth } from "./src/context/AuthContext";
import AvailableBookingsScreen from "./src/screens/AvailableBookingsScreen";
import DashboardScreen from "./src/screens/DashboardScreen";
import LoginScreen from "./src/screens/LoginScreen";
import MyBookingsScreen from "./src/screens/MyBookingsScreen";
import ProfileScreen from "./src/screens/ProfileScreen";

const tabs = [
  { id: "dashboard", label: "Home" },
  { id: "available", label: "Available" },
  { id: "jobs", label: "My Jobs" },
  { id: "profile", label: "Profile" },
];

export default function App() {
  return (
    <AuthProvider>
      <StatusBar style="dark" />
      <AppShell />
    </AuthProvider>
  );
}

function AppShell() {
  const { loading, user } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");

  if (loading) {
    return (
      <View style={styles.centerScreen}>
        <Text style={styles.loadingText}>Loading ServiceWale...</Text>
      </View>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  const renderScreen = () => {
    if (activeTab === "available") {
      return <AvailableBookingsScreen />;
    }

    if (activeTab === "jobs") {
      return <MyBookingsScreen />;
    }

    if (activeTab === "profile") {
      return <ProfileScreen />;
    }

    return <DashboardScreen onNavigate={setActiveTab} />;
  };

  return (
    <View style={styles.screen}>
      <View style={styles.content}>{renderScreen()}</View>
      <View style={styles.tabBar}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            onPress={() => setActiveTab(tab.id)}
            style={[styles.tabButton, activeTab === tab.id && styles.tabButtonActive]}
          >
            <Text style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  centerScreen: {
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    flex: 1,
    justifyContent: "center",
  },
  content: {
    flex: 1,
  },
  loadingText: {
    color: "#2563EB",
    fontSize: 18,
    fontWeight: "900",
  },
  screen: {
    backgroundColor: "#F8FAFC",
    flex: 1,
  },
  tabBar: {
    backgroundColor: "#FFFFFF",
    borderTopColor: "#E2E8F0",
    borderTopWidth: 1,
    flexDirection: "row",
    gap: 8,
    padding: 10,
  },
  tabButton: {
    alignItems: "center",
    borderRadius: 14,
    flex: 1,
    paddingVertical: 10,
  },
  tabButtonActive: {
    backgroundColor: "#2563EB",
  },
  tabText: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "900",
  },
  tabTextActive: {
    color: "#FFFFFF",
  },
});
