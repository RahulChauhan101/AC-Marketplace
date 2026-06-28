import { useEffect, useState } from "react";

import api from "../services/api";

const statLabels = {
  bookings: "Bookings",
  completedBookings: "Completed",
  customers: "Customers",
  pendingBookings: "Pending",
  reviews: "Reviews",
  revenue: "Revenue",
  servicemen: "Servicemen",
  users: "Users",
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await api.get("/admin/dashboard");
      setStats(data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  return (
    <section>
      <div className="page-header">
        <div>
          <h2 className="page-title">Dashboard</h2>
          <p className="muted">Overview of ServiceWale platform activity.</p>
        </div>
        <button className="btn secondary" onClick={loadDashboard}>
          Refresh
        </button>
      </div>

      {error && <div className="error">{error}</div>}
      {loading && <div className="card">Loading dashboard...</div>}

      {stats && (
        <div className="grid stats-grid">
          {Object.entries(statLabels).map(([key, label]) => (
            <article className="card" key={key}>
              <span className="muted">{label}</span>
              <p className="stat-value">
                {key === "revenue" ? `₹${stats[key] || 0}` : stats[key] || 0}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
