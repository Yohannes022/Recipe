import { initTRPC, TRPCError } from "@trpc/server";
import { z } from "zod";

// Define the context type
export interface Context {
  user?: {
    id: string;
    name: string;
    role: string;
  } | null;
}

// Create a new context for each request
export const createContext = async (): Promise<Context> => {
  // In a real app, this would validate the JWT token from the request
  // and fetch the user from the database

  // For demo purposes, we'll just return a mock user
  // In production, this would be based on the JWT token
  const mockUser = {
    id: "user-123",
    name: "Demo User",
    role: "user",
  };

  return {
    user: mockUser,
  };
};

// Initialize tRPC
const t = initTRPC.context<Context>().create();

// Create a router
export const router = t.router;

// Create a middleware to check if the user is authenticated
const isAuthenticated = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to access this resource",
    });
  }
  return next({
    ctx: {
      user: ctx.user,
    },
  });
});

// Create a middleware to check if the user is an admin
const isAdmin = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to access this resource",
    });
  }

  if (ctx.user.role !== "admin") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "You do not have permission to access this resource",
    });
  }

  return next({
    ctx: {
      user: ctx.user,
    },
  });
});

// Create a middleware to check if the user is a restaurant owner
const isRestaurantOwner = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to access this resource",
    });
  }

  if (ctx.user.role !== "restaurant" && ctx.user.role !== "admin") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "You do not have permission to access this resource",
    });
  }

  return next({
    ctx: {
      user: ctx.user,
    },
  });
});

// Export procedures
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthenticated);
export const adminProcedure = t.procedure.use(isAdmin);
export const restaurantProcedure = t.procedure.use(isRestaurantOwner);
