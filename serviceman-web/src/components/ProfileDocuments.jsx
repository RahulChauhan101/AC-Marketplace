import { useEffect, useRef, useState } from "react";

import { useAuth } from "../context/AuthContext";
import { getAssetUrl } from "../utils/assets";
import api from "../services/api";

const ID_PROOF_OPTIONS = [
  { value: "aadhar", label: "Aadhar Card" },
  { value: "driving", label: "Driving License" },
  { value: "voter", label: "Election Card" },
];

const detectIdProofType = (user) => {
  if (user?.idProof?.aadharNumber || user?.idProof?.aadharImage) {
    return "aadhar";
  }

  if (user?.idProof?.drivingLicenseNumber || user?.idProof?.drivingLicenseImage) {
    return "driving";
  }

  if (user?.idProof?.voterIdNumber || user?.idProof?.voterIdImage) {
    return "voter";
  }

  return "";
};

const hasIdProofValue = (number, imagePath, file) =>
  Boolean(String(number || "").trim() || imagePath || file);

const revokeBlobUrl = (url) => {
  if (url?.startsWith("blob:")) {
    URL.revokeObjectURL(url);
  }
};

export default function ProfileDocuments({ imageVersion, onImageUpdated, onProfilePhotoPreview, profileInputRef, user }) {
  const { applyUserUpdate } = useAuth();
  const localProfileInputRef = useRef(null);
  const photoInputRef = profileInputRef || localProfileInputRef;
  const idProofImageRef = useRef(null);
  const experienceInputRef = useRef(null);
  const serviceImagesInputRef = useRef(null);
  const blobUrlsRef = useRef([]);
  const [form, setForm] = useState({
    aadharNumber: user?.idProof?.aadharNumber || "",
    drivingLicenseNumber: user?.idProof?.drivingLicenseNumber || "",
    voterIdNumber: user?.idProof?.voterIdNumber || "",
    experienceYears: user?.experienceYears || 0,
  });
  const [idProofType, setIdProofType] = useState(() => detectIdProofType(user));
  const [files, setFiles] = useState({});
  const [previews, setPreviews] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [idProofError, setIdProofError] = useState("");

  useEffect(() => {
    setForm({
      aadharNumber: user?.idProof?.aadharNumber || "",
      drivingLicenseNumber: user?.idProof?.drivingLicenseNumber || "",
      voterIdNumber: user?.idProof?.voterIdNumber || "",
      experienceYears: user?.experienceYears || 0,
    });
    setIdProofType(detectIdProofType(user));
  }, [user]);

  useEffect(
    () => () => {
      blobUrlsRef.current.forEach(revokeBlobUrl);
      blobUrlsRef.current = [];
    },
    []
  );

  const trackBlobUrl = (url) => {
    if (url?.startsWith("blob:")) {
      blobUrlsRef.current.push(url);
    }
    return url;
  };

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    if (idProofError) {
      setIdProofError("");
    }
  };

  const updateFile = (field, fileList) => {
    const file = fileList?.[0] || null;
    setFiles((current) => ({ ...current, [field]: file }));

    const previewUrl = file ? trackBlobUrl(URL.createObjectURL(file)) : "";

    setPreviews((current) => {
      revokeBlobUrl(current[field]);
      return { ...current, [field]: previewUrl };
    });

    if (field === "profilePhoto") {
      onProfilePhotoPreview?.(previewUrl);
    }

    if (idProofError) {
      setIdProofError("");
    }
  };

  const updateServiceImages = (fileList) => {
    const selectedFiles = Array.from(fileList || []);
    setFiles((current) => ({ ...current, serviceImages: selectedFiles }));

    setPreviews((current) => {
      (current.serviceImages || []).forEach(revokeBlobUrl);
      return {
        ...current,
        serviceImages: selectedFiles.map((file) => trackBlobUrl(URL.createObjectURL(file))),
      };
    });
  };

  const clearLocalPreviews = () => {
    blobUrlsRef.current.forEach(revokeBlobUrl);
    blobUrlsRef.current = [];
    setPreviews({});
    setFiles({});
  };

  const validateIdProof = () => {
    if (!idProofType) {
      return "Please select an ID proof type from the dropdown.";
    }

    if (idProofType === "aadhar") {
      if (!hasIdProofValue(form.aadharNumber, user?.idProof?.aadharImage, files.aadharImage)) {
        return "Aadhar card number or image is required.";
      }
    }

    if (idProofType === "driving") {
      if (
        !hasIdProofValue(
          form.drivingLicenseNumber,
          user?.idProof?.drivingLicenseImage,
          files.drivingLicenseImage
        )
      ) {
        return "Driving license number or image is required.";
      }
    }

    if (idProofType === "voter") {
      if (!hasIdProofValue(form.voterIdNumber, user?.idProof?.voterIdImage, files.voterIdImage)) {
        return "Election card number or image is required.";
      }
    }

    return "";
  };

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");
    setIdProofError("");

    const proofError = validateIdProof();

    if (proofError) {
      setIdProofError(proofError);
      setLoading(false);
      return;
    }

    try {
      const payload = new FormData();
      payload.append("experienceYears", form.experienceYears);
      payload.append("aadharNumber", form.aadharNumber);
      payload.append("drivingLicenseNumber", form.drivingLicenseNumber);
      payload.append("voterIdNumber", form.voterIdNumber);

      let fileCount = 0;

      Object.entries(files).forEach(([field, file]) => {
        if (!file) {
          return;
        }

        if (field === "serviceImages") {
          file.forEach((serviceImage) => {
            payload.append("serviceImages", serviceImage);
            fileCount += 1;
          });
          return;
        }

        payload.append(field, file);
        fileCount += 1;
      });

      const { data } = await api.post("/serviceman/profile/documents", payload);
      applyUserUpdate(data.data.user);
      onImageUpdated?.();
      onProfilePhotoPreview?.("");
      clearLocalPreviews();
      setMessage(
        fileCount > 0
          ? "Profile documents and images updated successfully."
          : "Profile details saved. Upload images and save again to store photos in database."
      );
    } catch (requestError) {
      const responseMessage =
        requestError.response?.data?.message || "Unable to update profile documents.";

      if (responseMessage.toLowerCase().includes("id proof")) {
        setIdProofError(responseMessage);
      } else {
        setError(responseMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const profilePreview =
    previews.profilePhoto ||
    (user?.profilePhoto ? getAssetUrl(user.profilePhoto, imageVersion) : "");

  const getSavedImagePreview = (savedPath, fileKey) => {
    if (previews[fileKey]) {
      return previews[fileKey];
    }

    if (savedPath) {
      return getAssetUrl(savedPath, imageVersion);
    }

    return "";
  };

  const handleIdProofImageChange = (event) => {
    if (idProofType === "aadhar") {
      updateFile("aadharImage", event.target.files);
    } else if (idProofType === "driving") {
      updateFile("drivingLicenseImage", event.target.files);
    } else if (idProofType === "voter") {
      updateFile("voterIdImage", event.target.files);
    }

    event.target.value = "";
  };

  const renderIdProofFields = () => {
    if (idProofType === "aadhar") {
      return (
        <>
          <input
            className="input"
            onChange={(event) => updateField("aadharNumber", event.target.value)}
            placeholder="Aadhar card number"
            value={form.aadharNumber}
          />
          <button
            className="btn secondary upload-btn"
            onClick={() => idProofImageRef.current?.click()}
            type="button"
          >
            {files.aadharImage || user?.idProof?.aadharImage ? "Change Aadhar Image" : "Upload Aadhar Image"}
          </button>
          {getSavedImagePreview(user?.idProof?.aadharImage, "aadharImage") ? (
            <img
              alt="Aadhar preview"
              className="profile-preview"
              src={getSavedImagePreview(user?.idProof?.aadharImage, "aadharImage")}
            />
          ) : null}
        </>
      );
    }

    if (idProofType === "driving") {
      return (
        <>
          <input
            className="input"
            onChange={(event) => updateField("drivingLicenseNumber", event.target.value)}
            placeholder="Driving license number"
            value={form.drivingLicenseNumber}
          />
          <button
            className="btn secondary upload-btn"
            onClick={() => idProofImageRef.current?.click()}
            type="button"
          >
            {files.drivingLicenseImage || user?.idProof?.drivingLicenseImage
              ? "Change License Image"
              : "Upload License Image"}
          </button>
          {getSavedImagePreview(user?.idProof?.drivingLicenseImage, "drivingLicenseImage") ? (
            <img
              alt="Driving license preview"
              className="profile-preview"
              src={getSavedImagePreview(user?.idProof?.drivingLicenseImage, "drivingLicenseImage")}
            />
          ) : null}
        </>
      );
    }

    if (idProofType === "voter") {
      return (
        <>
          <input
            className="input"
            onChange={(event) => updateField("voterIdNumber", event.target.value)}
            placeholder="Election card / voter ID number"
            value={form.voterIdNumber}
          />
          <button
            className="btn secondary upload-btn"
            onClick={() => idProofImageRef.current?.click()}
            type="button"
          >
            {files.voterIdImage || user?.idProof?.voterIdImage
              ? "Change Election Card Image"
              : "Upload Election Card Image"}
          </button>
          {getSavedImagePreview(user?.idProof?.voterIdImage, "voterIdImage") ? (
            <img
              alt="Election card preview"
              className="profile-preview"
              src={getSavedImagePreview(user?.idProof?.voterIdImage, "voterIdImage")}
            />
          ) : null}
        </>
      );
    }

    return null;
  };

  return (
    <section className="card">
      <p className="label">Profile, ID Proof and Service Images</p>
      <p className="muted">
        Tap profile photo to change. Select one ID proof from dropdown (required).
      </p>

      <button
        className="profile-photo-picker"
        onClick={() => photoInputRef.current?.click()}
        type="button"
      >
        {profilePreview ? (
          <img alt="Profile" className="profile-preview large" src={profilePreview} />
        ) : (
          <div className="profile-preview large placeholder">{user?.name?.charAt(0) || "S"}</div>
        )}
        <span className="profile-photo-hint">Tap to change profile photo</span>
      </button>

      <input
        accept="image/*"
        hidden
        onChange={(event) => {
          updateFile("profilePhoto", event.target.files);
          event.target.value = "";
        }}
        ref={photoInputRef}
        type="file"
      />

      <input
        accept="image/*"
        hidden
        onChange={handleIdProofImageChange}
        ref={idProofImageRef}
        type="file"
      />

      <input
        accept="image/*"
        hidden
        onChange={(event) => {
          updateFile("experienceCertificateImage", event.target.files);
          event.target.value = "";
        }}
        ref={experienceInputRef}
        type="file"
      />

      <input
        accept="image/*"
        hidden
        multiple
        onChange={(event) => {
          updateServiceImages(event.target.files);
          event.target.value = "";
        }}
        ref={serviceImagesInputRef}
        type="file"
      />

      <form className="profile-form" onSubmit={submit}>
        <input
          className="input"
          min="0"
          onChange={(event) => updateField("experienceYears", event.target.value)}
          placeholder="Experience (years)"
          type="number"
          value={form.experienceYears}
        />

        <div className={`id-proof-section${idProofError ? " has-error" : ""}`}>
          <p className="section-label">ID Proof (required)</p>
          <select
            className="input"
            onChange={(event) => {
              setIdProofType(event.target.value);
              setIdProofError("");
            }}
            value={idProofType}
          >
            <option value="">Select ID proof type</option>
            {ID_PROOF_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {renderIdProofFields()}

          {idProofError ? <p className="id-proof-error">{idProofError}</p> : null}
        </div>

        <button
          className="btn secondary upload-btn"
          onClick={() => experienceInputRef.current?.click()}
          type="button"
        >
          {files.experienceCertificateImage || user?.idProof?.experienceCertificateImage
            ? "Change Experience Certificate"
            : "Upload Experience Certificate"}
        </button>
        {getSavedImagePreview(user?.idProof?.experienceCertificateImage, "experienceCertificateImage") ? (
          <img
            alt="Experience certificate"
            className="profile-preview"
            src={getSavedImagePreview(
              user?.idProof?.experienceCertificateImage,
              "experienceCertificateImage"
            )}
          />
        ) : null}

        <button
          className="btn secondary upload-btn"
          onClick={() => serviceImagesInputRef.current?.click()}
          type="button"
        >
          Upload Service Images (multiple)
        </button>

        <div className="profile-preview-grid">
          {(previews.serviceImages || []).map((previewUrl, index) => (
            <img alt={`New service ${index + 1}`} className="profile-preview" key={previewUrl} src={previewUrl} />
          ))}
          {(user?.serviceImages || []).map((imagePath, index) => (
            <img
              alt={`Service ${index + 1}`}
              className="profile-preview"
              key={`${imagePath}-${imageVersion}`}
              src={getAssetUrl(imagePath, imageVersion)}
            />
          ))}
        </div>

        <button className="btn orange" disabled={loading} type="submit">
          {loading ? "Saving..." : "Save Profile Documents"}
        </button>
      </form>

      {message ? <p className="success inline-success">{message}</p> : null}
      {error ? <p className="error inline-error">{error}</p> : null}
    </section>
  );
}
