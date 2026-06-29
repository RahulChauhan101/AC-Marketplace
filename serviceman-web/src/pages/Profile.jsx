import { useState } from "react";

import { useAuth } from "../context/AuthContext";
import { formatService } from "../utils/formatters";

export default function Profile() {
  const { updateProfile, user } = useAuth();
  const [error, setError] = useState("");

  const toggleAvailability = async (event) => {
    setError("");

    try {
      await updateProfile({ isAvailable: event.target.checked });
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Update failed.");
    }
  };

  return (
    <div className="page-stack">
      <div>
        <h2 className="page-title">Profile</h2>
        <p className="muted">Your serviceman account details from ServiceWale.</p>
      </div>

      {error ? <p className="error">{error}</p> : null}

      <section className="card">
        <h3 className="highlight">{user?.name}</h3>
        <p className="muted">{user?.email}</p>
        <p className="muted">{user?.phone || "Phone not set"}</p>
      </section>

      <section className="card row-between">
        <div>
          <p className="label">Availability</p>
          <p className="muted">{user?.isAvailable ? "Available" : "Unavailable"}</p>
        </div>
        <label className="switch">
          <input checked={Boolean(user?.isAvailable)} onChange={toggleAvailability} type="checkbox" />
          <span className="slider" />
        </label>
      </section>

      <section className="card">
        <p className="label">Service Area</p>
        <h3 className="highlight">{user?.serviceArea?.city || "City not set"}</h3>
        <p className="muted">
          Pincodes: {user?.serviceArea?.pincodes?.join(", ") || "Not listed"}
        </p>
      </section>

      <section className="card">
        <p className="label">Service Categories</p>
        <div className="chips">
          {(user?.serviceCategories || []).map((category) => (
            <span className="badge" key={category}>
              {formatService(category)}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
