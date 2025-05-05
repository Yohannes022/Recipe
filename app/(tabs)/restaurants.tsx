/**
 * Restaurants screen
 * Shows a list of restaurants with filtering and search options
 */

import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Plus, Settings, Store } from "lucide-react-native";
import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
// 
import Button from "@/components/Button";
import StarRating from "@/components/StarRating";
import typography from "@/constants/typography";
import { useAuthStore } from "@/store/authStore";
import { useRestaurantStore } from "@/store/restaurantStore";

export default function RestaurantsScreen() {
  const router = useRouter();
  const { user, isAdmin, isRestaurantOwner } = useAuthStore();
  const { restaurants, getRestaurantById } = useRestaurantStore();
  const [activeTab, setActiveTab] = useState<"all" | "mine">("mine");

  // Get user's restaurant if they are a restaurant owner
  const userRestaurant = user?.restaurantId 
    ? getRestaurantById(user.restaurantId) 
    : undefined;

  // Filter restaurants based on active tab
  const displayedRestaurants = activeTab === "all" 
    ? restaurants 
    : userRestaurant 
      ? [userRestaurant] 
      : [];

  const handleAddRestaurant = () => {
    // In a real app, this would navigate to a restaurant creation screen
    alert("Add restaurant functionality would be implemented here");
  };

  const handleManageRestaurant = (restaurantId: string) => {
    router.push(`/restaurant/${restaurantId}/manage`);
  };

  const handleViewRestaurant = (restaurantId: string) => {
    router.push(`/restaurant/${restaurantId}`);
  };

  const renderRestaurantCard = ({ item: restaurant }: { item: any }) => {
    const isOwner = user?.restaurantId === restaurant.id || isAdmin();
    
    return (
      <TouchableOpacity
        style={styles.restaurantCard}
        onPress={() => handleViewRestaurant(restaurant.id)}
        activeOpacity={0.8}
      >
        <Image
          source={{ uri: restaurant.coverImage }}
          style={styles.coverImage}
          contentFit="cover"
        />
        
        <View style={styles.logoContainer}>
          <Image
            source={{ uri: restaurant.logo }}
            style={styles.logo}
            contentFit="cover"
          />
        </View>
        
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={styles.restaurantName}>{restaurant.name}</Text>
            {restaurant.verified && (
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedText}>Verified</Text>
              </View>
            )}
          </View>
          
          <Text style={styles.restaurantLocation}>{restaurant.location}</Text>
          
          <View style={styles.ratingContainer}>
            <StarRating rating={restaurant.rating} size={16} showLabel />
            <Text style={styles.followersText}>{restaurant.followers} followers</Text>
          </View>
          
          {isOwner && (
            <Button
              title="Manage Restaurant"
              variant="admin"
              size="small"
              onPress={() => handleManageRestaurant(restaurant.id)}
              icon={<Settings size={16} color="white" />}
              style={styles.manageButton}
            />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Restaurants</Text>
        {isAdmin() && (
          <Button
            title="Add"
            variant="primary"
            size="small"
            onPress={handleAddRestaurant}
            icon={<Plus size={16} color="white" />}
          />
        )}
      </View>

      {(isRestaurantOwner() || isAdmin()) && (
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "mine" && styles.activeTabButton,
            ]}
            onPress={() => setActiveTab("mine")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "mine" && styles.activeTabText,
              ]}
            >
              My Restaurants
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "all" && styles.activeTabButton,
            ]}
            onPress={() => setActiveTab("all")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "all" && styles.activeTabText,
              ]}
            >
              All Restaurants
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {displayedRestaurants.length > 0 ? (
        <FlatList
          data={displayedRestaurants}
          renderItem={renderRestaurantCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Store size={64} color="#8E8E8E" />
          <Text style={styles.emptyTitle}>No restaurants found</Text>
          {isAdmin() && (
            <Button
              title="Add Restaurant"
              variant="primary"
              onPress={handleAddRestaurant}
              style={styles.addButton}
            />
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    ...typography.heading2,
  },
  tabsContainer: {
    flexDirection: "row",
    marginBottom: 20,
    borderRadius: 8,
    backgroundColor: "#EFEFEF",
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 6,
  },
  activeTabButton: {
    backgroundColor: "white",
  },
  tabText: {
    ...typography.bodySmall,
    color: "#8E8E8E",
  },
  activeTabText: {
    color: "#0095F6",
    fontWeight: "600",
  },
  listContent: {
    paddingBottom: 20,
  },
  restaurantCard: {
    backgroundColor: "white",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 20,
    elevation: 2,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  coverImage: {
    height: 120,
    width: "100%",
  },
  logoContainer: {
    position: "absolute",
    top: 90,
    left: 20,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "white",
    backgroundColor: "white",
    elevation: 4,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  cardContent: {
    padding: 20,
    paddingTop: 40,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  restaurantName: {
    ...typography.heading3,
  },
  verifiedBadge: {
    backgroundColor: "#58C322",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  verifiedText: {
    ...typography.caption,
    color: "white",
    fontWeight: "600",
  },
  restaurantLocation: {
    ...typography.bodySmall,
    color: "#8E8E8E",
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  followersText: {
    ...typography.caption,
    color: "#8E8E8E",
    marginLeft: 16,
  },
  manageButton: {
    alignSelf: "flex-start",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyTitle: {
    ...typography.heading3,
    marginTop: 16,
    marginBottom: 24,
  },
  addButton: {
    width: 200,
  },
});