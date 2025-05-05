/**
 * Tab navigation layout
 * Defines the main tab structure for the app
 * Includes tabs for home, explore, restaurants, cart, create, and profile
 */

import { Tabs } from "expo-router";
import { BarChart2, Home, PlusSquare, Search, Store, User } from "lucide-react-native";
import React from "react";
import { useAuthStore } from "@/store/authStore";

export default function TabLayout() {
  const { user, isAdmin, isRestaurantOwner } = useAuthStore();
  const showRestaurantTab = user && (isAdmin() || isRestaurantOwner());

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#0095F6",
        tabBarInactiveTintColor: "#8E8E8E",
        tabBarStyle: {
          backgroundColor: "white",
          borderTopColor: "#DBDBDB",
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
        headerStyle: {
          backgroundColor: "#FAFAFA",
        },
        headerTintColor: "#262626",
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Home size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Explore",
          tabBarIcon: ({ color }) => <Search size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: "Create",
          tabBarIcon: ({ color }) => <PlusSquare size={22} color={color} />,
        }}
      />
      {showRestaurantTab && (
        <Tabs.Screen
          name="restaurant-dashboard"
          options={{
            title: "Dashboard", 
            tabBarIcon: ({ color }) => <BarChart2 size={22} color={color} />,
          }}
        />
      )}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <User size={22} color={color} />,
        }}
      />
    </Tabs>
  );
}