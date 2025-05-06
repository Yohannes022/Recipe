import { createTRPCReact } from "@trpc/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { AppRouter } from "../backend/trpc/app-touter";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

export const trpc = createTRPCReact<AppRouter>();

const getBaseUrl = () => {
  if (Platform.OS === "android") return "http://10.0.2.2:5000";
  if (Platform.OS === "ios") return "http://localhost:5000";
  return "http://0.0.0.0:5000";
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

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

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        {children}
      </trpc.Provider>
    </QueryClientProvider>
  );
}