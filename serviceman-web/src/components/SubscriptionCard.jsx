import { useState } from "react";

import api from "../services/api";
const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

export default function SubscriptionCard({ onUpdated, subscription, user }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const paySubscription = async () => {
    setLoading(true);
    setError("");

    try {
      const scriptLoaded = await loadRazorpayScript();

      if (!scriptLoaded) {
        setError("Unable to load Razorpay checkout.");
        return;
      }

      const { data } = await api.post("/serviceman/subscription/order");
      const { keyId, order } = data.data;

      const checkout = new window.Razorpay({
        key: keyId,
        amount: order.amount,
        currency: order.currency,
        name: "ServiceWale",
        description: "1 year unlimited serviceman subscription",
        order_id: order.id,
        prefill: {
          name: user?.name,
          email: user?.email,
          contact: user?.phone,
        },
        handler: async (response) => {
          try {
            await api.post("/serviceman/subscription/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            await onUpdated?.();
          } catch (requestError) {
            setError(requestError.response?.data?.message || "Payment verification failed.");
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
        theme: {
          color: "#f97316",
        },
      });

      checkout.open();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to start subscription payment.");
      setLoading(false);
    }
  };

  if (!subscription) {
    return (
      <section className="card subscription-card">
        <p className="label">ServiceWale Subscription</p>
        <p className="muted">Loading subscription details...</p>
      </section>
    );
  }

  return (
    <section className="card subscription-card">
      <p className="label">ServiceWale Subscription</p>
      <p className="highlight">First 3 services free</p>
      <p className="muted">
        After 3 services, pay Rs 99 once for 1 year unlimited services. No extra charge.
      </p>
      <p className="review-rating">
        Used: {subscription.freeServicesUsed}/{subscription.freeServiceLimit} free services
      </p>

      {subscription.hasActiveSubscription ? (
        <p className="success inline-success">
          Unlimited plan active until{" "}
          {subscription.subscriptionExpiresAt
            ? new Date(subscription.subscriptionExpiresAt).toLocaleDateString("en-IN")
            : "1 year"}
        </p>
      ) : (
        <>
          {!subscription.requiresPayment ? (
            <p className="muted">{subscription.freeServicesRemaining} free service(s) remaining</p>
          ) : (
            <p className="id-proof-error inline-error">Free limit reached. Pay to accept more work.</p>
          )}
          <button className="btn orange subscription-pay-btn" disabled={loading} onClick={paySubscription} type="button">
            {loading ? "Opening payment..." : "Pay Rs 99 / 1 Year (Unlimited)"}
          </button>
        </>
      )}

      {error ? <p className="error inline-error">{error}</p> : null}
    </section>
  );
}
