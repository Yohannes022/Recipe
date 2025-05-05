import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Recipe, Comment, Rating } from "@/types/recipe";
import { recipes as mockRecipes } from "@/mocks/recipes";
import { currentUser } from "@/mocks/users";

interface RecipeState {
  recipes: Recipe[];
  filteredRecipes: Recipe[];
  selectedTag: string | null;
  selectedRegion: string | null;
  searchQuery: string;
  
  // Actions
  setRecipes: (recipes: Recipe[]) => void;
  toggleLike: (recipeId: string) => void;
  toggleSave: (recipeId: string) => void;
  setSelectedTag: (tag: string | null) => void;
  setSelectedRegion: (region: string | null) => void;
  setSearchQuery: (query: string) => void;
  filterRecipes: () => void;
  addRecipe: (recipe: Omit<Recipe, "id" | "authorId" | "authorName" | "authorAvatar" | "createdAt" | "likes" | "isLiked" | "isSaved" | "comments" | "ratings" | "averageRating">) => void;
  updateRecipe: (recipeId: string, recipeData: Partial<Recipe>) => void;
  deleteRecipe: (recipeId: string) => void;
  addComment: (recipeId: string, text: string) => void;
  deleteComment: (recipeId: string, commentId: string) => void;
  addRating: (recipeId: string, value: number) => void;
  getRestaurantRecipes: (restaurantId: string) => Recipe[];
}

export const useRecipeStore = create<RecipeState>()(
  persist(
    (set, get) => ({
      recipes: mockRecipes,
      filteredRecipes: mockRecipes,
      selectedTag: null,
      selectedRegion: null,
      searchQuery: "",
      
      setRecipes: (recipes) => set({ recipes, filteredRecipes: recipes }),
      
      toggleLike: (recipeId) => {
        set((state) => ({
          recipes: state.recipes.map((recipe) =>
            recipe.id === recipeId
              ? {
                  ...recipe,
                  isLiked: !recipe.isLiked,
                  likes: recipe.isLiked ? recipe.likes - 1 : recipe.likes + 1,
                }
              : recipe
          ),
        }));
        get().filterRecipes();
      },
      
      toggleSave: (recipeId) => {
        set((state) => ({
          recipes: state.recipes.map((recipe) =>
            recipe.id === recipeId
              ? { ...recipe, isSaved: !recipe.isSaved }
              : recipe
          ),
        }));
        get().filterRecipes();
      },
      
      setSelectedTag: (tag) => {
        set({ selectedTag: tag });
        get().filterRecipes();
      },
      
      setSelectedRegion: (region) => {
        set({ selectedRegion: region });
        get().filterRecipes();
      },
      
      setSearchQuery: (query) => {
        set({ searchQuery: query });
        get().filterRecipes();
      },
      
      filterRecipes: () => {
        const { recipes, selectedTag, selectedRegion, searchQuery } = get();
        
        let filtered = [...recipes];
        
        if (selectedTag) {
          filtered = filtered.filter((recipe) =>
            recipe.tags.includes(selectedTag)
          );
        }
        
        if (selectedRegion && selectedRegion !== "All regions") {
          filtered = filtered.filter(
            (recipe) => recipe.region === selectedRegion
          );
        }
        
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filtered = filtered.filter(
            (recipe) =>
              recipe.title.toLowerCase().includes(query) ||
              recipe.description.toLowerCase().includes(query) ||
              recipe.tags.some((tag) => tag.toLowerCase().includes(query)) ||
              recipe.ingredients.some((ing) =>
                ing.name.toLowerCase().includes(query)
              )
          );
        }
        
        set({ filteredRecipes: filtered });
      },
      
      addRecipe: (recipeData) => {
        // const { user } = currentUser;
        
        const newRecipe: Recipe = {
          id: Date.now().toString(),
          authorId: currentUser.id,
          authorName: currentUser.name,
          authorAvatar: currentUser.avatar,
          createdAt: new Date().toISOString(),
          likes: 0,
          isLiked: false,
          isSaved: false,
          comments: [],
          ratings: [],
          averageRating: 0,
          ...recipeData,
        };
        
        set((state) => ({
          recipes: [newRecipe, ...state.recipes],
        }));
        get().filterRecipes();
      },
      
      updateRecipe: (recipeId, recipeData) => {
        set((state) => ({
          recipes: state.recipes.map((recipe) =>
            recipe.id === recipeId
              ? { ...recipe, ...recipeData }
              : recipe
          ),
        }));
        get().filterRecipes();
      },
      
      deleteRecipe: (recipeId) => {
        set((state) => ({
          recipes: state.recipes.filter((recipe) => recipe.id !== recipeId),
        }));
        get().filterRecipes();
      },

      addComment: (recipeId, text) => {
        if (!currentUser) return;

        const newComment: Comment = {
          id: Date.now().toString(),
          userId: currentUser.id,
          userName: currentUser.name,
          userAvatar: currentUser.avatar,
          text,
          createdAt: new Date().toISOString()
        };

        set((state) => ({
          recipes: state.recipes.map((recipe) =>
            recipe.id === recipeId
              ? { 
                  ...recipe, 
                  comments: [newComment, ...recipe.comments] 
                }
              : recipe
          ),
        }));
      },

      deleteComment: (recipeId, commentId) => {
        set((state) => ({
          recipes: state.recipes.map((recipe) =>
            recipe.id === recipeId
              ? { 
                  ...recipe, 
                  comments: recipe.comments.filter(c => c.id !== commentId) 
                }
              : recipe
          ),
        }));
      },

      addRating: (recipeId, value) => {
        if (!currentUser) return;

        const newRating: Rating = {
          userId: currentUser.id,
          value
        };

        set((state) => {
          const updatedRecipes = state.recipes.map((recipe) => {
            if (recipe.id === recipeId) {
              // Remove existing rating by this user if it exists
              const filteredRatings = recipe.ratings.filter(r => r.userId !== currentUser.id);
              
              // Add new rating
              const updatedRatings = [...filteredRatings, newRating];
              
              // Calculate new average
              const sum = updatedRatings.reduce((acc, r) => acc + r.value, 0);
              const newAverage = updatedRatings.length > 0 ? sum / updatedRatings.length : 0;
              
              return { 
                ...recipe, 
                ratings: updatedRatings,
                averageRating: parseFloat(newAverage.toFixed(1))
              };
            }
            return recipe;
          });
          
          return { recipes: updatedRecipes };
        });
        
        get().filterRecipes();
      },

      getRestaurantRecipes: (restaurantId) => {
        return get().recipes.filter(recipe => recipe.restaurantId === restaurantId);
      }
    }),
    {
      name: "recipe-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);