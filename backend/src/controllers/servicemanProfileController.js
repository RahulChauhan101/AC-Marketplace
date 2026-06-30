const fs = require("fs");
const path = require("path");

const multer = require("multer");

const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const { sanitizeUser } = require("../utils/userSerializer");
const { AppError } = require("../middleware/errorMiddleware");

const uploadsRoot = path.join(__dirname, "..", "..", "uploads", "servicemen");

const ensureDirectory = (directoryPath) => {
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }
};

ensureDirectory(uploadsRoot);

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const userDirectory = path.join(uploadsRoot, req.user._id.toString());
    ensureDirectory(userDirectory);
    callback(null, userDirectory);
  },
  filename: (req, file, callback) => {
    const extension = path.extname(file.originalname || "").toLowerCase() || ".jpg";
    callback(null, `${file.fieldname}-${Date.now()}${extension}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, callback) => {
    if (!file.mimetype.startsWith("image/")) {
      callback(new AppError("Only image files are allowed", 400));
      return;
    }

    callback(null, true);
  },
});

const buildPublicPath = (req, fileName) =>
  `/uploads/servicemen/${req.user._id.toString()}/${fileName}`;

const hasIdProof = (number, imagePath) => Boolean(String(number || "").trim() || imagePath);

const applyIdProofUpdates = (user, idProofUpdates) => {
  Object.entries(idProofUpdates).forEach(([key, value]) => {
    user.set(`idProof.${key}`, value);
  });
  user.markModified("idProof");
};

const uploadProfileDocuments = [
  upload.fields([
    { name: "profilePhoto", maxCount: 1 },
    { name: "aadharImage", maxCount: 1 },
    { name: "drivingLicenseImage", maxCount: 1 },
    { name: "voterIdImage", maxCount: 1 },
    { name: "experienceCertificateImage", maxCount: 1 },
    { name: "serviceImages", maxCount: 6 },
  ]),
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const idProofUpdates = {
      ...(user.idProof?.toObject?.() || user.idProof || {}),
    };

    if (req.body.experienceYears !== undefined) {
      user.experienceYears = Number(req.body.experienceYears) || 0;
    }

    if (req.body.aadharNumber !== undefined) {
      idProofUpdates.aadharNumber = String(req.body.aadharNumber).trim();
    }

    if (req.body.drivingLicenseNumber !== undefined) {
      idProofUpdates.drivingLicenseNumber = String(req.body.drivingLicenseNumber).trim();
    }

    if (req.body.voterIdNumber !== undefined) {
      idProofUpdates.voterIdNumber = String(req.body.voterIdNumber).trim();
    }

    const fileMap = {
      profilePhoto: "profilePhoto",
      aadharImage: "aadharImage",
      drivingLicenseImage: "drivingLicenseImage",
      voterIdImage: "voterIdImage",
      experienceCertificateImage: "experienceCertificateImage",
    };

    Object.entries(fileMap).forEach(([fieldName, targetKey]) => {
      const uploadedFile = req.files?.[fieldName]?.[0];

      if (!uploadedFile) {
        return;
      }

      const publicPath = buildPublicPath(req, uploadedFile.filename);

      if (targetKey === "profilePhoto") {
        user.profilePhoto = publicPath;
        return;
      }

      idProofUpdates[targetKey] = publicPath;
    });

    if (req.files?.serviceImages?.length) {
      const existingImages = user.serviceImages || [];
      const uploadedImages = req.files.serviceImages.map((file) => buildPublicPath(req, file.filename));
      user.serviceImages = [...existingImages, ...uploadedImages].slice(-6);
      user.markModified("serviceImages");
    }

    const hasAnyIdProof =
      hasIdProof(idProofUpdates.aadharNumber, idProofUpdates.aadharImage) ||
      hasIdProof(idProofUpdates.drivingLicenseNumber, idProofUpdates.drivingLicenseImage) ||
      hasIdProof(idProofUpdates.voterIdNumber, idProofUpdates.voterIdImage);

    if (!hasAnyIdProof) {
      throw new AppError(
        "At least one ID proof is required: Aadhar card, Driving license, or Election card.",
        400
      );
    }

    applyIdProofUpdates(user, idProofUpdates);

    await user.save();

    const savedUser = await User.findById(user._id);

    res.json({
      success: true,
      data: {
        user: sanitizeUser(savedUser),
      },
    });
  }),
];

module.exports = {
  uploadProfileDocuments,
};
