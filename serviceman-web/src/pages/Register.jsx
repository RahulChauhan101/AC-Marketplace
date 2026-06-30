import { useState } from "react";

import BrandLogo from "../components/BrandLogo";
import { useAuth } from "../context/AuthContext";
import { serviceTypes } from "../utils/serviceTypes";

export default function Register({ onGoLogin }) {
  const { register } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    city: "",
    pincodes: "",
  });
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const toggleCategory = (categoryId) => {
    setSelectedCategories((current) =>
      current.includes(categoryId)
        ? current.filter((item) => item !== categoryId)
        : [...current, categoryId]
    );
  };

  const submit = async (event) => {
    event.preventDefault();

    const pincodes = form.pincodes
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);

    if (!form.name || !form.email || !form.password) {
      setErrorMessage("Name, email and password are required.");
      return;
    }

    if (!form.city || pincodes.length === 0) {
      setErrorMessage("Enter your service city and at least one pincode.");
      return;
    }

    if (selectedCategories.length === 0) {
      setErrorMessage("Select at least one service category.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        phone: form.phone.trim(),
        serviceCategories: selectedCategories,
        serviceArea: {
          city: form.city.trim(),
          pincodes,
        },
      });
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || error.message || "Registration failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <form className="card login-card register-card" onSubmit={submit}>
        <BrandLogo className="login-brand" />
        <h1 className="page-title">Create Serviceman Account</h1>
        <p className="muted">
          Register to receive nearby bookings and manage your work on ServiceWale.
        </p>
        <p className="subscription-note">
          First 3 services are free. After that, pay Rs 99 once for 1 year unlimited services.
        </p>

        <input
          className="input"
          onChange={(event) => updateField("name", event.target.value)}
          placeholder="Full name"
          required
          type="text"
          value={form.name}
        />
        <input
          className="input"
          onChange={(event) => updateField("email", event.target.value)}
          placeholder="Email"
          required
          type="email"
          value={form.email}
        />
        <input
          className="input"
          minLength={6}
          onChange={(event) => updateField("password", event.target.value)}
          placeholder="Password (min 6 characters)"
          required
          type="password"
          value={form.password}
        />
        <input
          className="input"
          onChange={(event) => updateField("phone", event.target.value)}
          placeholder="Phone"
          type="tel"
          value={form.phone}
        />
        <input
          className="input"
          onChange={(event) => updateField("city", event.target.value)}
          placeholder="Service city"
          required
          type="text"
          value={form.city}
        />
        <input
          className="input"
          onChange={(event) => updateField("pincodes", event.target.value)}
          placeholder="Pincodes (comma separated)"
          required
          type="text"
          value={form.pincodes}
        />

        <p className="section-label">Service Categories</p>
        <div className="select-chips">
          {serviceTypes.map((service) => {
            const selected = selectedCategories.includes(service.id);

            return (
              <button
                className={selected ? "select-chip active" : "select-chip"}
                key={service.id}
                onClick={() => toggleCategory(service.id)}
                type="button"
              >
                {service.logo} {service.label}
              </button>
            );
          })}
        </div>

        <button className="btn orange login-button" disabled={loading} type="submit">
          {loading ? "Creating account..." : "Register"}
        </button>

        <button className="auth-link" onClick={onGoLogin} type="button">
          Already have an account? <span>Login</span>
        </button>

        {errorMessage ? <p className="error inline-error">{errorMessage}</p> : null}
      </form>
    </div>
  );
}
