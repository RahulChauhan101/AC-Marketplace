import { useState } from "react";

import BrandLogo from "./components/BrandLogo";
import { useAuth } from "./context/AuthContext";
import Bookings from "./pages/Bookings";
import CreateAdmin from "./pages/CreateAdmin";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Reviews from "./pages/Reviews";
import Users from "./pages/Users";

const navItems = [
  { id: "dashboard", label: "Dashboard" },
  { id: "users", label: "Users" },
  { id: "bookings", label: "Bookings" },
  { id: "reviews", label: "Reviews" },
  { id: "createAdmin", label: "Create Admin" },
];

export default function App() {
  const { isAuthenticated, loading, logout, user } = useAuth();
  const [activePage, setActivePage] = useState("dashboard");

  if (loading) {
    return <div className="login-page">Loading ServiceWale Admin...</div>;
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  const renderPage = () => {
    if (activePage === "users") {
      return <Users />;
    }

    if (activePage === "bookings") {
      return <Bookings />;
    }

    if (activePage === "reviews") {
      return <Reviews />;
    }

    if (activePage === "createAdmin") {
      return <CreateAdmin />;
    }

    return <Dashboard />;
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <BrandLogo />
        <p className="muted">Admin Panel</p>

        <nav className="nav">
          {navItems.map((item) => (
            <button
              className={activePage === item.id ? "active" : ""}
              key={item.id}
              onClick={() => setActivePage(item.id)}
            >
              {item.label}
            </button>
          ))}
          <button onClick={logout}>Logout</button>
        </nav>
      </aside>

      <main className="main">
        <div className="page-header">
          <div>
            <h1 className="page-title">Admin Console</h1>
            <p className="muted">Signed in as {user?.name || user?.email}</p>
          </div>
        </div>
        {renderPage()}
      </main>
    </div>
  );
}
