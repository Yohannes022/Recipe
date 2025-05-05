import { createTRPCReact } from "@trpc/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import React, { useState } from "react";
import { AppRouter } from "../backend/trpc/app-touter";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

// Create a tRPC React instance
export const trpc = createTRPCReact<AppRouter>();

// Utility to get the base URL depending on the platform
const getBaseUrl = () => {
  if (Platform.OS === "android") return "http://10.0.2.2:3000";
  if (Platform.OS === "ios") return "http://localhost:3000";
  return ""; // For web or fallback
};

// Shared query client
export const queryClient = new QueryClient();

// Create a standalone tRPC client (optional if needed outside React)
export const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${getBaseUrl()}/api/trpc`,
      async headers() {
        const token = await AsyncStorage.getItem("token");
        return {
          authorization: token ? `Bearer ${token}` : "",
        };
      },
    }),
  ],
});

// TRPCProvider for wrapping the app
export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const [client] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
          async headers() {
            const token = await AsyncStorage.getItem("token");
            return {
              authorization: token ? `Bearer ${token}` : "",
            };
          },
        }),
      ],
    })
  );

  return React.createElement(
    QueryClientProvider,
    { client: queryClient },
    React.createElement(
      trpc.Provider,
      { client: client, queryClient: queryClient },
      children
    )
  );
}
