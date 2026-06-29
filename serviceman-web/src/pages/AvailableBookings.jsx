import { useCallback, useEffect, useState } from "react";

import BookingCard from "../components/BookingCard";
import api from "../services/api";

export default function AvailableBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [acceptingId, setAcceptingId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadBookings = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await api.get("/bookings/available");
      setBookings(data.data || []);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to load jobs.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const acceptBooking = async (booking) => {
    setAcceptingId(booking._id);
    setMessage("");
    setError("");

    try {
      await api.patch(`/bookings/${booking._id}/accept`);
      setMessage("Job accepted. This booking is now assigned to you.");
      await loadBookings();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Accept failed.");
    } finally {
      setAcceptingId("");
    }
  };

  return (
    <div className="page-stack">
      <div className="page-header compact">
        <div>
          <h2 className="page-title">Available Jobs</h2>
          <p className="muted">Pending bookings that are not assigned yet.</p>
        </div>
        <button className="btn secondary" disabled={loading} onClick={loadBookings} type="button">
          Refresh
        </button>
      </div>

      {message ? <p className="success">{message}</p> : null}
      {error ? <p className="error">{error}</p> : null}

      {bookings.length === 0 && !loading ? (
        <div className="card empty-state">
          <h3>No available jobs</h3>
          <p className="muted">Refresh when new requests arrive.</p>
        </div>
      ) : (
        bookings.map((booking) => (
          <BookingCard
            actionLabel="Accept Job"
            booking={booking}
            key={booking._id}
            loading={acceptingId === booking._id}
            onAction={acceptBooking}
          />
        ))
      )}
    </div>
  );
}
