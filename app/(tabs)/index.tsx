import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import React, { useState } from "react";
import {
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
// 
import CategoryPill from "@/components/CategoryPill";
import RecipeCard from "@/components/RecipeCard";
import typography from "@/constants/typography";
import { popularTags } from "@/mocks/recipes";
import { useAuthStore } from "@/store/authStore";
import { useRecipeStore } from "@/store/recipeStore";

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { recipes, setSelectedTag } = useRecipeStore();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const featuredRecipe = recipes[0];
  const popularRecipes = recipes.slice(1, 5);
  
  const filteredRecipes = selectedCategory
    ? recipes.filter((recipe) => recipe.tags.includes(selectedCategory))
    : popularRecipes;

  const handleCategoryPress = (category: string) => {
    if (selectedCategory === category) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category);
    }
  };

  const handleSeeAllPopular = () => {
    setSelectedTag(null);
    router.push("/search");
  };

  const handleSeeAllCategory = (category: string) => {
    setSelectedTag(category);
    router.push("/search");
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // In a real app, this would fetch fresh data
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {user?.name?.split(" ")[0] || "Guest"}</Text>
          <Text style={styles.subtitle}>What would you like to cook today?</Text>
        </View>
        <TouchableOpacity onPress={() => router.push("/profile")}>
          <Image
            source={{ uri: user?.avatar || "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=200" }}
            style={styles.avatar}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.featuredContainer}>
        <RecipeCard recipe={featuredRecipe} variant="featured" />
      </View>

      <View style={styles.categoriesContainer}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScrollContent}
        >
          {popularTags.map((tag) => (
            <CategoryPill
              key={tag}
              title={tag}
              selected={selectedCategory === tag}
              onPress={() => handleCategoryPress(tag)}
            />
          ))}
        </ScrollView>
      </View>

      <View style={styles.popularContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {selectedCategory ? `${selectedCategory} Recipes` : "Popular Recipes"}
          </Text>
          <TouchableOpacity
            style={styles.seeAllButton}
            onPress={() =>
              selectedCategory
                ? handleSeeAllCategory(selectedCategory)
                : handleSeeAllPopular()
            }
          >
            <Text style={styles.seeAllText}>See All</Text>
            <ChevronRight size={16} color= "#0095F6" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={filteredRecipes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <RecipeCard recipe={item} variant="horizontal" />
          )}
          ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
          scrollEnabled={false}
        />
      </View>
    </ScrollView>
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
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  greeting: {
    ...typography.heading3,
    marginBottom: 4,
  },
  subtitle: {
    ...typography.body,
    color: "#8E8E8E",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  featuredContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  categoriesContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    ...typography.heading3,
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  categoriesScrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  popularContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: 20,
    marginBottom: 16,
  },
  seeAllButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  seeAllText: {
    ...typography.bodySmall,
    color: "#0095F6",
    fontWeight: "600",
  },
});
