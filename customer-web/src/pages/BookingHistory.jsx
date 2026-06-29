import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../services/api";
import PageHeader from "../components/PageHeader";

const statusStyles = {
  pending: "bg-yellow-50 text-yellow-700",
  confirmed: "bg-brand-50 text-brand-700",
  in_progress: "bg-purple-50 text-purple-700",
  completed: "bg-green-50 text-green-700",
  cancelled: "bg-red-50 text-red-700",
};

const formatDate = (value) =>
  value
    ? new Intl.DateTimeFormat("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(value))
    : "Not scheduled";

const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

export default function BookingHistory() {
  const [bookings, setBookings] = useState([]);
  const [reviewsByBooking, setReviewsByBooking] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingPaymentId, setProcessingPaymentId] = useState("");

  const loadReviews = async () => {
    const { data } = await api.get("/reviews/me");
    const nextReviewsByBooking = {};

    data.data.reviews.forEach((review) => {
      const bookingId = review.booking?._id || review.booking;

      if (bookingId) {
        nextReviewsByBooking[bookingId] = review;
      }
    });

    setReviewsByBooking(nextReviewsByBooking);
  };

  const loadBookings = async () => {
    setLoading(true);
    setError("");

    try {
      const [{ data }] = await Promise.all([api.get("/bookings"), loadReviews()]);
      setBookings(data.data.bookings);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const cancelBooking = async (bookingId) => {
    const reason = window.prompt("Reason for cancellation?");

    if (reason === null) {
      return;
    }

    try {
      await api.patch(`/bookings/${bookingId}/cancel`, { reason });
      loadBookings();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to cancel booking.");
    }
  };

  const createReview = async (bookingId) => {
    const rating = window.prompt("Rating 1 to 5?");

    if (rating === null) {
      return;
    }

    const numericRating = Number(rating);

    if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
      setError("Rating must be a number between 1 and 5.");
      return;
    }

    const comment = window.prompt("Write your review comment:");

    if (comment === null) {
      return;
    }

    try {
      await api.post("/reviews", {
        bookingId,
        rating: numericRating,
        comment,
      });

      await loadReviews();
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to submit review.");
    }
  };

  const payNow = async (booking) => {
    setError("");
    setProcessingPaymentId(booking._id);

    try {
      const scriptLoaded = await loadRazorpayScript();

      if (!scriptLoaded) {
        setError("Unable to load Razorpay checkout. Please try again.");
        return;
      }

      const { data } = await api.post(`/payments/bookings/${booking._id}/order`);
      const { keyId, order } = data.data;

      const checkout = new window.Razorpay({
        key: keyId,
        amount: order.amount,
        currency: order.currency,
        name: "ServiceWale",
        description: `${booking.serviceType?.replace("-", " ")} service payment`,
        order_id: order.id,
        prefill: {
          name: booking.customer?.name,
          email: booking.customer?.email,
          contact: booking.customer?.phone,
        },
        notes: {
          bookingId: booking._id,
        },
        handler: async (response) => {
          try {
            await api.post("/payments/razorpay/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            await loadBookings();
          } catch (err) {
            setError(err.response?.data?.message || "Payment verification failed.");
          } finally {
            setProcessingPaymentId("");
          }
        },
        modal: {
          ondismiss: () => setProcessingPaymentId(""),
        },
        theme: {
          color: "#f97316",
        },
      });

      checkout.open();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to start payment.");
      setProcessingPaymentId("");
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Booking history"
        title="Track all your ServiceWale bookings."
        description="View schedules, assigned servicemen, payment status and booking progress."
      />

      <section className="py-12">
        <div className="container-page">
          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
              {error}
            </div>
          )}

          {loading ? (
            <div className="card p-8 text-center text-slate-600">Loading bookings...</div>
          ) : bookings.length === 0 ? (
            <div className="card p-8 text-center">
              <h2 className="text-2xl font-black text-slate-950">No bookings yet</h2>
              <p className="mt-2 text-slate-600">
                Your service requests will appear here once you create a booking.
              </p>
              <Link to="/booking" className="btn-primary mt-6">
                Book Your First Service
              </Link>
            </div>
          ) : (
            <div className="space-y-5">
              {bookings.map((booking) => (
                <article key={booking._id} className="card p-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-2xl font-black capitalize text-slate-950">
                          {booking.serviceType?.replace("-", " ")}
                        </h2>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            statusStyles[booking.status] || "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {booking.status?.replace("_", " ")}
                        </span>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                          Payment: {booking.paymentStatus}
                        </span>
                      </div>
                      <p className="mt-3 leading-7 text-slate-600">
                        {booking.issueDescription}
                      </p>
                      <p className="mt-3 text-sm font-semibold text-slate-500">
                        Scheduled: {formatDate(booking.scheduledAt)}
                      </p>
                      {booking.status === "completed" && (
                        <p className="mt-1 text-sm font-semibold text-green-700">
                          Completed: {formatDate(booking.completedAt)}
                        </p>
                      )}
                      <p className="mt-1 text-sm text-slate-500">
                        {booking.address?.street}, {booking.address?.city},{" "}
                        {booking.address?.pincode}
                      </p>
                    </div>

                    <div className="min-w-56 rounded-2xl bg-slate-50 p-4">
                      <p className="text-sm font-bold text-slate-500">Assigned serviceman</p>
                      <p className="mt-1 font-black text-slate-950">
                        {booking.serviceman?.name || "Pending assignment"}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {booking.serviceman?.phone || "Contact not available"}
                      </p>
                      <p className="mt-4 text-sm font-bold text-slate-500">Total</p>
                      <p className="text-xl font-black text-brand-700">
                        ₹{booking.pricing?.totalAmount || 0}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    {booking.paymentStatus !== "paid" && booking.pricing?.totalAmount > 0 && (
                      <button
                        onClick={() => payNow(booking)}
                        disabled={processingPaymentId === booking._id}
                        className="btn-primary disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {processingPaymentId === booking._id ? "Opening payment..." : "Pay Now"}
                      </button>
                    )}

                    {!["completed", "cancelled"].includes(booking.status) && (
                      <button
                        onClick={() => cancelBooking(booking._id)}
                        className="btn-secondary border-red-200 text-red-700 hover:border-red-300 hover:text-red-800"
                      >
                        Cancel Booking
                      </button>
                    )}

                    {booking.status === "completed" && booking.serviceman && (
                      reviewsByBooking[booking._id] ? (
                        <span className="rounded-xl bg-green-50 px-4 py-2 text-sm font-bold text-green-700">
                          Reviewed: {reviewsByBooking[booking._id].rating}/5
                        </span>
                      ) : (
                        <button
                          onClick={() => createReview(booking._id)}
                          className="btn-secondary"
                        >
                          Leave Review
                        </button>
                      )
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
