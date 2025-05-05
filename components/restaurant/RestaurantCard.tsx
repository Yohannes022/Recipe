/**
 * Restaurant card component for displaying restaurant information
 * Used in restaurant listings and search results
 */

import typography from "@/constants/typography";
import { Restaurant } from "@/types/restaurant";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Clock, MapPin, Star } from "lucide-react-native";
import React from "react";
import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface RestaurantCardProps {
  restaurant: Restaurant & { distance?: number };
  variant?: "horizontal" | "vertical" | "featured";
}

const { width } = Dimensions.get("window");

export default function RestaurantCard({
  restaurant,
  variant = "vertical",
}: RestaurantCardProps) {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/restaurant/${restaurant.id}`);
  };

  const cardStyles = [
    styles.card,
    variant === "horizontal" && styles.horizontalCard,
    variant === "featured" && styles.featuredCard,
  ];
  
  const imageStyles = [
    styles.image,
    variant === "horizontal" && styles.horizontalImage,
    variant === "featured" && styles.featuredImage,
  ];
  
  const contentStyles = [
    styles.content,
    variant === "horizontal" && styles.horizontalContent,
    variant === "featured" && styles.featuredContent,
  ];

  // Format price range
  const getPriceRange = (range: string) => {
    switch (range) {
      case "low":
        return "$";
      case "medium":
        return "$$";
      case "high":
        return "$$$";
      default:
        return "$$";
    }
  };

  return (
    <TouchableOpacity
      style={cardStyles}
      onPress={handlePress}
      activeOpacity={0.9}
    >
      <Image
        source={{ uri: restaurant.imageUrl }}
        style={imageStyles}
        contentFit="cover"
        transition={300}
      />
      
      {!restaurant.isOpen && (
        <View style={styles.closedBadge}>
          <Text style={styles.closedText}>Closed</Text>
        </View>
      )}
      
      <View style={contentStyles}>
        <View style={styles.header}>
          <Text
            style={[
              variant === "featured" ? typography.heading3 : typography.heading4,
              styles.title,
            ]}
            numberOfLines={1}
          >
            {restaurant.name}
          </Text>
          
          <View style={styles.ratingContainer}>
            <Star size={14} color={"#8E8E8E"} fill={"#8E8E8E"} />
            <Text style={styles.rating}>{restaurant.rating}</Text>
            <Text style={styles.reviewCount}>({restaurant.reviewCount})</Text>
          </View>
        </View>
        
        <View style={styles.cuisineContainer}>
          {restaurant.cuisineType.map((cuisine, index) => (
            <React.Fragment key={cuisine}>
              <Text style={styles.cuisine}>{cuisine}</Text>
              {index < restaurant.cuisineType.length - 1 && (
                <Text style={styles.cuisineDot}>•</Text>
              )}
            </React.Fragment>
          ))}
          <Text style={styles.priceRange}>{getPriceRange(restaurant.priceRange)}</Text>
        </View>
        
        {variant !== "horizontal" && (
          <Text style={styles.description} numberOfLines={2}>
            {restaurant.description}
          </Text>
        )}
        
        <View style={styles.footer}>
          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              <Clock size={14} color={"#8E8E8E"} />
              <Text style={styles.metaText}>{restaurant.estimatedDeliveryTime} min</Text>
            </View>
            
            {restaurant.distance !== undefined && (
              <View style={styles.metaItem}>
                <MapPin size={14} color={"#8E8E8E"} />
                <Text style={styles.metaText}>{restaurant.distance} km</Text>
              </View>
            )}
          </View>
          
          <View style={styles.deliveryFeeContainer}>
            <Text style={styles.deliveryFeeText}>
              {restaurant.deliveryFee === 0 ? "Free Delivery" : `${restaurant.deliveryFee} ETB`}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    width: width * 0.9,
  },
  horizontalCard: {
    flexDirection: "row",
    height: 120,
    width: width * 0.9,
  },
  featuredCard: {
    height: 320,
    width: width * 0.9,
  },
  image: {
    height: 180,
    width: "100%",
  },
  horizontalImage: {
    height: "100%",
    width: 120,
  },
  featuredImage: {
    height: 200,
  },
  closedBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  closedText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  content: {
    padding: 16,
  },
  horizontalContent: {
    flex: 1,
  },
  featuredContent: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    flex: 1,
    marginRight: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    ...typography.bodySmall,
    fontWeight: "600",
    marginLeft: 4,
  },
  reviewCount: {
    ...typography.caption,
    color: "#8E8E8E",
    marginLeft: 2,
  },
  cuisineContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: 8,
  },
  cuisine: {
    ...typography.caption,
    color: "#8E8E8E",
  },
  cuisineDot: {
    ...typography.caption,
    color: "#8E8E8E",
    marginHorizontal: 4,
  },
  priceRange: {
    ...typography.caption,
    color: "#8E8E8E",
    marginLeft: 8,
  },
  description: {
    ...typography.bodySmall,
    color: "#262626",
    marginBottom: 12,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  metaContainer: {
    flexDirection: "row",
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  metaText: {
    ...typography.caption,
    marginLeft: 4,
  },
  deliveryFeeContainer: {
    backgroundColor: "#EFEFEF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  deliveryFeeText: {
    ...typography.caption,
    color: "#262626",
    fontWeight: "500",
  },
});