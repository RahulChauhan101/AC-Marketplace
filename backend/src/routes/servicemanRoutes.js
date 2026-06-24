const express = require("express");
const {
  getServicemanById,
  getServicemen,
} = require("../controllers/servicemanController");

const router = express.Router();

router.get("/", getServicemen);
router.get("/:id", getServicemanById);

module.exports = router;
