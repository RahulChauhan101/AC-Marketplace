import { useState } from "react";

import { useAuth } from "./context/AuthContext";
import AvailableBookings from "./pages/AvailableBookings";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import MyBookings from "./pages/MyBookings";
import Profile from "./pages/Profile";

const tabs = [
  { id: "dashboard", label: "Home" },
  { id: "available", label: "Available" },
  { id: "jobs", label: "My Jobs" },
  { id: "profile", label: "Profile" },
];

export default function App() {
  const { loading, user } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");

  if (loading) {
    return <div className="login-page">Loading ServiceWale...</div>;
  }

  if (!user) {
    return <Login />;
  }

  const renderPage = () => {
    if (activeTab === "available") {
      return <AvailableBookings />;
    }

    if (activeTab === "jobs") {
      return <MyBookings />;
    }

    if (activeTab === "profile") {
      return <Profile />;
    }

    return <Dashboard onNavigate={setActiveTab} />;
  };

  return (
    <div className="mobile-shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">SW</span>
          <span>ServiceWale Serviceman</span>
        </div>
      </header>

      <main className="mobile-content">{renderPage()}</main>

      <nav className="tab-bar">
        {tabs.map((tab) => (
          <button
            className={activeTab === tab.id ? "active" : ""}
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
