import { useEffect, useState } from "react";

import api from "../services/api";
import { formatService } from "../utils/formatters";

const formatDate = (value) =>
  value
    ? new Intl.DateTimeFormat("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(value))
    : "Not available";

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadReviews = async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await api.get("/admin/reviews");
      setReviews(data.data.reviews || []);
      setAverageRating(data.data.averageRating || 0);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load reviews.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const deleteReview = async (reviewId) => {
    if (!window.confirm("Delete this review?")) {
      return;
    }

    try {
      await api.delete(`/reviews/${reviewId}`);
      await loadReviews();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete review.");
    }
  };

  return (
    <section>
      <div className="page-header">
        <div>
          <h2 className="page-title">Ratings & Reviews</h2>
          <p className="muted">Customer ratings for servicemen across ServiceWale.</p>
        </div>
        <button className="btn secondary" onClick={loadReviews} type="button">
          Refresh
        </button>
      </div>

      {error && <div className="error">{error}</div>}
      {loading && <div className="card">Loading reviews...</div>}

      {!loading && (
        <>
          <div className="grid stats-grid">
            <article className="card">
              <span className="muted">Total Reviews</span>
              <p className="stat-value">{reviews.length}</p>
            </article>
            <article className="card">
              <span className="muted">Average Rating</span>
              <p className="stat-value">{averageRating}/5</p>
            </article>
          </div>

          <div className="card table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Rating</th>
                  <th>Customer</th>
                  <th>Serviceman</th>
                  <th>Service</th>
                  <th>Comment</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reviews.length === 0 ? (
                  <tr>
                    <td colSpan={7}>No reviews yet.</td>
                  </tr>
                ) : (
                  reviews.map((review) => (
                    <tr key={review._id}>
                      <td>
                        <span className="badge">{review.rating}/5</span>
                      </td>
                      <td>
                        <strong>{review.customer?.name || "Customer"}</strong>
                        <br />
                        <span className="muted">{review.customer?.email || ""}</span>
                      </td>
                      <td>
                        <strong>{review.serviceman?.name || "Serviceman"}</strong>
                        <br />
                        <span className="muted">{review.serviceman?.phone || ""}</span>
                      </td>
                      <td>{formatService(review.booking?.serviceType)}</td>
                      <td>{review.comment || "No comment"}</td>
                      <td>{formatDate(review.createdAt)}</td>
                      <td>
                        <button
                          className="btn danger"
                          onClick={() => deleteReview(review._id)}
                          type="button"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}
