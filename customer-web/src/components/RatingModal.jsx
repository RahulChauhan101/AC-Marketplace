import { useState } from "react";

export default function RatingModal({ booking, onClose, onSubmit, open }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!open || !booking) {
    return null;
  }

  const submit = async () => {
    setSubmitting(true);
    setError("");

    try {
      await onSubmit({ bookingId: booking._id, rating, comment });
      setRating(5);
      setComment("");
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Unable to submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" role="presentation">
      <div className="modal-card" role="dialog" aria-modal="true">
        <h3 className="modal-title">Rate your service</h3>
        <p className="text-slate-600">
          How was your experience with {booking.serviceman?.name || "the serviceman"}?
        </p>

        <div className="rating-stars">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              className={value <= rating ? "star active" : "star"}
              key={value}
              onClick={() => setRating(value)}
              type="button"
            >
              ★
            </button>
          ))}
        </div>

        <textarea
          className="input mt-4 min-h-28"
          onChange={(event) => setComment(event.target.value)}
          placeholder="Write your review (optional)"
          value={comment}
        />

        {error ? <p className="mt-3 text-sm font-semibold text-red-600">{error}</p> : null}

        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose} type="button">
            Cancel
          </button>
          <button className="btn-primary" disabled={submitting} onClick={submit} type="button">
            {submitting ? "Submitting..." : "Submit Rating"}
          </button>
        </div>
      </div>
    </div>
  );
}
