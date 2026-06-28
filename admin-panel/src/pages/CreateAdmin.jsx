import { useState } from "react";

import api from "../services/api";

const initialForm = {
  email: "",
  name: "",
  password: "",
  phone: "",
};

export default function CreateAdmin() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await api.post("/admin/create-admin", form);
      setSuccess("Admin created successfully.");
      setForm(initialForm);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to create admin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <div className="page-header">
        <div>
          <h2 className="page-title">Create Admin</h2>
          <p className="muted">Add another admin user to manage ServiceWale.</p>
        </div>
      </div>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <form className="card form-grid" onSubmit={submit}>
        <input
          className="input"
          onChange={(event) => update("name", event.target.value)}
          placeholder="Full name"
          required
          value={form.name}
        />
        <input
          className="input"
          onChange={(event) => update("email", event.target.value)}
          placeholder="Email"
          required
          type="email"
          value={form.email}
        />
        <input
          className="input"
          onChange={(event) => update("password", event.target.value)}
          placeholder="Password"
          required
          type="password"
          value={form.password}
        />
        <input
          className="input"
          onChange={(event) => update("phone", event.target.value)}
          placeholder="Phone"
          value={form.phone}
        />
        <button className="btn orange" disabled={loading}>
          {loading ? "Creating..." : "Create Admin"}
        </button>
      </form>
    </section>
  );
}
