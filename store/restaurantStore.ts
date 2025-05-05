/**
 * Store for restaurant, menu, and delivery features
 * Manages restaurant listings, menu items, and related data
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Restaurant, MenuCategory, MenuItem } from "@/types/recipe";
import { restaurants as mockRestaurants } from "@/mocks/restaurants";

interface RestaurantState {
  restaurants: Restaurant[];
  
  // Actions
  getRestaurantById: (id: string) => Restaurant | undefined;
  updateRestaurant: (id: string, data: Partial<Restaurant>) => void;
  addMenuItem: (restaurantId: string, categoryId: string, item: Omit<MenuItem, "id">) => void;
  updateMenuItem: (restaurantId: string, categoryId: string, itemId: string, data: Partial<MenuItem>) => void;
  deleteMenuItem: (restaurantId: string, categoryId: string, itemId: string) => void;
  addMenuCategory: (restaurantId: string, name: string) => void;
  updateMenuCategory: (restaurantId: string, categoryId: string, name: string) => void;
  deleteMenuCategory: (restaurantId: string, categoryId: string) => void;
  followRestaurant: (restaurantId: string) => void;
  unfollowRestaurant: (restaurantId: string) => void;
}

export const useRestaurantStore = create<RestaurantState>()(
  persist(
    (set, get) => ({
      restaurants: mockRestaurants,
      
      getRestaurantById: (id) => {
        return get().restaurants.find(r => r.id === id);
      },
      
      updateRestaurant: (id, data) => {
        set((state) => ({
          restaurants: state.restaurants.map((restaurant) =>
            restaurant.id === id
              ? { ...restaurant, ...data }
              : restaurant
          ),
        }));
      },
      
      addMenuItem: (restaurantId, categoryId, item) => {
        const newItem: MenuItem = {
          id: Date.now().toString(),
          ...item
        };
        
        set((state) => ({
          restaurants: state.restaurants.map((restaurant) => {
            if (restaurant.id === restaurantId) {
              const updatedCategories = restaurant.menuCategories.map((category) => {
                if (category.id === categoryId) {
                  return {
                    ...category,
                    items: [...category.items, newItem]
                  };
                }
                return category;
              });
              
              return {
                ...restaurant,
                menuCategories: updatedCategories
              };
            }
            return restaurant;
          }),
        }));
      },
      
      updateMenuItem: (restaurantId, categoryId, itemId, data) => {
        set((state) => ({
          restaurants: state.restaurants.map((restaurant) => {
            if (restaurant.id === restaurantId) {
              const updatedCategories = restaurant.menuCategories.map((category) => {
                if (category.id === categoryId) {
                  const updatedItems = category.items.map((item) => {
                    if (item.id === itemId) {
                      return { ...item, ...data };
                    }
                    return item;
                  });
                  
                  return {
                    ...category,
                    items: updatedItems
                  };
                }
                return category;
              });
              
              return {
                ...restaurant,
                menuCategories: updatedCategories
              };
            }
            return restaurant;
          }),
        }));
      },
      
      deleteMenuItem: (restaurantId, categoryId, itemId) => {
        set((state) => ({
          restaurants: state.restaurants.map((restaurant) => {
            if (restaurant.id === restaurantId) {
              const updatedCategories = restaurant.menuCategories.map((category) => {
                if (category.id === categoryId) {
                  return {
                    ...category,
                    items: category.items.filter(item => item.id !== itemId)
                  };
                }
                return category;
              });
              
              return {
                ...restaurant,
                menuCategories: updatedCategories
              };
            }
            return restaurant;
          }),
        }));
      },
      
      addMenuCategory: (restaurantId, name) => {
        const newCategory: MenuCategory = {
          id: Date.now().toString(),
          name,
          items: []
        };
        
        set((state) => ({
          restaurants: state.restaurants.map((restaurant) => {
            if (restaurant.id === restaurantId) {
              return {
                ...restaurant,
                menuCategories: [...restaurant.menuCategories, newCategory]
              };
            }
            return restaurant;
          }),
        }));
      },
      
      updateMenuCategory: (restaurantId, categoryId, name) => {
        set((state) => ({
          restaurants: state.restaurants.map((restaurant) => {
            if (restaurant.id === restaurantId) {
              const updatedCategories = restaurant.menuCategories.map((category) => {
                if (category.id === categoryId) {
                  return {
                    ...category,
                    name
                  };
                }
                return category;
              });
              
              return {
                ...restaurant,
                menuCategories: updatedCategories
              };
            }
            return restaurant;
          }),
        }));
      },
      
      deleteMenuCategory: (restaurantId, categoryId) => {
        set((state) => ({
          restaurants: state.restaurants.map((restaurant) => {
            if (restaurant.id === restaurantId) {
              return {
                ...restaurant,
                menuCategories: restaurant.menuCategories.filter(
                  category => category.id !== categoryId
                )
              };
            }
            return restaurant;
          }),
        }));
      },
      
      followRestaurant: (restaurantId) => {
        set((state) => ({
          restaurants: state.restaurants.map((restaurant) => {
            if (restaurant.id === restaurantId) {
              return {
                ...restaurant,
                followers: restaurant.followers + 1
              };
            }
            return restaurant;
          }),
        }));
      },
      
      unfollowRestaurant: (restaurantId) => {
        set((state) => ({
          restaurants: state.restaurants.map((restaurant) => {
            if (restaurant.id === restaurantId) {
              return {
                ...restaurant,
                followers: Math.max(0, restaurant.followers - 1)
              };
            }
            return restaurant;
          }),
        }));
      }
    }),
    {
      name: "restaurant-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);