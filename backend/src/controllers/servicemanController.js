const Review = require("../models/Review");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const { AppError } = require("../middleware/errorMiddleware");

const getServicemen = asyncHandler(async (req, res) => {
  const filters = {
    role: "serviceman",
    isActive: true,
    isAvailable: true,
  };

  if (req.query.city) {
    filters["serviceArea.city"] = new RegExp(req.query.city, "i");
  }

  if (req.query.serviceType) {
    filters.serviceCategories = req.query.serviceType;
  }

  const servicemen = await User.find(filters).sort({ createdAt: -1 });

  res.json({
    success: true,
    count: servicemen.length,
    data: {
      servicemen,
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
