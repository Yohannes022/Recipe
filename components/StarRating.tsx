import typography from "@/constants/typography";
import { Star } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: number;
  editable?: boolean;
  onRatingChange?: (rating: number) => void;
  showLabel?: boolean;
  style?: any;
}

export default function StarRating({
  rating,
  maxRating = 5,
  size = 20,
  editable = false,
  onRatingChange,
  showLabel = false,
  style,
}: StarRatingProps) {
  const handlePress = (selectedRating: number) => {
    if (editable && onRatingChange) {
      onRatingChange(selectedRating);
    }
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.starsContainer}>
        {[...Array(maxRating)].map((_, index) => {
          const starValue = index + 1;
          const filled = starValue <= rating;
          
          return (
            <TouchableOpacity
              key={index}
              onPress={() => handlePress(starValue)}
              disabled={!editable}
              style={styles.starButton}
            >
              <Star
                size={size}
                color={"#FFCC00"}
                fill={filled ? "#FFCC00" : "none"}
              />
            </TouchableOpacity>
          );
        })}
      </View>
      
      {showLabel && (
        <Text style={styles.ratingText}>
          {rating.toFixed(1)}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  starsContainer: {
    flexDirection: "row",
  },
  starButton: {
    padding: 2,
  },
  ratingText: {
    ...typography.bodySmall,
    marginLeft: 8,
    fontWeight: "600",
  },
});