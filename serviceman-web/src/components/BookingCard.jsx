import { formatDate, formatService } from "../utils/formatters";

export default function BookingCard({ actionLabel, booking, loading, onAction, review }) {
  return (
    <article className="card booking-card">
      <div className="booking-card-header">
        <h3 className="booking-title">{formatService(booking.serviceType)}</h3>
        <span className="badge">{booking.status}</span>
      </div>

      <p className="muted">{booking.issueDescription}</p>
      <p className="meta">Customer: {booking.customer?.name || "Customer"}</p>
      <p className="meta">Phone: {booking.customer?.phone || "Not available"}</p>
      <p className="meta">Schedule: {formatDate(booking.scheduledAt)}</p>
      <p className="meta">
        Address: {booking.address?.street}, {booking.address?.city} {booking.address?.pincode}
      </p>

      {booking.pricing?.totalAmount > 0 && (
        <p className="amount">Total: ₹{booking.pricing.totalAmount}</p>
      )}

      {booking.status === "completed" && (
        <div className="booking-rating">
          {review ? (
            <>
              <p className="review-rating">Customer rating: {review.rating}/5</p>
              <p className="muted">{review.comment || "No comment provided."}</p>
            </>
          ) : (
            <p className="muted">Waiting for customer rating.</p>
          )}
        </div>
      )}

      {actionLabel && (
        <button
          className="btn orange"
          disabled={loading}
          onClick={() => onAction?.(booking)}
          type="button"
        >
          {loading ? "Please wait..." : actionLabel}
        </button>
      )}
    </article>
  );
}
