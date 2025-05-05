/**
 * Root layout component
 * Sets up the app's navigation structure, global providers, and error boundaries
 * Configures React Query, tRPC, and other global app settings
 */

import { TRPCProvider } from "@/lib/trpc";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { QueryClient } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { ErrorBoundary } from "./error-boundary";

export const unstable_settings = {
  initialRouteName: "(auth)",
};

// Create a client for React Query
const queryClient = new QueryClient();

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) {
      console.error(error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ErrorBoundary>
      <TRPCProvider>
        <>
          <StatusBar style="dark" />
          <RootLayoutNav />
        </>
      </TRPCProvider>
    </ErrorBoundary>
  );
}

function RootLayoutNav() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#FAFAFA",
        },
        headerTintColor: "#262626",
        headerShadowVisible: false,
        headerBackTitle: "Back",
        contentStyle: {
          backgroundColor: "#FAFAFA",
        },
      }}
    >
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen 
        name="recipe/[id]" 
        options={{ 
          title: "",
          headerTransparent: true,
        }} 
      />
      <Stack.Screen 
        name="create-recipe" 
        options={{ 
          title: "Create Recipe",
          presentation: "modal",
        }} 
      />
      <Stack.Screen 
        name="edit-recipe/[id]" 
        options={{ 
          title: "Edit Recipe",
          presentation: "modal",
        }} 
      />
      <Stack.Screen 
        name="edit-profile" 
        options={{ 
          title: "Edit Profile",
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="settings" 
        options={{ 
          title: "Settings",
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="restaurant/[id]" 
        options={{ 
          title: "",
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="restaurant/[id]/manage" 
        options={{ 
          title: "Manage Restaurant",
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="restaurant/[id]/add-menu-item" 
        options={{ 
          title: "Add Menu Item",
          presentation: "modal",
        }} 
      />
      <Stack.Screen 
        name="restaurant/[id]/edit-menu-item" 
        options={{ 
          title: "Edit Menu Item",
          presentation: "modal",
        }} 
      />
    </Stack>
  );
}
