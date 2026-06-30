import { useEffect, useRef, useState } from "react";

import ProfileDocuments from "../components/ProfileDocuments";
import SubscriptionCard from "../components/SubscriptionCard";
import { useAuth } from "../context/AuthContext";
import { getAssetUrl } from "../utils/assets";
import { formatService } from "../utils/formatters";
import api from "../services/api";

export default function Profile() {
  const { refreshProfile, updateProfile, user } = useAuth();
  const profileInputRef = useRef(null);
  const [error, setError] = useState("");
  const [reviews, setReviews] = useState([]);
  const [imageVersion, setImageVersion] = useState(Date.now());
  const [headerPhotoPreview, setHeaderPhotoPreview] = useState("");

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const { data } = await api.get("/reviews/me");
        setReviews(data.data.reviews || []);
      } catch {
        setReviews([]);
      }
    };

    loadReviews();
  }, []);

  const toggleAvailability = async (event) => {
    setError("");

    try {
      await updateProfile({ isAvailable: event.target.checked });
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Update failed.");
    }
  };

  const averageRating =
    reviews.length === 0
      ? 0
      : (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1);

  return (
    <div className="page-stack">
      <div>
        <h2 className="page-title">Profile</h2>
        <p className="muted">Your serviceman account details from ServiceWale.</p>
      </div>

      {error ? <p className="error">{error}</p> : null}

      <section className="card profile-header-card">
        <button
          className="profile-photo-picker compact"
          onClick={() => profileInputRef.current?.click()}
          type="button"
        >
          {headerPhotoPreview || user?.profilePhoto ? (
            <img
              alt={user.name}
              className="profile-avatar"
              src={
                headerPhotoPreview || getAssetUrl(user.profilePhoto, imageVersion)
              }
            />
          ) : (
            <div className="profile-avatar placeholder">{user?.name?.charAt(0) || "S"}</div>
          )}
          <span className="profile-photo-hint small">Change photo</span>
        </button>
        <div>
          <h3 className="highlight">{user?.name}</h3>
          <p className="muted">{user?.email}</p>
          <p className="muted">{user?.phone || "Phone not set"}</p>
          {user?.experienceYears ? (
            <p className="muted">{user.experienceYears} years experience</p>
          ) : null}
        </div>
      </section>

      <SubscriptionCard onUpdated={refreshProfile} subscription={user?.subscription} user={user} />

      <section className="card row-between">
        <div>
          <p className="label">Availability</p>
          <p className="muted">{user?.isAvailable ? "Available" : "Unavailable"}</p>
        </div>
        <label className="switch">
          <input checked={Boolean(user?.isAvailable)} onChange={toggleAvailability} type="checkbox" />
          <span className="slider" />
        </label>
      </section>

      <section className="card">
        <p className="label">Service Area</p>
        <h3 className="highlight">{user?.serviceArea?.city || "City not set"}</h3>
        <p className="muted">Pincodes: {user?.serviceArea?.pincodes?.join(", ") || "Not listed"}</p>
      </section>

      <section className="card">
        <p className="label">Service Categories</p>
        <div className="chips">
          {(user?.serviceCategories || []).map((category) => (
            <span className="badge" key={category}>
              {formatService(category)}
            </span>
          ))}
        </div>
      </section>

      <ProfileDocuments
        imageVersion={imageVersion}
        onImageUpdated={() => {
          setImageVersion(Date.now());
          setHeaderPhotoPreview("");
        }}
        onProfilePhotoPreview={setHeaderPhotoPreview}
        profileInputRef={profileInputRef}
        user={user}
      />

      <section className="card">
        <p className="label">Customer Ratings</p>
        <p className="review-rating">
          {averageRating}/5 average from {reviews.length} reviews
        </p>
        <div className="review-list">
          {reviews.length === 0 ? (
            <p className="muted">No customer ratings yet.</p>
          ) : (
            reviews.map((review) => (
              <div className="review-item" key={review._id}>
                <p className="review-rating">{review.rating}/5</p>
                <p className="muted">{review.customer?.name || "Customer"}</p>
                <p>{review.comment || "No comment provided."}</p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
