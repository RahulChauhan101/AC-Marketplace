import BrandLogo from "../components/BrandLogo";
import { useAuth } from "../context/AuthContext";

export default function Dashboard({ onNavigate }) {
  const { logout, refreshProfile, user } = useAuth();

  return (
    <div className="page-stack">
      <section className="hero-card">
        <BrandLogo className="hero-brand" />
        <h2 className="hero-title">Hi {user?.name?.split(" ")[0] || "Serviceman"}</h2>
        <p className="hero-text">
          {user?.isAvailable ? "You are available for bookings." : "You are currently unavailable."}
        </p>
      </section>

      <section className="card">
        <p className="label">Service Area</p>
        <h3 className="highlight">{user?.serviceArea?.city || "City not set"}</h3>
        <p className="muted">
          Pincodes: {user?.serviceArea?.pincodes?.join(", ") || "Not listed"}
        </p>
      </section>

      <div className="grid">
        <button className="action-card" onClick={() => onNavigate("available")} type="button">
          <strong>Available Jobs</strong>
          <span className="muted">Accept open bookings near your service area.</span>
        </button>
        <button className="action-card" onClick={() => onNavigate("jobs")} type="button">
          <strong>My Jobs</strong>
          <span className="muted">Start work and mark visits completed.</span>
        </button>
        <button className="action-card" onClick={() => onNavigate("profile")} type="button">
          <strong>Profile</strong>
          <span className="muted">View services, availability and contact details.</span>
        </button>
      </div>

      <div className="toolbar">
        <button className="btn secondary" onClick={refreshProfile} type="button">
          Refresh Profile
        </button>
        <button className="btn danger" onClick={logout} type="button">
          Logout
        </button>
      </div>
    </div>
  );
}
