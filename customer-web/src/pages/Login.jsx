import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await login(form);
      navigate(location.state?.from?.pathname || "/booking", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Unable to login. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-16">
      <div className="container-page max-w-xl">
        <div className="card p-8">
          <h1 className="text-3xl font-black text-slate-950">Login to your account</h1>
          <p className="mt-2 text-slate-600">
            Track bookings, update your profile and book services faster.
          </p>

          {error && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                className="input mt-2"
                type="email"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                required
              />
            </div>
            <div>
              <label className="label" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                className="input mt-2"
                type="password"
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                required
              />
            </div>
            <button className="btn-primary w-full" disabled={submitting}>
              {submitting ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            New to ServiceWale?{" "}
            <Link to="/register" className="font-bold text-brand-700">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
