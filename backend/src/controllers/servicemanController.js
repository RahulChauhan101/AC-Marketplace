const Review = require("../models/Review");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const { AppError } = require("../middleware/errorMiddleware");

const getServicemen = asyncHandler(async (req, res) => {
  const city = req.query.city?.trim();
  const pincode = req.query.pincode?.trim();
  const filters = {
    role: "serviceman",
    isActive: true,
    isAvailable: true,
  };

  if (city && pincode) {
    filters.$or = [
      { "serviceArea.pincodes": pincode },
      { "serviceArea.city": new RegExp(city, "i") },
    ];
  } else if (pincode) {
    filters["serviceArea.pincodes"] = pincode;
  } else if (city) {
    filters["serviceArea.city"] = new RegExp(city, "i");
  }

  if (req.query.serviceType) {
    filters.serviceCategories = req.query.serviceType;
  }

  const servicemen = await User.find(filters).sort({ createdAt: -1 }).lean();
  const normalizedCity = city?.toLowerCase();

  const sortedServicemen = servicemen
    .map((serviceman) => {
      const coversPincode = Boolean(
        pincode && serviceman.serviceArea?.pincodes?.includes(pincode)
      );
      const matchesCity = Boolean(
        normalizedCity &&
          serviceman.serviceArea?.city?.toLowerCase().includes(normalizedCity)
      );

      return {
        ...serviceman,
        nearbyMatch: coversPincode ? "pincode" : matchesCity ? "city" : "available",
        nearbyRank: coversPincode ? 0 : matchesCity ? 1 : 2,
      };
    })
    .sort((a, b) => a.nearbyRank - b.nearbyRank);

  res.json({
    success: true,
    count: sortedServicemen.length,
    data: {
      servicemen: sortedServicemen,
    },
  });
});

const getServicemanById = asyncHandler(async (req, res) => {
  const serviceman = await User.findOne({
    _id: req.params.id,
    role: "serviceman",
    isActive: true,
  });

  if (!serviceman) {
    throw new AppError("Serviceman not found", 404);
  }

  const ratingStats = await Review.aggregate([
    { $match: { serviceman: serviceman._id } },
    {
      $group: {
        _id: "$serviceman",
        averageRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  res.json({
    success: true,
    data: {
      serviceman,
      rating: {
        average: Number((ratingStats[0]?.averageRating || 0).toFixed(1)),
        total: ratingStats[0]?.totalReviews || 0,
      },
    },
  });
});

module.exports = {
  getServicemen,
  getServicemanById,
};
