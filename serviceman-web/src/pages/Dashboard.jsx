import { useEffect, useState } from "react";

import BrandLogo from "../components/BrandLogo";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function Dashboard({ onNavigate }) {
  const { logout, refreshProfile, user } = useAuth();
  const [reviews, setReviews] = useState([]);

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

  const averageRating =
    reviews.length === 0
      ? "0.0"
      : (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1);

  return (
    <div className="page-stack">
      <section className="hero-card">
        <BrandLogo className="hero-brand" />
        <h2 className="hero-title">Hi {user?.name?.split(" ")[0] || "Serviceman"}</h2>
        <p className="hero-text">
          {user?.isAvailable ? "You are available for bookings." : "You are currently unavailable."}
        </p>
        <div className="hero-rating">
          <span className="review-rating">{averageRating}/5</span>
          <span className="hero-text">
            {reviews.length} customer rating{reviews.length === 1 ? "" : "s"}
          </span>
        </div>
      </section>

      <section className="card">
        <p className="label">Your Rating Summary</p>
        <p className="review-rating">{averageRating}/5 average rating</p>
        <p className="muted">{reviews.length} reviews from completed services</p>
        {reviews.slice(0, 3).map((review) => (
          <div className="review-item" key={review._id}>
            <p className="review-rating">{review.rating}/5</p>
            <p className="muted">{review.customer?.name || "Customer"}</p>
            <p>{review.comment || "No comment provided."}</p>
          </div>
        ))}
        {reviews.length > 3 ? (
          <button className="auth-link" onClick={() => onNavigate("profile")} type="button">
            View all ratings in Profile
          </button>
        ) : null}
      </section>

      <section className="card">
        <p className="label">Service Area</p>
        <h3 className="highlight">{user?.serviceArea?.city || "City not set"}</h3>
        <p className="muted">
          Pincodes: {user?.serviceArea?.pincodes?.join(", ") || "Not listed"}
        </p>
      </section>

      <div className="grid">
        <button className="action-card" onClick={() => onNavigate("available")} type="button">
          <strong>Available Work</strong>
          <span className="muted">Accept open bookings near your service area.</span>
        </button>
        <button className="action-card" onClick={() => onNavigate("jobs")} type="button">
          <strong>My Work</strong>
          <span className="muted">Start work and mark visits completed.</span>
        </button>
        <button className="action-card" onClick={() => onNavigate("profile")} type="button">
          <strong>Profile & Ratings</strong>
          <span className="muted">View services, availability and customer reviews.</span>
        </button>
      </div>

      <div className="toolbar">
        <button className="btn secondary" onClick={refreshProfile} type="button">
          Refresh Profile
        </button>
        <button className="btn danger" onClick={logout} type="button">
          Logout
        </button>
      </div>
    </div>
  );
}
