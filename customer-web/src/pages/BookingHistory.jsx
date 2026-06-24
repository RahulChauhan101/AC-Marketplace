import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../services/api";
import PageHeader from "../components/PageHeader";

const statusStyles = {
  pending: "bg-yellow-50 text-yellow-700",
  confirmed: "bg-blue-50 text-blue-700",
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

export default function BookingHistory() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadBookings = async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await api.get("/bookings");
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

  return (
    <>
      <PageHeader
        eyebrow="Booking history"
        title="Track all your AC service requests."
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

                  {!["completed", "cancelled"].includes(booking.status) && (
                    <button
                      onClick={() => cancelBooking(booking._id)}
                      className="btn-secondary mt-5 border-red-200 text-red-700 hover:border-red-300 hover:text-red-800"
                    >
                      Cancel Booking
                    </button>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
