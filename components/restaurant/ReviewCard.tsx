/**
 * Review card component for displaying restaurant reviews
 */

import typography from "@/constants/typography";
import { Review } from "@/types/restaurant";
import { Image } from "expo-image";
import { Star, ThumbsUp } from "lucide-react-native";
import React from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface ReviewCardProps {
  review: Review;
  onLike?: () => void;
}

export default function ReviewCard({
  review,
  onLike,
}: ReviewCardProps) {
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image
            source={{ uri: review.userAvatar || "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=200" }}
            style={styles.avatar}
            contentFit="cover"
          />
          <View>
            <Text style={styles.userName}>{review.userName}</Text>
            <Text style={styles.date}>{formatDate(review.createdAt)}</Text>
          </View>
        </View>
        
        <View style={styles.ratingContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={16}
              color={"#8E8E8E"}
              fill={star <= review.rating ? "#8E8E8E" : "none"}
            />
          ))}
        </View>
      </View>
      
      {review.comment && (
        <Text style={styles.comment}>{review.comment}</Text>
      )}
      
      {review.images && review.images.length > 0 && (
        <View style={styles.imagesContainer}>
          {review.images.map((image, index) => (
            <Image
              key={index}
              source={{ uri: image }}
              style={styles.reviewImage}
              contentFit="cover"
            />
          ))}
        </View>
      )}
      
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.likeButton}
          onPress={onLike}
        >
          <ThumbsUp size={16} color={"#8E8E8E"} />
          <Text style={styles.likeCount}>{review.likes}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userName: {
    ...typography.bodySmall,
    fontWeight: "600",
  },
  date: {
    ...typography.caption,
    color: "#8E8E8E",
  },
  ratingContainer: {
    flexDirection: "row",
  },
  comment: {
    ...typography.body,
    marginBottom: 12,
  },
  imagesContainer: {
    flexDirection: "row",
    marginBottom: 12,
  },
  reviewImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  likeButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
  },
  likeCount: {
    ...typography.caption,
    marginLeft: 4,
  },
});