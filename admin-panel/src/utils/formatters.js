import { getServiceLabel, getServiceLogo } from "../services/serviceTypes";

export const formatService = (value) => {
  if (!value) {
    return "Service";
  }

  return `${getServiceLogo(value)} ${getServiceLabel(value)}`;
};
