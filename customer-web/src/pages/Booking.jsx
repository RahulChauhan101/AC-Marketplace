import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import api from "../services/api";
import PageHeader from "../components/PageHeader";
import { useAuth } from "../context/AuthContext";
import { services } from "../services/serviceTypes";

const initialAddress = (user) => ({
  street: user?.address?.street || "",
  city: user?.address?.city || "",
  state: user?.address?.state || "",
  pincode: user?.address?.pincode || "",
  landmark: user?.address?.landmark || "",
});

export default function Booking() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const defaultService = searchParams.get("serviceType") || "repair";
  const minDateTime = useMemo(() => new Date().toISOString().slice(0, 16), []);
  const [form, setForm] = useState({
    serviceType: defaultService,
    issueDescription: "",
    scheduledAt: "",
    brand: "",
    model: "",
    capacity: "",
    acType: "split",
    notes: "",
    address: initialAddress(user),
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const updateAddress = (field, value) => {
    setForm((current) => ({
      ...current,
      address: {
        ...current.address,
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      await api.post("/bookings", {
        serviceType: form.serviceType,
        issueDescription: form.issueDescription,
        scheduledAt: form.scheduledAt,
        notes: form.notes,
        acDetails: {
          brand: form.brand,
          model: form.model,
          capacity: form.capacity,
          acType: form.acType,
        },
        address: form.address,
      });
      setSuccess("Booking created successfully. Our team will assign a serviceman soon.");
      setTimeout(() => navigate("/bookings"), 900);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to create booking.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Book service"
        title="Schedule your ServiceWale visit."
        description="Tell us what you need, where service is required and when a technician should visit."
      />

      <section className="py-12">
        <div className="container-page max-w-4xl">
          <form onSubmit={handleSubmit} className="card grid gap-6 p-8 md:grid-cols-2">
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700 md:col-span-2">
                {error}
              </div>
            )}
            {success && (
              <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-semibold text-green-700 md:col-span-2">
                {success}
              </div>
            )}

            <div>
              <label className="label" htmlFor="serviceType">
                Service type
              </label>
              <select
                id="serviceType"
                className="input mt-2"
                value={form.serviceType}
                onChange={(event) => updateField("serviceType", event.target.value)}
                required
              >
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label" htmlFor="scheduledAt">
                Preferred date and time
              </label>
              <input
                id="scheduledAt"
                className="input mt-2"
                type="datetime-local"
                min={minDateTime}
                value={form.scheduledAt}
                onChange={(event) => updateField("scheduledAt", event.target.value)}
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="label" htmlFor="issueDescription">
                Issue description
              </label>
              <textarea
                id="issueDescription"
                className="input mt-2 min-h-28"
                value={form.issueDescription}
                onChange={(event) => updateField("issueDescription", event.target.value)}
                placeholder="Example: appliance not working, leakage, wiring issue..."
                required
              />
            </div>

            <div>
              <label className="label" htmlFor="brand">
                Brand
              </label>
              <input
                id="brand"
                className="input mt-2"
                value={form.brand}
                onChange={(event) => updateField("brand", event.target.value)}
              />
            </div>
            <div>
              <label className="label" htmlFor="model">
                Model
              </label>
              <input
                id="model"
                className="input mt-2"
                value={form.model}
                onChange={(event) => updateField("model", event.target.value)}
              />
            </div>
            <div>
              <label className="label" htmlFor="capacity">
                Capacity
              </label>
              <input
                id="capacity"
                className="input mt-2"
                placeholder="1.5 ton"
                value={form.capacity}
                onChange={(event) => updateField("capacity", event.target.value)}
              />
            </div>
            <div>
              <label className="label" htmlFor="acType">
                Appliance type
              </label>
              <select
                id="acType"
                className="input mt-2"
                value={form.acType}
                onChange={(event) => updateField("acType", event.target.value)}
              >
                <option value="split">Split</option>
                <option value="window">Window</option>
                <option value="central">Central</option>
                <option value="portable">Portable</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <h2 className="text-xl font-black text-slate-950">Service address</h2>
            </div>
            <div className="md:col-span-2">
              <label className="label" htmlFor="street">
                Street
              </label>
              <input
                id="street"
                className="input mt-2"
                value={form.address.street}
                onChange={(event) => updateAddress("street", event.target.value)}
                required
              />
            </div>
            <div>
              <label className="label" htmlFor="city">
                City
              </label>
              <input
                id="city"
                className="input mt-2"
                value={form.address.city}
                onChange={(event) => updateAddress("city", event.target.value)}
                required
              />
            </div>
            <div>
              <label className="label" htmlFor="state">
                State
              </label>
              <input
                id="state"
                className="input mt-2"
                value={form.address.state}
                onChange={(event) => updateAddress("state", event.target.value)}
                required
              />
            </div>
            <div>
              <label className="label" htmlFor="pincode">
                Pincode
              </label>
              <input
                id="pincode"
                className="input mt-2"
                value={form.address.pincode}
                onChange={(event) => updateAddress("pincode", event.target.value)}
                required
              />
            </div>
            <div>
              <label className="label" htmlFor="landmark">
                Landmark
              </label>
              <input
                id="landmark"
                className="input mt-2"
                value={form.address.landmark}
                onChange={(event) => updateAddress("landmark", event.target.value)}
              />
            </div>
            <div className="md:col-span-2">
              <label className="label" htmlFor="notes">
                Additional notes
              </label>
              <textarea
                id="notes"
                className="input mt-2 min-h-24"
                value={form.notes}
                onChange={(event) => updateField("notes", event.target.value)}
              />
            </div>

            <button className="btn-primary md:col-span-2" disabled={submitting}>
              {submitting ? "Creating booking..." : "Confirm Booking"}
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
