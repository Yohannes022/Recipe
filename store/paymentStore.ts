/**
 * Store for payment processing
 * Manages payment methods and transactions
 * Handles payment method selection, processing, and storage
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from "@react-native-async-storage/async-storage";

interface PaymentMethod {
  id: string;
  type: "credit_card" | "debit_card" | "mobile_money";
  name: string;
  last4?: string;
  expiryDate?: string;
  isDefault: boolean;
}

interface PaymentState {
  paymentMethods: PaymentMethod[];
  isProcessingPayment: boolean;
  paymentError: string | null;
  
  // Actions
  addPaymentMethod: (method: Omit<PaymentMethod, "id" | "isDefault">) => void;
  removePaymentMethod: (id: string) => void;
  setDefaultPaymentMethod: (id: string) => void;
  getDefaultPaymentMethod: () => PaymentMethod | undefined;
  processPayment: (amount: number, paymentMethodId: string) => Promise<boolean>;
}

export const usePaymentStore = create<PaymentState>()(
  persist(
    (set, get) => ({
      paymentMethods: [
        {
          id: "pm-1",
          type: "credit_card",
          name: "Visa ending in 4242",
          last4: "4242",
          expiryDate: "12/25",
          isDefault: true
        },
        {
          id: "pm-2",
          type: "mobile_money",
          name: "Mobile Money",
          isDefault: false
        }
      ],
      isProcessingPayment: false,
      paymentError: null,
      
      /**
       * Add a new payment method
       * If it's the first method, sets it as default
       * @param method - Payment method details
       */
      addPaymentMethod: (method) => {
        const newMethod: PaymentMethod = {
          id: `pm-${Date.now()}`,
          isDefault: get().paymentMethods.length === 0, // Make default if it's the first one
          ...method
        };
        
        set((state) => {
          // If this is set as default, update other methods
          if (newMethod.isDefault) {
            return {
              paymentMethods: [
                ...state.paymentMethods.map(m => ({ ...m, isDefault: false })),
                newMethod
              ]
            };
          }
          
          return {
            paymentMethods: [...state.paymentMethods, newMethod]
          };
        });
      },
      
      /**
       * Remove a payment method
       * If removing the default method, sets a new default
       * @param id - ID of the payment method to remove
       */
      removePaymentMethod: (id) => {
        const methodToRemove = get().paymentMethods.find(m => m.id === id);
        
        set((state) => ({
          paymentMethods: state.paymentMethods.filter(m => m.id !== id)
        }));
        
        // If we removed the default method, set a new default
        if (methodToRemove?.isDefault && get().paymentMethods.length > 0) {
          get().setDefaultPaymentMethod(get().paymentMethods[0].id);
        }
      },
      
      /**
       * Set a payment method as the default
       * @param id - ID of the payment method to set as default
       */
      setDefaultPaymentMethod: (id) => {
        set((state) => ({
          paymentMethods: state.paymentMethods.map(method => ({
            ...method,
            isDefault: method.id === id
          }))
        }));
      },
      
      /**
       * Get the default payment method
       * @returns The default payment method or undefined if none exists
       */
      getDefaultPaymentMethod: () => {
        return get().paymentMethods.find(method => method.isDefault);
      },
      
      /**
       * Process a payment
       * @param amount - Amount to charge
       * @param paymentMethodId - ID of the payment method to use
       * @returns Promise resolving to true if payment succeeded, false otherwise
       */
      processPayment: async (amount, paymentMethodId) => {
        set({ isProcessingPayment: true, paymentError: null });
        
        try {
          // Simulate payment processing
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // For demo purposes, always succeed
          set({ isProcessingPayment: false });
          return true;
        } catch (error) {
          set({
            isProcessingPayment: false,
            paymentError: "Payment processing failed. Please try again."
          });
          return false;
        }
      }
    }),
    {
      name: "payment-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);