import { useEffect, useMemo, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

import api from "../services/api";
import Button from "../components/Button";
import Input from "../components/Input";
import Screen from "../components/Screen";
import SectionHeader from "../components/SectionHeader";
import { colors } from "../utils/colors";

export default function ReviewsScreen() {
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [selectedBookingId, setSelectedBookingId] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const completedBookings = useMemo(
    () => bookings.filter((booking) => booking.status === "completed" && booking.serviceman),
    [bookings]
  );

  const loadData = async () => {
    setLoading(true);
    try {
      const [bookingResponse, reviewResponse] = await Promise.all([
        api.get("/bookings"),
        api.get("/reviews/me"),
      ]);
      const loadedBookings = bookingResponse.data.data.bookings;
      const reviewableBookings = loadedBookings.filter(
        (booking) => booking.status === "completed" && booking.serviceman
      );

      setBookings(loadedBookings);
      setReviews(reviewResponse.data.data.reviews);
      setSelectedBookingId((current) => current || reviewableBookings[0]?._id || "");
    } catch (error) {
      Alert.alert("Unable to load reviews", error.response?.data?.message || "Try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submitReview = async () => {
    if (!selectedBookingId) {
      Alert.alert("No booking selected", "Select a completed booking to review.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/reviews", {
        bookingId: selectedBookingId,
        rating,
        comment,
      });
      setComment("");
      Alert.alert("Review submitted", "Thanks for rating your serviceman.");
      loadData();
    } catch (error) {
      Alert.alert("Review failed", error.response?.data?.message || "Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <SectionHeader
        eyebrow="Reviews"
        title="Rate completed AC services."
        description="Reviews help other customers choose trusted servicemen."
      />

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Select completed booking</Text>
        <View style={styles.chips}>
          {completedBookings.map((booking) => (
            <Pressable
              key={booking._id}
              onPress={() => setSelectedBookingId(booking._id)}
              style={[
                styles.chip,
                selectedBookingId === booking._id && styles.chipActive,
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  selectedBookingId === booking._id && styles.chipTextActive,
                ]}
              >
                {booking.serviceType}
              </Text>
            </Pressable>
          ))}
        </View>

        {completedBookings.length === 0 ? (
          <Text style={styles.meta}>No completed bookings are ready for review.</Text>
        ) : (
          <>
            <Text style={styles.label}>Rating</Text>
            <View style={styles.chips}>
              {[1, 2, 3, 4, 5].map((value) => (
                <Pressable
                  key={value}
                  onPress={() => setRating(value)}
                  style={[styles.ratingChip, rating === value && styles.chipActive]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      rating === value && styles.chipTextActive,
                    ]}
                  >
                    {value}
                  </Text>
                </Pressable>
              ))}
            </View>
            <Input
              label="Review"
              multiline
              value={comment}
              onChangeText={setComment}
              placeholder="Share service quality, punctuality and experience."
            />
            <Button title="Submit review" loading={loading} onPress={submitReview} style={styles.button} />
          </>
        )}
      </View>

      <Text style={styles.sectionTitle}>Your reviews</Text>
      {reviews.map((review) => (
        <View key={review._id} style={styles.reviewCard}>
          <Text style={styles.reviewTitle}>
            {review.rating}/5 for {review.serviceman?.name || "Serviceman"}
          </Text>
          <Text style={styles.meta}>{review.comment || "No comment added."}</Text>
        </View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 22,
    padding: 16,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 12,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 14,
  },
  chip: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  ratingChip: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "900",
  },
  chipTextActive: {
    color: "#FFFFFF",
  },
  label: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "900",
    marginBottom: 8,
  },
  button: {
    marginTop: 14,
  },
  meta: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 20,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 12,
  },
  reviewCard: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 12,
    padding: 14,
  },
  reviewTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "900",
    marginBottom: 6,
  },
});
