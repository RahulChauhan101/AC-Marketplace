import { Outlet } from "react-router-dom";
import { useState } from "react";

import BookingNotificationWatcher from "../components/BookingNotificationWatcher";
import Navbar from "../components/Navbar";
import RatingModal from "../components/RatingModal";
import { ToastProvider, useToast } from "../components/Toast";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

function LayoutContent() {
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [ratingBooking, setRatingBooking] = useState(null);

  const submitReview = async ({ bookingId, rating, comment }) => {
    await api.post("/reviews", { bookingId, rating, comment });
    showToast("Thank you for rating your serviceman.", "success");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {isAuthenticated ? (
        <BookingNotificationWatcher onCompletedBooking={setRatingBooking} />
      ) : null}

      <RatingModal
        booking={ratingBooking}
        onClose={() => setRatingBooking(null)}
        onSubmit={submitReview}
        open={Boolean(ratingBooking)}
      />

      <Navbar />
      <main>
        <Outlet />
      </main>
      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="container-page flex flex-col gap-2 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} ServiceWale</p>
          <p>Trusted home services, repairs, installation and maintenance.</p>
        </div>
      </footer>
    </div>
  );
}

export default function Layout() {
  return (
    <ToastProvider>
      <LayoutContent />
    </ToastProvider>
  );
}
