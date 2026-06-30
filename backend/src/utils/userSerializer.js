const { getSubscriptionSummary } = require("./subscription");

const sanitizeUser = (user) => {
  const base = {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    address: user.address,
    serviceCategories: user.serviceCategories,
    serviceArea: user.serviceArea,
    isAvailable: user.isAvailable,
    isActive: user.isActive,
    createdAt: user.createdAt,
  };

  if (user.role === "serviceman") {
    base.profilePhoto = user.profilePhoto || "";
    base.serviceImages = user.serviceImages || [];
    base.experienceYears = user.experienceYears || 0;
    base.idProof = user.idProof || {};
    base.subscription = getSubscriptionSummary(user);
  }

  return base;
};

module.exports = {
  sanitizeUser,
};
