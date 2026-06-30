import { useEffect, useRef, useState } from "react";

import ConfirmModal from "./ConfirmModal";
import { useToast } from "./Toast";
import api from "../services/api";
import { formatService } from "../utils/formatters";

export default function NewJobWatcher({ onViewJobs }) {
  const { showToast } = useToast();
  const knownJobIds = useRef(new Set());
  const initialized = useRef(false);
  const [popupJob, setPopupJob] = useState(null);

  useEffect(() => {
    const pollJobs = async () => {
      try {
        const { data } = await api.get("/bookings/available");
        const bookings = data.data || [];

        if (!initialized.current) {
          bookings.forEach((booking) => knownJobIds.current.add(booking._id));
          initialized.current = true;
          return;
        }

        const newJobs = bookings.filter((booking) => !knownJobIds.current.has(booking._id));

        if (newJobs.length > 0) {
          const latestJob = newJobs[0];
          knownJobIds.current.add(latestJob._id);
          showToast(`New job: ${formatService(latestJob.serviceType)}`, "info");
          setPopupJob(latestJob);
        }

        bookings.forEach((booking) => knownJobIds.current.add(booking._id));
      } catch {
        // Ignore polling errors silently.
      }
    };

    pollJobs();
    const intervalId = window.setInterval(pollJobs, 20000);

    return () => window.clearInterval(intervalId);
  }, [showToast]);

  return (
    <ConfirmModal
      cancelLabel="Later"
      confirmLabel="View Jobs"
      message={
        popupJob
          ? `New ${formatService(popupJob.serviceType)} request in ${popupJob.address?.city || "your area"}. Accept this work now?`
          : ""
      }
      onCancel={() => setPopupJob(null)}
      onConfirm={() => {
        setPopupJob(null);
        onViewJobs?.();
      }}
      open={Boolean(popupJob)}
      title="New Job Available"
    />
  );
}
