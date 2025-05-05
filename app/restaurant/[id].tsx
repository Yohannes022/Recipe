/**
 * Restaurant detail screen
 * Shows restaurant information, menu items, and reviews
 * Allows users to browse menu, place orders, and view restaurant details
 * Provides filtering by category and detailed restaurant information
 */
import Button from "@/components/Button";
import RecipeCard from "@/components/RecipeCard";
import StarRating from "@/components/StarRating";
import typography from "@/constants/typography";
import { useAuthStore } from "@/store/authStore";
import { useRecipeStore } from "@/store/recipeStore";
import { useRestaurantStore } from "@/store/restaurantStore";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
    ChevronLeft,
    Clock,
    Globe,
    Heart,
    Mail,
    MapPin,
    Phone,
    Settings,
} from "lucide-react-native";
import React, { useState } from "react";
import {
    Linking,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function RestaurantDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getRestaurantById, followRestaurant, unfollowRestaurant } = useRestaurantStore();
  const { getRestaurantRecipes } = useRecipeStore();
  const { user, isAdmin, isRestaurantOwner } = useAuthStore();
  
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState<"menu" | "recipes">("menu");
  
  const restaurant = getRestaurantById(id);
  const restaurantRecipes = getRestaurantRecipes(id);
  
  const isOwner = user?.restaurantId === id || isAdmin();

  if (!restaurant) {
    return (
      <View style={styles.notFound}>
        <Text style={typography.heading2}>Restaurant not found</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleFollow = () => {
    if (isFollowing) {
      unfollowRestaurant(id);
    } else {
      followRestaurant(id);
    }
    setIsFollowing(!isFollowing);
  };

  const handleManage = () => {
    router.push(`/restaurant/${id}/manage`);
  };

  const handleCall = () => {
    Linking.openURL(`tel:${restaurant.phone}`);
  };

  const handleEmail = () => {
    if (restaurant.email) {
      Linking.openURL(`mailto:${restaurant.email}`);
    }
  };

  const handleWebsite = () => {
    if (restaurant.website) {
      Linking.openURL(`https://${restaurant.website}`);
    }
  };

  const handleViewRecipe = (recipeId: string) => {
    router.push(`/recipe/${recipeId}`);
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.coverContainer}>
          <Image
            source={{ uri: restaurant.coverImage }}
            style={styles.coverImage}
            contentFit="cover"
          />
          <LinearGradient
            colors={["rgba(0,0,0,0.7)", "transparent"]}
            style={styles.gradient}
          />
          <TouchableOpacity
            style={styles.backIconButton}
            onPress={() => router.back()}
          >
            <ChevronLeft size={24} color={"#FFFFFF"} />
          </TouchableOpacity>
          
          {isOwner && (
            <TouchableOpacity
              style={styles.settingsButton}
              onPress={handleManage}
            >
              <Settings size={24} color={"#FFFFFF"} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.headerContainer}>
          <View style={styles.logoContainer}>
            <Image
              source={{ uri: restaurant.logo }}
              style={styles.logo}
              contentFit="cover"
            />
          </View>
          
          <View style={styles.headerContent}>
            <View style={styles.nameContainer}>
              <Text style={styles.restaurantName}>{restaurant.name}</Text>
              {restaurant.verified && (
                <View style={styles.verifiedBadge}>
                  <Text style={styles.verifiedText}>Verified</Text>
                </View>
              )}
            </View>
            
            <View style={styles.ratingContainer}>
              <StarRating rating={restaurant.rating} size={16} showLabel />
              <Text style={styles.followersText}>
                {restaurant.followers} followers
              </Text>
            </View>
            
            <View style={styles.locationContainer}>
              <MapPin size={16} color={"#8E8E8E"} />
              <Text style={styles.locationText}>{restaurant.location}</Text>
            </View>
            
            {!isOwner && (
              <Button
                title={isFollowing ? "Following" : "Follow"}
                variant={isFollowing ? "outline" : "primary"}
                size="small"
                onPress={handleFollow}
                icon={
                  isFollowing ? (
                    <Heart size={16} color={"#0095F6"} fill={"#0095F6"} />
                  ) : (
                    <Heart size={16} color={"#FFFFFF"} />
                  )
                }
                style={styles.followButton}
              />
            )}
          </View>
        </View>

        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}>{restaurant.description}</Text>
        </View>

        <View style={styles.contactContainer}>
          <TouchableOpacity
            style={styles.contactItem}
            onPress={handleCall}
          >
            <View style={[styles.contactIcon, { backgroundColor: "#0095F6" + "20" }]}>
              <Phone size={20} color={"#0095F6"} />
            </View>
            <Text style={styles.contactText}>Call</Text>
          </TouchableOpacity>
          
          {restaurant.email && (
            <TouchableOpacity
              style={styles.contactItem}
              onPress={handleEmail}
            >
              <View style={[styles.contactIcon, { backgroundColor: "#8E8E8E" + "20" }]}>
                <Mail size={20} color={"#8E8E8E"} />
              </View>
              <Text style={styles.contactText}>Email</Text>
            </TouchableOpacity>
          )}
          
          {restaurant.website && (
            <TouchableOpacity
              style={styles.contactItem}
              onPress={handleWebsite}
            >
              <View style={[styles.contactIcon, { backgroundColor: "#FBAD50" + "20" }]}>
                <Globe size={20} color={"#FBAD50"} />
              </View>
              <Text style={styles.contactText}>Website</Text>
            </TouchableOpacity>
          )}
        </View>

        {restaurant.openingHours && (
          <View style={styles.hoursContainer}>
            <View style={styles.hoursHeader}>
              <Clock size={16} color={"#262626"} />
              <Text style={styles.hoursTitle}>Opening Hours</Text>
            </View>
            <Text style={styles.hoursText}>{restaurant.openingHours}</Text>
          </View>
        )}

        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "menu" && styles.activeTabButton,
            ]}
            onPress={() => setActiveTab("menu")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "menu" && styles.activeTabText,
              ]}
            >
              Menu
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "recipes" && styles.activeTabButton,
            ]}
            onPress={() => setActiveTab("recipes")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "recipes" && styles.activeTabText,
              ]}
            >
              Recipes
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === "menu" ? (
          <View style={styles.menuContainer}>
            {restaurant.menuCategories.map((category) => (
              <View key={category.id} style={styles.categoryContainer}>
                <Text style={styles.categoryTitle}>{category.name}</Text>
                
                {category.items.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.menuItem}
                    onPress={() => item.recipeId && handleViewRecipe(item.recipeId)}
                    disabled={!item.recipeId}
                  >
                    {item.imageUrl && (
                      <Image
                        source={{ uri: item.imageUrl }}
                        style={styles.menuItemImage}
                        contentFit="cover"
                      />
                    )}
                    
                    <View style={styles.menuItemContent}>
                      <View style={styles.menuItemHeader}>
                        <Text style={styles.menuItemName}>{item.name}</Text>
                        <Text style={styles.menuItemPrice}>{item.price}</Text>
                      </View>
                      <Text style={styles.menuItemDescription}>
                        {item.description}
                      </Text>
                      {item.recipeId && (
                        <Text style={styles.viewRecipeText}>View Recipe</Text>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.recipesContainer}>
            {restaurantRecipes.length > 0 ? (
              restaurantRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateTitle}>No recipes shared yet</Text>
                <Text style={styles.emptyStateText}>
                  This restaurant hasn't shared any recipes yet
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  notFound: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  backButton: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#0095F6",
    borderRadius: 8,
  },
  backButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  coverContainer: {
    height: 200,
    position: "relative",
  },
  coverImage: {
    width: "100%",
    height: "100%",
  },
  gradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  backIconButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 20,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  settingsButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 20,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerContainer: {
    flexDirection: "row",
    padding: 20,
    paddingTop: 0,
  },
  logoContainer: {
    marginTop: -40,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#FFFFFF",
    backgroundColor: "#FFFFFF",
    elevation: 4,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  headerContent: {
    flex: 1,
    marginLeft: 16,
    justifyContent: "center",
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  restaurantName: {
    ...typography.heading3,
    marginRight: 8,
  },
  verifiedBadge: {
    backgroundColor: "#58C322",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  verifiedText: {
    ...typography.caption,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  followersText: {
    ...typography.caption,
    color: "#8E8E8E",
    marginLeft: 16,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    ...typography.bodySmall,
    color: "#8E8E8E",
    marginLeft: 4,
  },
  followButton: {
    marginTop: 8,
    alignSelf: "flex-start",
  },
  descriptionContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  descriptionText: {
    ...typography.body,
  },
  contactContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  contactItem: {
    alignItems: "center",
  },
  contactIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  contactText: {
    ...typography.caption,
  },
  hoursContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
  },
  hoursHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  hoursTitle: {
    ...typography.bodySmall,
    fontWeight: "600",
    marginLeft: 8,
  },
  hoursText: {
    ...typography.body,
  },
  tabsContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#DBDBDB",
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 16,
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: "#0095F6",
  },
  tabText: {
    ...typography.body,
    color: "#8E8E8E",
  },
  activeTabText: {
    color: "#0095F6",
    fontWeight: "600",
  },
  menuContainer: {
    padding: 20,
  },
  categoryContainer: {
    marginBottom: 24,
  },
  categoryTitle: {
    ...typography.heading3,
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  menuItemImage: {
    width: 100,
    height: 100,
  },
  menuItemContent: {
    flex: 1,
    padding: 12,
  },
  menuItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  menuItemName: {
    ...typography.bodySmall,
    fontWeight: "600",
  },
  menuItemPrice: {
    ...typography.bodySmall,
    fontWeight: "600",
    color: "#0095F6",
  },
  menuItemDescription: {
    ...typography.caption,
    color: "#8E8E8E",
  },
  viewRecipeText: {
    ...typography.caption,
    color: "#0095F6",
    fontWeight: "600",
    marginTop: 8,
  },
  recipesContainer: {
    padding: 20,
  },
  emptyState: {
    alignItems: "center",
    padding: 40,
  },
  emptyStateTitle: {
    ...typography.heading3,
    marginBottom: 8,
  },
  emptyStateText: {
    ...typography.body,
    color: "#8E8E8E",
    textAlign: "center",
  },
});