import { useState } from "react";

import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(form);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Unable to login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="login-page">
      <div className="card login-card">
        <div className="brand">
          <span className="brand-mark">SW</span>
          <span>ServiceWale</span>
        </div>
        <h1 className="page-title">Admin Login</h1>
        <p className="muted">Use an admin account to manage users and bookings.</p>

        {error && <div className="error">{error}</div>}

        <form className="grid" onSubmit={submit}>
          <input
            className="input"
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            placeholder="Email"
            required
            type="email"
            value={form.email}
          />
          <input
            className="input"
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            placeholder="Password"
            required
            type="password"
            value={form.password}
          />
          <button className="btn orange" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </section>
  );
}
