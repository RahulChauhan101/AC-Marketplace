import { getServiceLabel, getServiceLogo } from "./serviceTypes";

export const formatDate = (value) => {
  if (!value) {
    return "Not scheduled";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

export const formatService = (value) => {
  if (!value) {
    return "Service";
  }

  return `${getServiceLogo(value)} ${getServiceLabel(value)}`;
};
