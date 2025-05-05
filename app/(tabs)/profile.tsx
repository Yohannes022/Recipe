import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Bookmark, Edit2, Grid, LogOut, Settings } from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
// 
import RecipeCard from "@/components/RecipeCard";
import typography from "@/constants/typography";
import { useAuthStore } from "@/store/authStore";
import { useRecipeStore } from "@/store/recipeStore";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { recipes } = useRecipeStore();
  const [activeTab, setActiveTab] = useState<"recipes" | "saved">("recipes");

  if (!user) {
    router.replace("/(auth)");
    return null;
  }

  const userRecipes = recipes.filter((recipe) => recipe.authorId === user.id);
  const savedRecipes = recipes.filter((recipe) => recipe.isSaved);

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          onPress: () => {
            logout();
            router.replace("/(auth)");
          },
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  const handleEditProfile = () => {
    router.push("/edit-profile");
  };

  const handleSettings = () => {
    router.push("/settings");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={handleSettings}>
          <Settings size={24} color="#262626" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={handleLogout}>
          <LogOut size={24} color="#262626" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <Image
            source={{ uri: user.avatar }}
            style={styles.profileImage}
            contentFit="cover"
          />
          <Text style={styles.profileName}>{user.name}</Text>
          {user.location && (
            <Text style={styles.profileLocation}>{user.location}</Text>
          )}
          {user.bio && <Text style={styles.profileBio}>{user.bio}</Text>}

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userRecipes.length}</Text>
              <Text style={styles.statLabel}>Recipes</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{user.followers}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{user.following}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.editProfileButton}
            onPress={handleEditProfile}
          >
            <Edit2 size={16} color="#262626" />
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "recipes" && styles.activeTabButton,
            ]}
            onPress={() => setActiveTab("recipes")}
          >
            <Grid
              size={20}
              color={
                activeTab === "recipes" ? "#0095F6" : "#8E8E8E"
              }
            />
            <Text
              style={[
                styles.tabText,
                activeTab === "recipes" && styles.activeTabText,
              ]}
            >
              My Recipes
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "saved" && styles.activeTabButton,
            ]}
            onPress={() => setActiveTab("saved")}
          >
            <Bookmark
              size={20}
              color={activeTab === "recipes" ? "#0095F6" : "#8E8E8E"}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === "saved" && styles.activeTabText,
              ]}
            >
              Saved
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.recipesContainer}>
          {activeTab === "recipes" &&
            (userRecipes.length > 0 ? (
              userRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateTitle}>No recipes yet</Text>
                <Text style={styles.emptyStateText}>
                  Create your first recipe to share with the community
                </Text>
                <TouchableOpacity
                  style={styles.createButton}
                  onPress={() => router.push("/create-recipe")}
                >
                  <Text style={styles.createButtonText}>Create Recipe</Text>
                </TouchableOpacity>
              </View>
            ))}

          {activeTab === "saved" &&
            (savedRecipes.length > 0 ? (
              savedRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateTitle}>No saved recipes</Text>
                <Text style={styles.emptyStateText}>
                  Save recipes to access them later
                </Text>
                <TouchableOpacity
                  style={styles.createButton}
                  onPress={() => router.push("/search")}
                >
                  <Text style={styles.createButtonText}>Explore Recipes</Text>
                </TouchableOpacity>
              </View>
            ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  iconButton: {
    padding: 8,
  },
  profileSection: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  profileName: {
    ...typography.heading2,
    marginBottom: 4,
  },
  profileLocation: {
    ...typography.bodySmall,
    color: "#8E8E8E",
    marginBottom: 12,
  },
  profileBio: {
    ...typography.body,
    textAlign: "center",
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    ...typography.heading3,
    marginBottom: 4,
  },
  statLabel: {
    ...typography.caption,
    color: "#8E8E8E",
  },
  statDivider: {
    width: 1,
    height: "80%",
    backgroundColor: "#DBDBDB",
  },
  editProfileButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#DBDBDB",
    borderRadius: 20,
  },
  editProfileText: {
    ...typography.bodySmall,
    marginLeft: 8,
  },
  tabsContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#DBDBDB",
  },
  tabButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: "#0095F6",
  },
  tabText: {
    ...typography.body,
    color: "#8E8E8E",
    marginLeft: 8,
  },
  activeTabText: {
    color: "#0095F6",
    fontWeight: "600",
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
    marginBottom: 24,
  },
  createButton: {
    backgroundColor: "#0095F6",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  createButtonText: {
    ...typography.button,
    color: "white",
  },
});