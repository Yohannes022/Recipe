/**
 * Types for restaurant, menu, order, and delivery features
 */

import { Recipe } from "./recipe";

export type UserRole = "customer" | "restaurant_owner" | "admin";

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  coverImageUrl?: string;
  location: Location;
  rating: number;
  reviewCount: number;
  cuisineType: string[];
  priceRange: "low" | "medium" | "high";
  openingHours: {
    open: string;
    close: string;
  };
  contactPhone: string;
  contactEmail?: string;
  ownerId: string;
  isOpen: boolean;
  deliveryFee: number;
  minOrderAmount: number;
  estimatedDeliveryTime: number; // in minutes
  createdAt: string;
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  category: string;
  isAvailable: boolean;
  isPopular?: boolean;
  recipeId?: string; // Optional link to a full recipe
  recipe?: Recipe; // Populated recipe data if available
  options?: MenuItemOption[];
}

export interface MenuItemOption {
  id: string;
  name: string;
  choices: {
    id: string;
    name: string;
    price: number;
  }[];
  required: boolean;
  multiSelect: boolean;
}

export interface CartItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  selectedOptions?: {
    optionId: string;
    choiceIds: string[];
  }[];
  specialInstructions?: string;
  totalPrice: number;
}

export interface Order {
  id: string;
  userId: string;
  restaurantId: string;
  items: CartItem[];
  status: OrderStatus;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  tip?: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: "pending" | "completed" | "failed";
  deliveryAddress: Location;
  deliveryInstructions?: string;
  estimatedDeliveryTime: number; // in minutes
  actualDeliveryTime?: number; // in minutes
  deliveryPersonId?: string;
  deliveryPersonLocation?: Location;
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus = 
  | "pending" 
  | "confirmed" 
  | "preparing" 
  | "ready_for_pickup" 
  | "out_for_delivery" 
  | "delivered" 
  | "cancelled";

export type PaymentMethod = "credit_card" | "debit_card" | "cash" | "mobile_money";

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  restaurantId: string;
  orderId?: string;
  rating: number; // 1-5
  comment?: string;
  images?: string[];
  createdAt: string;
  likes: number;
}

export interface DeliveryPerson {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
  currentLocation?: Location;
  isAvailable: boolean;
  rating: number;
  completedDeliveries: number;
}