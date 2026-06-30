import { useState } from "react";

import BrandLogo from "./components/BrandLogo";
import NewJobWatcher from "./components/NewJobWatcher";
import { ToastProvider } from "./components/Toast";
import { useAuth } from "./context/AuthContext";
import AvailableBookings from "./pages/AvailableBookings";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyBookings from "./pages/MyBookings";
import Profile from "./pages/Profile";

const tabs = [
  { id: "dashboard", label: "Home" },
  { id: "available", label: "Available Work" },
  { id: "jobs", label: "My Work" },
  { id: "profile", label: "Profile" },
];

export default function App() {
  const { loading, user } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [authScreen, setAuthScreen] = useState("login");

  if (loading) {
    return <div className="login-page">Loading ServiceWale...</div>;
  }

  if (!user) {
    if (authScreen === "register") {
      return <Register onGoLogin={() => setAuthScreen("login")} />;
    }

    return <Login onGoRegister={() => setAuthScreen("register")} />;
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
    <ToastProvider>
      <div className="mobile-shell">
        <NewJobWatcher onViewJobs={() => setActiveTab("available")} />

        <header className="topbar">
          <BrandLogo suffix=" Serviceman" />
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
    </ToastProvider>
  );
}
