import { useCallback, useEffect, useState } from "react";

import BookingCard from "../components/BookingCard";
import ConfirmModal from "../components/ConfirmModal";
import SubscriptionCard from "../components/SubscriptionCard";
import { useToast } from "../components/Toast";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { formatService } from "../utils/formatters";

export default function AvailableBookings() {
  const { refreshProfile, user } = useAuth();
  const { showToast } = useToast();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [acceptingId, setAcceptingId] = useState("");
  const [error, setError] = useState("");
  const [showSubscriptionPrompt, setShowSubscriptionPrompt] = useState(false);
  const [confirmBooking, setConfirmBooking] = useState(null);

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

  const acceptBooking = async () => {
    if (!confirmBooking) {
      return;
    }

    setAcceptingId(confirmBooking._id);
    setError("");
    setShowSubscriptionPrompt(false);

    try {
      await api.patch(`/bookings/${confirmBooking._id}/accept`);
      showToast("Work accepted. Customer has been notified.", "success");
      setConfirmBooking(null);
      await refreshProfile();
      await loadBookings();
    } catch (requestError) {
      const message = requestError.response?.data?.message || "Accept failed.";

      if (requestError.response?.status === 402) {
        setShowSubscriptionPrompt(true);
        await refreshProfile();
      }

      setError(message);
      showToast(message, "info");
    } finally {
      setAcceptingId("");
    }
  };

  return (
    <div className="page-stack">
      <div className="page-header compact">
        <div>
          <h2 className="page-title">Available Work</h2>
          <p className="muted">Pending bookings that are not assigned yet.</p>
        </div>
        <button className="btn secondary" disabled={loading} onClick={loadBookings} type="button">
          Refresh
        </button>
      </div>

      {error ? <p className="error">{error}</p> : null}

      {showSubscriptionPrompt || user?.subscription?.requiresPayment ? (
        <SubscriptionCard onUpdated={refreshProfile} subscription={user?.subscription} user={user} />
      ) : null}

      {bookings.length === 0 && !loading ? (
        <div className="card empty-state">
          <h3>No available work</h3>
          <p className="muted">Refresh when new requests arrive.</p>
        </div>
      ) : (
        bookings.map((booking) => (
          <BookingCard
            actionLabel="Accept Work"
            booking={booking}
            key={booking._id}
            loading={acceptingId === booking._id}
            onAction={setConfirmBooking}
          />
        ))
      )}

      <ConfirmModal
        cancelLabel="No"
        confirmLabel="Yes, Accept Work"
        message={
          confirmBooking
            ? `Accept ${formatService(confirmBooking.serviceType)} for ${confirmBooking.customer?.name || "customer"}?`
            : ""
        }
        onCancel={() => setConfirmBooking(null)}
        onConfirm={acceptBooking}
        open={Boolean(confirmBooking)}
        title="Accept this work?"
      />
    </div>
  );
}
