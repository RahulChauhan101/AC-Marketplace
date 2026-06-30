import { getServiceLabel, getServiceLogo } from "../services/serviceTypes";

export const formatService = (value) => {
  if (!value) {
    return "service";
  }

  return `${getServiceLogo(value)} ${getServiceLabel(value)}`;
};
