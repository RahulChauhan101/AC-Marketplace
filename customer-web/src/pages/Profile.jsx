import { useState } from "react";

import PageHeader from "../components/PageHeader";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    street: user?.address?.street || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
    pincode: user?.address?.pincode || "",
    landmark: user?.address?.landmark || "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");
    setSubmitting(true);

    try {
      await updateProfile({
        name: form.name,
        phone: form.phone,
        address: {
          street: form.street,
          city: form.city,
          state: form.state,
          pincode: form.pincode,
          landmark: form.landmark,
        },
      });
      setMessage("Profile updated successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update profile.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Profile"
        title="Manage your customer details."
        description="Keep your phone number and default service address ready for faster bookings."
      />

      <section className="py-12">
        <div className="container-page max-w-3xl">
          <form onSubmit={handleSubmit} className="card grid gap-5 p-8 md:grid-cols-2">
            {message && (
              <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-semibold text-green-700 md:col-span-2">
                {message}
              </div>
            )}
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700 md:col-span-2">
                {error}
              </div>
            )}
            <div>
              <label className="label" htmlFor="name">
                Name
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
            <div className="md:col-span-2">
              <label className="label" htmlFor="street">
                Street
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
            <div>
              <label className="label" htmlFor="landmark">
                Landmark
              </label>
              <input
                id="landmark"
                className="input mt-2"
                value={form.landmark}
                onChange={(event) => updateField("landmark", event.target.value)}
              />
            </div>
            <button className="btn-primary md:col-span-2" disabled={submitting}>
              {submitting ? "Saving..." : "Save Profile"}
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
