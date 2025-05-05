/**
 * Store for order and delivery features
 * Manages cart, orders, and delivery tracking
 * Handles order creation, status updates, and payment processing
 * Provides order history and active order tracking
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CartItem, Order, OrderStatus, MenuItem, Location } from "@/types/restaurant";
import { mockOrders, deliveryPeople } from "@/mocks/restaurants";
import { useAuthStore } from "./authStore";

interface OrderState {
  cart: CartItem[];
  orders: Order[];
  activeOrderId: string | null;
  selectedRestaurantId: string | null;
  
  // Cart actions
  addToCart: (menuItem: MenuItem, quantity: number, selectedOptions?: any[], specialInstructions?: string) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartItemQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  
  // Order actions
  createOrder: (
    deliveryAddress: Location,
    paymentMethod: "credit_card" | "debit_card" | "cash" | "mobile_money",
    deliveryInstructions?: string,
    tip?: number
  ) => Promise<Order>;
  getOrderById: (orderId: string) => Order | undefined;
  getUserOrders: () => Order[];
  getActiveOrder: () => Order | undefined;
  setActiveOrderId: (orderId: string | null) => void;
  cancelOrder: (orderId: string) => Promise<void>;
  
  // Restaurant selection
  setSelectedRestaurantId: (restaurantId: string | null) => void;
  
  // Cart calculations
  getCartTotal: () => number;
  getCartItemCount: () => number;
  getDeliveryFee: () => number;
  getTaxAmount: () => number;
  getOrderTotal: () => number;
  
  // Delivery tracking
  getDeliveryPersonLocation: (orderId: string) => Location | undefined;
  updateDeliveryPersonLocation: (orderId: string, location: Location) => void;
  
  // For demo/mock purposes
  simulateOrderStatusUpdate: (orderId: string) => void;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      cart: [],
      orders: mockOrders,
      activeOrderId: null,
      selectedRestaurantId: null,
      
      /**
       * Add an item to the cart
       * If adding from a different restaurant, clears the cart first
       * Calculates total price including options
       */
      addToCart: (menuItem, quantity, selectedOptions = [], specialInstructions = "") => {
        // Check if adding from a different restaurant
        const { cart, selectedRestaurantId } = get();
        
        if (cart.length > 0 && selectedRestaurantId !== menuItem.restaurantId) {
          // Clear cart if adding from a different restaurant
          set({ cart: [] });
        }
        
        // Calculate total price including options
        let totalPrice = menuItem.price * quantity;
        
        if (selectedOptions && selectedOptions.length > 0 && menuItem.options) {
          selectedOptions.forEach(option => {
            if (option.choiceIds && option.choiceIds.length > 0) {
              const menuOption = menuItem.options?.find(opt => opt.id === option.optionId);
              if (menuOption) {
                option.choiceIds.forEach(choiceId => {
                  const choice = menuOption.choices.find(c => c.id === choiceId);
                  if (choice) {
                    totalPrice += choice.price * quantity;
                  }
                });
              }
            }
          });
        }
        
        const newCartItem: CartItem = {
          id: Date.now().toString(),
          menuItem,
          quantity,
          selectedOptions,
          specialInstructions,
          totalPrice
        };
        
        set((state) => ({
          cart: [...state.cart, newCartItem],
          selectedRestaurantId: menuItem.restaurantId
        }));
      },
      
      /**
       * Remove an item from the cart
       * If cart becomes empty, resets selectedRestaurantId
       */
      removeFromCart: (cartItemId) => {
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== cartItemId)
        }));
        
        // If cart is empty, reset selectedRestaurantId
        if (get().cart.length === 0) {
          set({ selectedRestaurantId: null });
        }
      },
      
      /**
       * Update the quantity of an item in the cart
       * Recalculates total price based on new quantity
       * Removes item if quantity is 0 or less
       */
      updateCartItemQuantity: (cartItemId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(cartItemId);
          return;
        }
        
        set((state) => ({
          cart: state.cart.map((item) => {
            if (item.id === cartItemId) {
              // Recalculate total price
              const unitPrice = item.totalPrice / item.quantity;
              return {
                ...item,
                quantity,
                totalPrice: unitPrice * quantity
              };
            }
            return item;
          })
        }));
      },
      
      /**
       * Clear the entire cart and reset restaurant selection
       */
      clearCart: () => {
        set({ cart: [], selectedRestaurantId: null });
      },
      
      /**
       * Create a new order
       * Processes payment, creates order record, and starts delivery simulation
       */
      createOrder: async (deliveryAddress, paymentMethod, deliveryInstructions, tip) => {
        const { cart, selectedRestaurantId } = get();
        const { user } = useAuthStore.getState();
        
        if (!user) {
          throw new Error("User must be logged in to create an order");
        }
        
        if (cart.length === 0 || !selectedRestaurantId) {
          throw new Error("Cart is empty or no restaurant selected");
        }
        
        const subtotal = get().getCartTotal();
        const deliveryFee = get().getDeliveryFee();
        const tax = get().getTaxAmount();
        const total = subtotal + deliveryFee + tax + (tip || 0);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const newOrder: Order = {
          id: `order-${Date.now()}`,
          userId: user.id,
          restaurantId: selectedRestaurantId,
          items: [...cart],
          status: "pending",
          subtotal,
          deliveryFee,
          tax,
          tip,
          total,
          paymentMethod,
          paymentStatus: "completed", // For demo purposes
          deliveryAddress,
          deliveryInstructions,
          estimatedDeliveryTime: 45, // Default estimate
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        set((state) => ({
          orders: [newOrder, ...state.orders],
          activeOrderId: newOrder.id,
          cart: [], // Clear cart after order is created
          selectedRestaurantId: null
        }));
        
        // Start simulating order status updates
        setTimeout(() => {
          get().simulateOrderStatusUpdate(newOrder.id);
        }, 10000); // Start after 10 seconds
        
        return newOrder;
      },
      
      /**
       * Get an order by its ID
       */
      getOrderById: (orderId) => {
        return get().orders.find((order) => order.id === orderId);
      },
      
      /**
       * Get all orders for the current user
       */
      getUserOrders: () => {
        const { user } = useAuthStore.getState();
        if (!user) return [];
        
        return get().orders.filter((order) => order.userId === user.id);
      },
      
      /**
       * Get the currently active order
       */
      getActiveOrder: () => {
        const { activeOrderId } = get();
        if (!activeOrderId) return undefined;
        
        return get().getOrderById(activeOrderId);
      },
      
      /**
       * Set the active order ID
       */
      setActiveOrderId: (orderId) => {
        set({ activeOrderId: orderId });
      },
      
      /**
       * Cancel an order
       * Updates order status to cancelled
       */
      cancelOrder: async (orderId) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId
              ? { ...order, status: "cancelled", updatedAt: new Date().toISOString() }
              : order
          )
        }));
        
        if (get().activeOrderId === orderId) {
          set({ activeOrderId: null });
        }
      },
      
      /**
       * Set the selected restaurant ID
       */
      setSelectedRestaurantId: (restaurantId) => {
        set({ selectedRestaurantId: restaurantId });
      },
      
      /**
       * Calculate the total price of all items in the cart
       */
      getCartTotal: () => {
        return get().cart.reduce((total, item) => total + item.totalPrice, 0);
      },
      
      /**
       * Calculate the total number of items in the cart
       */
      getCartItemCount: () => {
        return get().cart.reduce((count, item) => count + item.quantity, 0);
      },
      
      /**
       * Get the delivery fee for the current restaurant
       */
      getDeliveryFee: () => {
        const { selectedRestaurantId } = get();
        if (!selectedRestaurantId) return 0;
        
        const restaurant = get().orders[0]?.restaurantId === selectedRestaurantId 
          ? { deliveryFee: 50 } // Default if not found
          : { deliveryFee: 50 };
          
        return restaurant.deliveryFee;
      },
      
      /**
       * Calculate tax amount (10% of cart total)
       */
      getTaxAmount: () => {
        // Calculate tax (10% for demo purposes)
        return Math.round(get().getCartTotal() * 0.1);
      },
      
      /**
       * Calculate the total order amount including tax and delivery fee
       */
      getOrderTotal: () => {
        return get().getCartTotal() + get().getDeliveryFee() + get().getTaxAmount();
      },
      
      /**
       * Get the delivery person's location for an order
       */
      getDeliveryPersonLocation: (orderId) => {
        const order = get().getOrderById(orderId);
        if (!order || !order.deliveryPersonId) return undefined;
        
        return order.deliveryPersonLocation;
      },
      
      /**
       * Update the delivery person's location for an order
       */
      updateDeliveryPersonLocation: (orderId, location) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId
              ? { ...order, deliveryPersonLocation: location, updatedAt: new Date().toISOString() }
              : order
          )
        }));
      },
      
      /**
       * Simulate order status updates for demo purposes
       * Progresses through the order lifecycle with random timing
       */
      simulateOrderStatusUpdate: (orderId) => {
        const order = get().getOrderById(orderId);
        if (!order) return;
        
        const statusFlow: OrderStatus[] = [
          "pending",
          "confirmed",
          "preparing",
          "ready_for_pickup",
          "out_for_delivery",
          "delivered"
        ];
        
        const currentIndex = statusFlow.indexOf(order.status);
        if (currentIndex >= statusFlow.length - 1) return; // Already delivered
        
        const nextStatus = statusFlow[currentIndex + 1];
        
        // Assign a delivery person when status changes to out_for_delivery
        let deliveryPersonId = order.deliveryPersonId;
        let deliveryPersonLocation = order.deliveryPersonLocation;
        
        if (nextStatus === "out_for_delivery" && !deliveryPersonId) {
          // Assign a random delivery person
          const availableDeliveryPerson = deliveryPeople.find(dp => dp.isAvailable);
          if (availableDeliveryPerson) {
            deliveryPersonId = availableDeliveryPerson.id;
            deliveryPersonLocation = availableDeliveryPerson.currentLocation;
          }
        }
        
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId
              ? { 
                  ...o, 
                  status: nextStatus, 
                  updatedAt: new Date().toISOString(),
                  deliveryPersonId,
                  deliveryPersonLocation
                }
              : o
          )
        }));
        
        // Continue simulation for next status if not delivered
        if (nextStatus !== "delivered") {
          // Random time between 30s and 2min for next update
          const nextUpdateTime = Math.floor(Math.random() * (120000 - 30000) + 30000);
          setTimeout(() => {
            get().simulateOrderStatusUpdate(orderId);
          }, nextUpdateTime);
        } else {
          // If delivered, add actualDeliveryTime
          set((state) => ({
            orders: state.orders.map((o) =>
              o.id === orderId
                ? { 
                    ...o, 
                    actualDeliveryTime: o.estimatedDeliveryTime - Math.floor(Math.random() * 10)
                  }
                : o
            )
          }));
          
          // Clear active order if it's the current one
          if (get().activeOrderId === orderId) {
            set({ activeOrderId: null });
          }
        }
      }
    }),
    {
      name: "order-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        // Don't persist these values
        orders: state.orders,
        cart: state.cart,
        selectedRestaurantId: state.selectedRestaurantId,
        // Don't persist activeOrderId as it should be set based on order status when app restarts
      }),
    }
  )
);