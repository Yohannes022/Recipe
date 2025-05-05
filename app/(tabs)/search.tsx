import { useRouter } from "expo-router";
import { Filter } from "lucide-react-native";
import React, { useState } from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
// 
import CategoryPill from "@/components/CategoryPill";
import RecipeCard from "@/components/RecipeCard";
import SearchBar from "@/components/SearchBar";
import typography from "@/constants/typography";
import { popularTags, regions } from "@/mocks/recipes";
import { useRecipeStore } from "@/store/recipeStore";

export default function SearchScreen() {
  const router = useRouter();
  const {
    recipes,
    filteredRecipes,
    selectedTag,
    selectedRegion,
    searchQuery,
    setSelectedTag,
    setSelectedRegion,
    setSearchQuery,
  } = useRecipeStore();

  const [showFilters, setShowFilters] = useState(false);

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const handleTagSelect = (tag: string) => {
    setSelectedTag(selectedTag === tag ? null : tag);
  };

  const handleRegionSelect = (region: string) => {
    setSelectedRegion(selectedRegion === region ? null : region);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const clearAllFilters = () => {
    setSelectedTag(null);
    setSelectedRegion(null);
    setSearchQuery("");
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchHeader}>
        {/* Make sure SearchBar accepts these props; if not, update the SearchBar component accordingly */}
        {/* Ensure that "@/components/SearchBar" exports a component that accepts value, onChangeText, onClear, and placeholder props.
            If not, update the SearchBar component accordingly. */}
        {/* Make sure that "@/components/SearchBar" exports a SearchBar component that accepts value, onChangeText, onClear, and placeholder props */}
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onClear={handleClearSearch}
          placeholder="Search Ethiopian recipes..."
        />
        <TouchableOpacity
          style={[
            styles.filterButton,
            (selectedTag || selectedRegion) && styles.activeFilterButton,
          ]}
          onPress={toggleFilters}
        >
          <Filter
            size={20}
            color={
              selectedTag || selectedRegion
                ? "white"
                : "#262626"
            }
          />
        </TouchableOpacity>
      </View>

      {showFilters && (
        <View style={styles.filtersContainer}>
          <View style={styles.filterSection}>
            <View style={styles.filterHeader}>
              <Text style={styles.filterTitle}>Categories</Text>
              {selectedTag && (
                <TouchableOpacity onPress={() => setSelectedTag(null)}>
                  <Text style={styles.clearText}>Clear</Text>
                </TouchableOpacity>
              )}
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tagsContainer}
            >
              {popularTags.map((tag) => (
                <CategoryPill
                  key={tag}
                  title={tag}
                  selected={selectedTag === tag}
                  onPress={() => handleTagSelect(tag)}
                />
              ))}
            </ScrollView>
          </View>

          <View style={styles.filterSection}>
            <View style={styles.filterHeader}>
              <Text style={styles.filterTitle}>Regions</Text>
              {selectedRegion && (
                <TouchableOpacity onPress={() => setSelectedRegion(null)}>
                  <Text style={styles.clearText}>Clear</Text>
                </TouchableOpacity>
              )}
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tagsContainer}
            >
              {regions.map((region) => (
                <CategoryPill
                  key={region}
                  title={region}
                  selected={selectedRegion === region}
                  onPress={() => handleRegionSelect(region)}
                />
              ))}
            </ScrollView>
          </View>

          <TouchableOpacity
            style={styles.clearAllButton}
            onPress={clearAllFilters}
          >
            <Text style={styles.clearAllText}>Clear All Filters</Text>
          </TouchableOpacity>
        </View>
      )}

      {filteredRecipes.length > 0 ? (
        <FlatList
          data={filteredRecipes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <RecipeCard recipe={item} />}
          contentContainerStyle={styles.recipesList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No recipes found</Text>
          <Text style={styles.emptyText}>
            Try adjusting your search or filters to find what you're looking for
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0095F6",
    padding: 20,
  },
  searchHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#EFEFEF",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
  activeFilterButton: {
    backgroundColor: "#0095F6",
  },
  filtersContainer: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  filterSection: {
    marginBottom: 16,
  },
  filterHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  filterTitle: {
    ...typography.heading4,
  },
  clearText: {
    ...typography.bodySmall,
    color: "#0095F6",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  clearAllButton: {
    alignItems: "center",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#DBDBDB",
  },
  clearAllText: {
    ...typography.body,
    color: "#0095F6",
    fontWeight: "600",
  },
  recipesList: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyTitle: {
    ...typography.heading3,
    marginBottom: 8,
  },
  emptyText: {
    ...typography.body,
    color: "#8E8E8E",
    textAlign: "center",
  },
});