/**
 * Store for location services
 * Manages user location and nearby search functionality
 * Handles location permissions, geocoding, and distance calculations
 * Provides platform-specific implementations for web and native
 */

import {create} from 'zustand';
import { Location } from "@/types/restaurant";
import * as ExpoLocation from "expo-location";
import { Platform } from "react-native";

interface LocationState {
  userLocation: Location | null;
  locationPermissionStatus: ExpoLocation.PermissionStatus | null;
  isLoadingLocation: boolean;
  locationError: string | null;
  
  // Actions
  requestLocationPermission: () => Promise<boolean>;
  getCurrentLocation: () => Promise<Location | null>;
  setManualLocation: (location: Location) => void;
  calculateDistance: (location1: Location, location2: Location) => number;
  getNearbyRestaurants: (restaurants: any[], maxDistance?: number) => any[];
}

export const useLocationStore = create<LocationState>((set, get) => ({
  userLocation: null,
  locationPermissionStatus: null,
  isLoadingLocation: false,
  locationError: null,
  
  /**
   * Request permission to access device location
   * Handles platform-specific permission requests
   */
  requestLocationPermission: async () => {
    set({ isLoadingLocation: true, locationError: null });
    
    try {
      // Skip for web platform
      if (Platform.OS === 'web') {
        set({
          locationPermissionStatus: 'granted',
          isLoadingLocation: false
        });
        return true;
      }
      
      const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
      set({ locationPermissionStatus: status });
      
      if (status !== 'granted') {
        set({
          locationError: 'Permission to access location was denied',
          isLoadingLocation: false
        });
        return false;
      }
      
      return true;
    } catch (error) {
      set({
        locationError: 'Failed to request location permission',
        isLoadingLocation: false
      });
      return false;
    }
  },
  
  /**
   * Get the current device location
   * Uses browser geolocation API on web and Expo Location on native
   */
  getCurrentLocation: async () => {
    // Check if we already have permission
    if (get().locationPermissionStatus !== 'granted') {
      const hasPermission = await get().requestLocationPermission();
      if (!hasPermission) return null;
    }
    
    set({ isLoadingLocation: true, locationError: null });
    
    try {
      // For web, use browser geolocation API
      if (Platform.OS === 'web') {
        return new Promise<Location | null>((resolve) => {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const location = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                address: "Current location" // Web API doesn't provide address
              };
              set({ userLocation: location, isLoadingLocation: false });
              resolve(location);
            },
            (error) => {
              set({
                locationError: error.message,
                isLoadingLocation: false
              });
              resolve(null);
            }
          );
        });
      }
      
      // For native platforms, use Expo Location
      const location = await ExpoLocation.getCurrentPositionAsync({
        accuracy: ExpoLocation.Accuracy.Balanced
      });
      
      const userLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        address: "Current location" // We would normally use reverse geocoding here
      };
      
      set({ userLocation, isLoadingLocation: false });
      return userLocation;
    } catch (error) {
      set({
        locationError: 'Failed to get current location',
        isLoadingLocation: false
      });
      return null;
    }
  },
  
  /**
   * Set a manual location (for when GPS is unavailable or user selects a location)
   */
  setManualLocation: (location) => {
    set({ userLocation: location });
  },
  
  /**
   * Calculate distance between two locations using Haversine formula
   * Returns distance in kilometers
   */
  calculateDistance: (location1, location2) => {
    // Haversine formula to calculate distance between two coordinates
    const toRad = (value: number) => (value * Math.PI) / 180;
    
    const R = 6371; // Earth's radius in km
    const dLat = toRad(location2.latitude - location1.latitude);
    const dLon = toRad(location2.longitude - location1.longitude);
    
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(location1.latitude)) *
        Math.cos(toRad(location2.latitude)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
        
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    
    return distance;
  },
  
  /**
   * Get restaurants within a specified distance of the user's location
   * Filters and sorts restaurants by distance
   */
  getNearbyRestaurants: (restaurants, maxDistance = 5) => {
    const { userLocation, calculateDistance } = get();
    
    if (!userLocation) return restaurants;
    
    return restaurants.filter((restaurant) => {
      if (!restaurant.location) return false;
      
      const distance = calculateDistance(userLocation, restaurant.location);
      return distance <= maxDistance;
    }).map(restaurant => {
      const distance = calculateDistance(userLocation, restaurant.location);
      return {
        ...restaurant,
        distance: parseFloat(distance.toFixed(1))
      };
    }).sort((a, b) => a.distance - b.distance);
  }
}));