export const formatBookingStatus = (status) => {
  const labels = {
    pending: "Pending",
    confirmed: "Accepted",
    in_progress: "In Progress",
    completed: "Completed",
    cancelled: "Cancelled",
  };

  return labels[status] || status?.replace("_", " ") || "Unknown";
};

export const getServicemanDetails = (booking) => {
  const serviceman = booking?.serviceman;

  if (!serviceman) {
    return null;
  }

  if (typeof serviceman === "object") {
    return {
      name: serviceman.name || "Serviceman",
      phone: serviceman.phone || "Not available",
    };
  }

  return {
    name: "Serviceman assigned",
    phone: "Not available",
  };
};

export const shouldShowServicemanContact = (booking) => {
  if (!booking || booking.status === "cancelled") {
    return false;
  }

  if (getServicemanDetails(booking)) {
    return true;
  }

  return ["confirmed", "in_progress", "completed"].includes(booking.status);
};

export const getServicemanCardTitle = (status) => {
  if (status === "pending") {
    return "Assigned Serviceman";
  }

  if (status === "confirmed") {
    return "Work Accepted";
  }

  return "Serviceman Details";
};
