import { useCallback, useEffect, useState } from "react";

import BookingCard from "../components/BookingCard";
import api from "../services/api";

const nextAction = (status) => {
  if (status === "confirmed") {
    return { label: "Start Work", status: "in_progress" };
  }

  if (status === "in_progress") {
    return { label: "Mark Completed", status: "completed" };
  }

  return null;
};

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState("");
  const [error, setError] = useState("");

  const loadBookings = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await api.get("/bookings");
      setBookings(data.data.bookings || []);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to load bookings.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const updateStatus = async (booking) => {
    const action = nextAction(booking.status);

    if (!action) {
      return;
    }

    setUpdatingId(booking._id);
    setError("");

    try {
      await api.patch(`/bookings/${booking._id}`, {
        status: action.status,
        servicemanNote: `Updated to ${action.status} from serviceman web`,
      });
      await loadBookings();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Update failed.");
    } finally {
      setUpdatingId("");
    }
  };

  return (
    <div className="page-stack">
      <div className="page-header compact">
        <div>
          <h2 className="page-title">My Jobs</h2>
          <p className="muted">Bookings assigned to your serviceman account.</p>
        </div>
        <button className="btn secondary" disabled={loading} onClick={loadBookings} type="button">
          Refresh
        </button>
      </div>

      {error ? <p className="error">{error}</p> : null}

      {bookings.length === 0 && !loading ? (
        <div className="card empty-state">
          <h3>No assigned jobs</h3>
          <p className="muted">Accepted bookings will appear here.</p>
        </div>
      ) : (
        bookings.map((booking) => {
          const action = nextAction(booking.status);

          return (
            <BookingCard
              actionLabel={action?.label}
              booking={booking}
              key={booking._id}
              loading={updatingId === booking._id}
              onAction={updateStatus}
            />
          );
        })
      )}
    </div>
  );
}
