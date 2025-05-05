/**
 * Authentication store
 * Manages user authentication, registration, and profile data
 * Handles login, verification, and user role management
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "@/types/recipe";
import { currentUser as mockRegularUser, restaurantOwnerUser } from "@/mocks/restaurants";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  userType: "user" | "restaurant" | null;
  
  // Auth actions
  login: (phone: string, userType: "user" | "restaurant") => Promise<void>;
  verifyOtp: (otp: string) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => void;
  isAdmin: () => boolean;
  isRestaurantOwner: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      userType: null,
      
      login: async (phone, userType) => {
        set({ isLoading: true, error: null, userType });
        
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1500));
          
          // For demo purposes, we'll just check if the phone matches our mock users
          const mockUser = userType === "restaurant" ? restaurantOwnerUser : mockRegularUser;
          
          if (phone === mockUser.phone) {
            // Success - in a real app, this would trigger an OTP to be sent
            set({ isLoading: false });
          } else {
            // For demo, we'll allow any phone number to proceed
            set({ isLoading: false });
          }
        } catch (error) {
          set({
            isLoading: false,
            error: "Failed to send verification code. Please try again.",
          });
        }
      },
      
      verifyOtp: async (otp) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1500));
          
          // For demo purposes, any 6-digit OTP will work
          if (otp.length === 6) {
            // Select the appropriate mock user based on userType
            const userType = get().userType;
            const mockUser = userType === "restaurant" ? restaurantOwnerUser : mockRegularUser;
            
            set({
              user: mockUser,
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            set({
              isLoading: false,
              error: "Invalid verification code. Please try again.",
            });
          }
        } catch (error) {
          set({
            isLoading: false,
            error: "Failed to verify code. Please try again.",
          });
        }
      },
      
      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          userType: null,
        });
      },
      
      updateProfile: (userData) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        }));
      },

      isAdmin: () => {
        const { user } = get();
        return user?.role === "admin";
      },

      isRestaurantOwner: () => {
        const { user } = get();
        return user?.role === "restaurant";
      }
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);