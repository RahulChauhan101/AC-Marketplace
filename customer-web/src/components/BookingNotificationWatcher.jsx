import { useEffect, useRef, useState } from "react";

import NotificationModal from "./NotificationModal";
import { useAuth } from "../context/AuthContext";
import { useToast } from "./Toast";
import api from "../services/api";
import { formatService } from "../utils/formatters";

const statusMessages = {
  in_progress: () => "Your serviceman has started the service work.",
  completed: () => "Service completed. Please rate your serviceman.",
};

export default function BookingNotificationWatcher({ onCompletedBooking }) {
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const previousStatuses = useRef({});
  const [acceptedBooking, setAcceptedBooking] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      return undefined;
    }

    const pollBookings = async () => {
      try {
        const { data } = await api.get("/bookings");
        const bookings = data.data.bookings || [];

        bookings.forEach((booking) => {
          const previousStatus = previousStatuses.current[booking._id];
          const currentStatus = booking.status;

          if (previousStatus && previousStatus !== currentStatus) {
            if (currentStatus === "confirmed" && previousStatus === "pending") {
              setAcceptedBooking(booking);
            } else {
              const messageBuilder = statusMessages[currentStatus];

              if (messageBuilder) {
                showToast(
                  messageBuilder(booking),
                  currentStatus === "completed" ? "success" : "info"
                );
              }
            }

            if (currentStatus === "completed") {
              onCompletedBooking?.(booking);
            }
          }

          previousStatuses.current[booking._id] = currentStatus;
        });
      } catch {
        // Ignore polling errors silently.
      }
    };

    pollBookings();
    const intervalId = window.setInterval(pollBookings, 10000);

    return () => window.clearInterval(intervalId);
  }, [isAuthenticated, onCompletedBooking, showToast]);

  const servicemanName = acceptedBooking?.serviceman?.name || "Your serviceman";
  const servicemanPhone = acceptedBooking?.serviceman?.phone || "Not available";
  const serviceName = formatService(acceptedBooking?.serviceType);

  return (
    <NotificationModal
      message={`${servicemanName} has accepted your ${serviceName} booking. Contact: ${servicemanPhone}`}
      onClose={() => setAcceptedBooking(null)}
      open={Boolean(acceptedBooking)}
      title="Serviceman Accepted Your Work"
    />
  );
}
