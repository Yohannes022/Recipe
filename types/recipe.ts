
import { Location } from './restaurant';

export interface Ingredient {
  id: string;
  name: string;
  amount: string;
  unit?: string;
}

export interface Step {
  id: string;
  description: string;
  imageUrl?: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  text: string;
  createdAt: string;
}

export interface Rating {
  userId: string;
  value: number; // 1-5
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  prepTime: number; // in minutes
  cookTime: number; // in minutes
  servings: number;
  difficulty: "easy" | "medium" | "hard";
  ingredients: Ingredient[];
  steps: Step[];
  region?: string;
  tags: string[];
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  createdAt: string;
  likes: number;
  isLiked?: boolean;
  isSaved?: boolean;
  comments: Comment[];
  ratings: Rating[];
  averageRating?: number;
  restaurantId?: string; // If recipe belongs to a restaurant
}

export interface User {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
  bio?: string;
  location?: string;
  email?: string;
  recipes: string[]; // Recipe IDs
  savedRecipes: string[]; // Recipe IDs
  followers: number;
  following: number;
  role: "user" | "admin" | "restaurant";
  restaurantId?: string; // If user is a restaurant admin
}

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  coverImageUrl?: string;
  location: Location;
  phone: string;
  email?: string;
  website?: string;
  openingHours?: string;
  adminIds: string[]; // User IDs of admins
  recipeIds: string[]; // Recipe IDs of restaurant recipes
  menuCategories: MenuCategory[];
  followers: number;
  rating: number;
  verified: boolean;
}

export interface MenuCategory {
  id: string;
  name: string;
  items: MenuItem[];
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  imageUrl?: string;
  recipeId?: string; // Optional link to full recipe
}