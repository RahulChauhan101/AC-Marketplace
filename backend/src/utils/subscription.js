const { FREE_SERVICE_LIMIT } = require("../constants/subscription");

const hasActiveSubscription = (user) => {
  const expiresAt = user?.subscription?.subscriptionExpiresAt;

  return Boolean(expiresAt && new Date(expiresAt) > new Date());
};

const getFreeServicesUsed = (user) => user?.subscription?.freeServicesUsed || 0;

const canAcceptMoreServices = (user) => {
  if (hasActiveSubscription(user)) {
    return true;
  }

  return getFreeServicesUsed(user) < FREE_SERVICE_LIMIT;
};

const getSubscriptionSummary = (user) => {
  const freeServicesUsed = getFreeServicesUsed(user);
  const active = hasActiveSubscription(user);

  return {
    freeServiceLimit: FREE_SERVICE_LIMIT,
    freeServicesUsed,
    freeServicesRemaining: active ? "unlimited" : Math.max(FREE_SERVICE_LIMIT - freeServicesUsed, 0),
    hasActiveSubscription: active,
    subscriptionExpiresAt: user?.subscription?.subscriptionExpiresAt || null,
    subscriptionPaidAt: user?.subscription?.subscriptionPaidAt || null,
    requiresPayment: !active && freeServicesUsed >= FREE_SERVICE_LIMIT,
    subscriptionAmount: 99,
    subscriptionDurationLabel: "1 year unlimited services",
  };
};

module.exports = {
  canAcceptMoreServices,
  getSubscriptionSummary,
  hasActiveSubscription,
};
