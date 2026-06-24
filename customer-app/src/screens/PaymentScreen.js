import { useEffect, useState } from "react";
import { Alert, RefreshControl, StyleSheet, Text, View } from "react-native";
import { WebView } from "react-native-webview";

import api from "../services/api";
import Button from "../components/Button";
import Screen from "../components/Screen";
import SectionHeader from "../components/SectionHeader";
import { RAZORPAY_THEME_COLOR } from "../utils/env";
import { useAuth } from "../context/AuthContext";
import { colors } from "../utils/colors";

const formatDate = (value) =>
  value
    ? new Intl.DateTimeFormat("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(value))
    : "Not scheduled";

export default function PaymentScreen() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [checkout, setCheckout] = useState(null);
  const [loading, setLoading] = useState(false);
  const [payingId, setPayingId] = useState(null);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/bookings");
      setBookings(data.data.bookings);
    } catch (error) {
      Alert.alert("Unable to load bookings", error.response?.data?.message || "Try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const payForBooking = async (booking) => {
    setPayingId(booking._id);

    try {
      const { data } = await api.post(`/payments/bookings/${booking._id}/order`);
      setCheckout({
        booking,
        keyId: data.data.keyId,
        order: data.data.order,
      });
    } catch (error) {
      Alert.alert(
        "Payment setup failed",
        error.response?.data?.message || "Unable to create payment order."
      );
    } finally {
      setPayingId(null);
    }
  };

  const verifyCheckoutMessage = async (event) => {
    const payload = JSON.parse(event.nativeEvent.data);

    if (payload.status === "cancelled") {
      setCheckout(null);
      return;
    }

    try {
      await api.post("/payments/razorpay/verify", {
        razorpay_order_id: payload.razorpay_order_id,
        razorpay_payment_id: payload.razorpay_payment_id,
        razorpay_signature: payload.razorpay_signature,
      });

      Alert.alert("Payment successful", "Your payment has been verified.");
      setCheckout(null);
      loadBookings();
    } catch (error) {
      Alert.alert("Payment failed", error.response?.data?.message || "Unable to verify payment.");
    }
  };

  if (checkout) {
    return (
      <Screen scroll={false}>
        <SectionHeader
          eyebrow="Razorpay"
          title="Complete secure payment."
          description="Do not close this screen until Razorpay confirms the payment."
        />
        <View style={styles.webViewWrap}>
          <WebView
            originWhitelist={["*"]}
            source={{
              html: getCheckoutHtml({
                checkout,
                user,
              }),
            }}
            onMessage={verifyCheckoutMessage}
          />
        </View>
        <Button
          title="Cancel payment"
          variant="secondary"
          onPress={() => setCheckout(null)}
          style={styles.button}
        />
      </Screen>
    );
  }

  return (
    <Screen
      refreshControl={<RefreshControl refreshing={loading} onRefresh={loadBookings} />}
    >
      <SectionHeader
        eyebrow="Payments"
        title="Pay for assigned bookings."
        description="Once an admin assigns pricing, complete payment securely with Razorpay."
      />

      <View style={styles.list}>
        {bookings.map((booking) => {
          const canPay =
            booking.paymentStatus !== "paid" && Number(booking.pricing?.totalAmount) > 0;

          return (
            <View key={booking._id} style={styles.card}>
              <View style={styles.row}>
                <View style={styles.flex}>
                  <Text style={styles.title}>{booking.serviceType?.replace("-", " ")}</Text>
                  <Text style={styles.meta}>{formatDate(booking.scheduledAt)}</Text>
                  <Text style={styles.meta}>
                    Status: {booking.status} - Payment: {booking.paymentStatus}
                  </Text>
                </View>
                <Text style={styles.amount}>₹{booking.pricing?.totalAmount || 0}</Text>
              </View>

              <Text style={styles.address}>
                {booking.address?.street}, {booking.address?.city}
              </Text>

              {canPay ? (
                <Button
                  title="Pay with Razorpay"
                  loading={payingId === booking._id}
                  onPress={() => payForBooking(booking)}
                  style={styles.button}
                />
              ) : (
                <Text style={styles.note}>
                  {booking.paymentStatus === "paid"
                    ? "Payment completed"
                    : "Waiting for pricing assignment"}
                </Text>
              )}
            </View>
          );
        })}
      </View>

      {!loading && bookings.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>No bookings yet</Text>
          <Text style={styles.meta}>Create a booking first to see payment options.</Text>
        </View>
      ) : null}
    </Screen>
  );
}

const getCheckoutHtml = ({ checkout, user }) => {
  const options = {
    key: checkout.keyId,
    amount: checkout.order.amount,
    currency: checkout.order.currency,
    name: "ACCare Marketplace",
    description: `${checkout.booking.serviceType} service payment`,
    order_id: checkout.order.id,
    prefill: {
      name: user?.name || "",
      email: user?.email || "",
      contact: user?.phone || "",
    },
    theme: {
      color: RAZORPAY_THEME_COLOR,
    },
  };

  return `
    <!doctype html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
      </head>
      <body>
        <script>
          const options = ${JSON.stringify(options)};
          options.handler = function(response) {
            window.ReactNativeWebView.postMessage(JSON.stringify(response));
          };
          options.modal = {
            ondismiss: function() {
              window.ReactNativeWebView.postMessage(JSON.stringify({ status: "cancelled" }));
            }
          };
          const checkout = new Razorpay(options);
          checkout.open();
        </script>
      </body>
    </html>
  `;
};

const styles = StyleSheet.create({
  list: {
    gap: 14,
  },
  card: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  flex: {
    flex: 1,
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900",
    textTransform: "capitalize",
  },
  meta: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 4,
  },
  amount: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: "900",
  },
  address: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "700",
    marginTop: 12,
  },
  button: {
    marginTop: 14,
  },
  note: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "800",
    marginTop: 14,
  },
  empty: {
    alignItems: "center",
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 20,
    borderWidth: 1,
    padding: 24,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "900",
  },
  webViewWrap: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    flex: 1,
    overflow: "hidden",
  },
});
