/**
 * Menu item card component for displaying restaurant menu items
 * Used in restaurant detail page and cart
 */

import typography from "@/constants/typography";
import { MenuItem } from "@/types/restaurant";
import { Image } from "expo-image";
import { Plus } from "lucide-react-native";
import React from "react";
import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface MenuItemCardProps {
  menuItem: MenuItem;
  onPress: () => void;
  variant?: "horizontal" | "vertical";
}

const { width } = Dimensions.get("window");

export default function MenuItemCard({
  menuItem,
  onPress,
  variant = "vertical",
}: MenuItemCardProps) {
  const cardStyles = [
    styles.card,
    variant === "horizontal" && styles.horizontalCard,
  ];
  
  const imageStyles = [
    styles.image,
    variant === "horizontal" && styles.horizontalImage,
  ];
  
  const contentStyles = [
    styles.content,
    variant === "horizontal" && styles.horizontalContent,
  ];

  return (
    <TouchableOpacity
      style={cardStyles}
      onPress={onPress}
      activeOpacity={0.9}
      disabled={!menuItem.isAvailable}
    >
      <Image
        source={{ uri: menuItem.imageUrl }}
        style={imageStyles}
        contentFit="cover"
        transition={300}
      />
      
      {!menuItem.isAvailable && (
        <View style={styles.unavailableBadge}>
          <Text style={styles.unavailableText}>Unavailable</Text>
        </View>
      )}
      
      {menuItem.isPopular && (
        <View style={styles.popularBadge}>
          <Text style={styles.popularText}>Popular</Text>
        </View>
      )}
      
      <View style={contentStyles}>
        <Text
          style={styles.title}
          numberOfLines={2}
        >
          {menuItem.name}
        </Text>
        
        <Text style={styles.description} numberOfLines={2}>
          {menuItem.description}
        </Text>
        
        <View style={styles.footer}>
          <Text style={styles.price}>{menuItem.price} ETB</Text>
          
          {menuItem.isAvailable && (
            <TouchableOpacity
              style={styles.addButton}
              onPress={onPress}
            >
              <Plus size={18} color={"#FFFFFF"} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    width: width * 0.44,
    marginHorizontal: width * 0.01,
  },
  horizontalCard: {
    flexDirection: "row",
    height: 100,
    width: width * 0.9,
  },
  image: {
    height: 120,
    width: "100%",
  },
  horizontalImage: {
    height: "100%",
    width: 100,
  },
  unavailableBadge: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  unavailableText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  popularBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#0095F6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "600",
  },
  content: {
    padding: 12,
  },
  horizontalContent: {
    flex: 1,
  },
  title: {
    ...typography.bodySmall,
    fontWeight: "600",
    marginBottom: 4,
  },
  description: {
    ...typography.caption,
    color: "#8E8E8E",
    marginBottom: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: {
    ...typography.bodySmall,
    fontWeight: "600",
  },
  addButton: {
    backgroundColor: "#0095F6",
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
});