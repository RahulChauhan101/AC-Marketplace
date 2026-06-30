const express = require("express");

const { uploadProfileDocuments } = require("../controllers/servicemanProfileController");
const {
  createSubscriptionOrder,
  getSubscriptionStatus,
  verifySubscriptionPayment,
} = require("../controllers/subscriptionController");
const { authorize, protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect, authorize("serviceman"));

router.get("/subscription/status", getSubscriptionStatus);
router.post("/subscription/order", createSubscriptionOrder);
router.post("/subscription/verify", verifySubscriptionPayment);
router.post("/profile/documents", uploadProfileDocuments);

module.exports = router;
