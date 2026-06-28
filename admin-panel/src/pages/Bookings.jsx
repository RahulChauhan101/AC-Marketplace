import { useEffect, useState } from "react";

import api from "../services/api";

const statuses = ["pending", "confirmed", "in_progress", "completed", "cancelled"];

const formatDate = (value) =>
  value
    ? new Intl.DateTimeFormat("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(value))
    : "Not scheduled";

const formatService = (value) => value?.replace(/-/g, " ") || "Service";

export default function Bookings() {
  const [assignForms, setAssignForms] = useState({});
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [servicemen, setServicemen] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");

  const loadData = async (status = statusFilter) => {
    setLoading(true);
    setError("");

    try {
      const [bookingsResponse, usersResponse] = await Promise.all([
        api.get("/bookings", { params: status ? { status } : {} }),
        api.get("/admin/users", { params: { role: "serviceman" } }),
      ]);

      setBookings(bookingsResponse.data.data.bookings);
      setServicemen(usersResponse.data.data.users.filter((user) => user.isActive));
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateAssignForm = (bookingId, field, value) => {
    setAssignForms((current) => ({
      ...current,
      [bookingId]: {
        ...(current[bookingId] || {}),
        [field]: value,
      },
    }));
  };

  const assignServiceman = async (bookingId) => {
    const form = assignForms[bookingId] || {};

    if (!form.servicemanId) {
      setError("Select a serviceman before assigning.");
      return;
    }

    try {
      await api.patch(`/bookings/${bookingId}/assign`, {
        servicemanId: form.servicemanId,
        serviceCharge: Number(form.serviceCharge || 0),
        partsCharge: Number(form.partsCharge || 0),
      });
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to assign serviceman.");
    }
  };

  const updateStatus = async (bookingId, status) => {
    try {
      await api.patch(`/bookings/${bookingId}`, {
        status,
        adminNote: `Updated to ${status} from admin panel`,
      });
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update booking status.");
    }
  };

  return (
    <section>
      <div className="page-header">
        <div>
          <h2 className="page-title">Bookings</h2>
          <p className="muted">Assign servicemen and update booking status.</p>
        </div>
        <select
          className="input"
          onChange={(event) => {
            setStatusFilter(event.target.value);
            loadData(event.target.value);
          }}
          value={statusFilter}
        >
          <option value="">All statuses</option>
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      {error && <div className="error">{error}</div>}
      {loading && <div className="card">Loading bookings...</div>}

      {!loading && (
        <div className="grid">
          {bookings.map((booking) => {
            const assignForm = assignForms[booking._id] || {};

            return (
              <article className="card" key={booking._id}>
                <div className="page-header">
                  <div>
                    <h3>{formatService(booking.serviceType)}</h3>
                    <p className="muted">{booking.issueDescription}</p>
                  </div>
                  <span className="badge">{booking.status}</span>
                </div>

                <div className="form-grid">
                  <div>
                    <strong>Customer</strong>
                    <p className="muted">
                      {booking.customer?.name} ({booking.customer?.phone || "No phone"})
                    </p>
                  </div>
                  <div>
                    <strong>Serviceman</strong>
                    <p className="muted">{booking.serviceman?.name || "Not assigned"}</p>
                  </div>
                  <div>
                    <strong>Schedule</strong>
                    <p className="muted">{formatDate(booking.scheduledAt)}</p>
                  </div>
                  <div>
                    <strong>Amount</strong>
                    <p className="muted">₹{booking.pricing?.totalAmount || 0}</p>
                  </div>
                  <div>
                    <strong>Address</strong>
                    <p className="muted">
                      {booking.address?.street}, {booking.address?.city},{" "}
                      {booking.address?.pincode}
                    </p>
                  </div>
                  <div>
                    <strong>Payment</strong>
                    <p className="muted">{booking.paymentStatus}</p>
                  </div>
                </div>

                {!booking.serviceman && (
                  <div className="form-grid" style={{ marginTop: 16 }}>
                    <select
                      className="input"
                      onChange={(event) =>
                        updateAssignForm(booking._id, "servicemanId", event.target.value)
                      }
                      value={assignForm.servicemanId || ""}
                    >
                      <option value="">Select serviceman</option>
                      {servicemen.map((serviceman) => (
                        <option key={serviceman._id} value={serviceman._id}>
                          {serviceman.name} - {serviceman.serviceArea?.city || "No city"}
                        </option>
                      ))}
                    </select>
                    <input
                      className="input"
                      min="0"
                      onChange={(event) =>
                        updateAssignForm(booking._id, "serviceCharge", event.target.value)
                      }
                      placeholder="Service charge"
                      type="number"
                      value={assignForm.serviceCharge || ""}
                    />
                    <input
                      className="input"
                      min="0"
                      onChange={(event) =>
                        updateAssignForm(booking._id, "partsCharge", event.target.value)
                      }
                      placeholder="Parts charge"
                      type="number"
                      value={assignForm.partsCharge || ""}
                    />
                    <button className="btn orange" onClick={() => assignServiceman(booking._id)}>
                      Assign
                    </button>
                  </div>
                )}

                <div className="form-grid" style={{ marginTop: 16 }}>
                  <select
                    className="input"
                    onChange={(event) => updateStatus(booking._id, event.target.value)}
                    value={booking.status}
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
