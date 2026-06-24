import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone,
        address: {
          street: form.street,
          city: form.city,
          state: form.state,
          pincode: form.pincode,
        },
      });
      navigate("/booking");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to register. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-16">
      <div className="container-page max-w-3xl">
        <div className="card p-8">
          <h1 className="text-3xl font-black text-slate-950">Create customer account</h1>
          <p className="mt-2 text-slate-600">
            Register once and manage all your AC service bookings from one place.
          </p>

          {error && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 grid gap-5 md:grid-cols-2">
            <div>
              <label className="label" htmlFor="name">
                Full name
              </label>
              <input
                id="name"
                className="input mt-2"
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                required
              />
            </div>
            <div>
              <label className="label" htmlFor="phone">
                Phone
              </label>
              <input
                id="phone"
                className="input mt-2"
                value={form.phone}
                onChange={(event) => updateField("phone", event.target.value)}
              />
            </div>
            <div>
              <label className="label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                className="input mt-2"
                type="email"
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
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
                minLength={6}
                value={form.password}
                onChange={(event) => updateField("password", event.target.value)}
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="label" htmlFor="street">
                Street address
              </label>
              <input
                id="street"
                className="input mt-2"
                value={form.street}
                onChange={(event) => updateField("street", event.target.value)}
              />
            </div>
            <div>
              <label className="label" htmlFor="city">
                City
              </label>
              <input
                id="city"
                className="input mt-2"
                value={form.city}
                onChange={(event) => updateField("city", event.target.value)}
              />
            </div>
            <div>
              <label className="label" htmlFor="state">
                State
              </label>
              <input
                id="state"
                className="input mt-2"
                value={form.state}
                onChange={(event) => updateField("state", event.target.value)}
              />
            </div>
            <div>
              <label className="label" htmlFor="pincode">
                Pincode
              </label>
              <input
                id="pincode"
                className="input mt-2"
                value={form.pincode}
                onChange={(event) => updateField("pincode", event.target.value)}
              />
            </div>
            <button className="btn-primary md:col-span-2" disabled={submitting}>
              {submitting ? "Creating account..." : "Register"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Already registered?{" "}
            <Link to="/login" className="font-bold text-brand-700">
              Login
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
