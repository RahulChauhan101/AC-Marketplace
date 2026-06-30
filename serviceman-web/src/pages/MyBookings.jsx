import { useCallback, useEffect, useState } from "react";

import BookingCard from "../components/BookingCard";
import ConfirmModal from "../components/ConfirmModal";
import { useToast } from "../components/Toast";
import api from "../services/api";
import { formatService } from "../utils/formatters";

const nextAction = (status) => {
  if (status === "confirmed") {
    return { label: "Start Work", status: "in_progress", title: "Start service work?" };
  }

  if (status === "in_progress") {
    return {
      label: "Mark Completed",
      status: "completed",
      title: "Complete this service?",
      message: "Mark this job as completed? The customer will be asked to rate your service.",
    };
  }

  return null;
};

export default function MyBookings() {
  const { showToast } = useToast();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState("");
  const [error, setError] = useState("");
  const [confirmState, setConfirmState] = useState(null);
  const [reviewsByBooking, setReviewsByBooking] = useState({});

  const loadReviews = async () => {
    try {
      const { data } = await api.get("/reviews/me");
      const nextReviewsByBooking = {};

      (data.data.reviews || []).forEach((review) => {
        const bookingId = review.booking?._id || review.booking;

        if (bookingId) {
          nextReviewsByBooking[bookingId] = review;
        }
      });

      setReviewsByBooking(nextReviewsByBooking);
    } catch {
      setReviewsByBooking({});
    }
  };

  const loadBookings = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await api.get("/bookings");
      setBookings(data.data.bookings || []);
      await loadReviews();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to load bookings.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const updateStatus = async () => {
    if (!confirmState) {
      return;
    }

    const { action, booking } = confirmState;
    setUpdatingId(booking._id);
    setError("");

    try {
      await api.patch(`/bookings/${booking._id}`, {
        status: action.status,
        servicemanNote: `Updated to ${action.status} from serviceman web`,
      });

      if (action.status === "completed") {
        showToast("Service marked completed. Waiting for customer rating.", "success");
      } else {
        showToast("Work started. Customer has been notified.", "success");
      }

      setConfirmState(null);
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
          <h2 className="page-title">My Work</h2>
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
              onAction={(selectedBooking) =>
                action ? setConfirmState({ booking: selectedBooking, action }) : null
              }
              review={reviewsByBooking[booking._id]}
            />
          );
        })
      )}

      <ConfirmModal
        cancelLabel="No"
        confirmLabel="Yes"
        message={
          confirmState?.action?.message ||
          (confirmState
            ? `Start ${formatService(confirmState.booking.serviceType)} for ${confirmState.booking.customer?.name || "customer"}?`
            : "")
        }
        onCancel={() => setConfirmState(null)}
        onConfirm={updateStatus}
        open={Boolean(confirmState)}
        title={confirmState?.action?.title || "Confirm action"}
      />
    </div>
  );
}
