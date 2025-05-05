/**
 * Checkout screen
 * Allows users to complete their order with delivery address and payment
 * Handles order placement, payment processing, and delivery instructions
 * Provides tip options and order summary before final confirmation
 */

import Button from "@/components/Button";
import PaymentMethodSelector from "@/components/restaurant/PaymentMethodSelector";
import typography from "@/constants/typography";
import { useAuthStore } from "@/store/authStore";
import { useLocationStore } from "@/store/locationStore";
import { useOrderStore } from "@/store/orderStore";
import { usePaymentStore } from "@/store/paymentStore";
import { useRestaurantStore } from "@/store/restaurantStore";
import { Location } from "@/types/restaurant";
import { Stack, useRouter } from "expo-router";
import { MapPin } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function CheckoutScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { 
    cart, 
    selectedRestaurantId, 
    getCartTotal, 
    getDeliveryFee, 
    getTaxAmount, 
    getOrderTotal,
    createOrder
  } = useOrderStore();
  
  const { getRestaurantById } = useRestaurantStore();
  const { userLocation } = useLocationStore();
  const { 
    paymentMethods, 
    getDefaultPaymentMethod, 
    processPayment,
    isProcessingPayment
  } = usePaymentStore();
  
  const restaurant = selectedRestaurantId ? getRestaurantById(selectedRestaurantId) : null;
  
  // Form state
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryInstructions, setDeliveryInstructions] = useState("");
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<string | null>(null);
  const [tipAmount, setTipAmount] = useState(0);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  
  // Set default values when component mounts
  useEffect(() => {
    // Set default payment method
    const defaultMethod = getDefaultPaymentMethod();
    if (defaultMethod) {
      setSelectedPaymentMethodId(defaultMethod.id);
    } else if (paymentMethods.length > 0) {
      setSelectedPaymentMethodId(paymentMethods[0].id);
    }
    
    // Set default address if user location is available
    if (userLocation?.address) {
      setDeliveryAddress(userLocation.address);
    }
  }, [paymentMethods, userLocation]);
  
  // Redirect if cart is empty
  useEffect(() => {
    if (cart.length === 0) {
      router.replace("/cart");
    }
  }, [cart]);
  
  /**
   * Handle tip selection
   * @param amount - Tip amount in ETB
   */
  const handleTipSelection = (amount: number) => {
    setTipAmount(amount);
  };
  
  /**
   * Handle adding a new payment method
   * In a real app, this would navigate to a payment method form
   */
  const handleAddPaymentMethod = () => {
    Alert.alert("Add Payment Method", "This feature is coming soon!");
  };
  
  /**
   * Handle order placement
   * Validates form, processes payment, and creates order
   */
  const handlePlaceOrder = async () => {
    // Validate form
    if (!deliveryAddress.trim()) {
      Alert.alert("Error", "Please enter a delivery address");
      return;
    }
    
    if (!selectedPaymentMethodId) {
      Alert.alert("Error", "Please select a payment method");
      return;
    }
    
    setIsPlacingOrder(true);
    
    try {
      // Process payment
      const paymentMethod = paymentMethods.find(m => m.id === selectedPaymentMethodId);
      if (!paymentMethod) throw new Error("Payment method not found");
      
      const paymentSuccess = await processPayment(
        getOrderTotal() + tipAmount,
        selectedPaymentMethodId
      );
      
      if (!paymentSuccess) {
        throw new Error("Payment processing failed");
      }
      
      // Create delivery location from address
      const deliveryLocation: Location = {
        ...userLocation!,
        address: deliveryAddress
      };
      
      // Create order
      const order = await createOrder(
        deliveryLocation,
        paymentMethod.type as any,
        deliveryInstructions,
        tipAmount
      );
      
      // Navigate to order tracking
      router.replace(`/order/${order.id}`);
    } catch (error) {
      Alert.alert("Error", "Failed to place order. Please try again.");
      console.error("Order error:", error);
    } finally {
      setIsPlacingOrder(false);
    }
  };
  
  if (!restaurant || cart.length === 0) {
    return null; // Will redirect in useEffect
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <Stack.Screen options={{ title: "Checkout" }} />
      
      <ScrollView style={styles.scrollContent}>
        {/* Delivery address section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Address</Text>
          <View style={styles.addressContainer}>
            <MapPin size={20} color={"#0095F6"} style={styles.addressIcon} />
            <TextInput
              style={styles.addressInput}
              placeholder="Enter your delivery address"
              value={deliveryAddress}
              onChangeText={setDeliveryAddress}
              multiline
            />
          </View>
          
          <TextInput
            style={styles.instructionsInput}
            placeholder="Add delivery instructions (optional)"
            value={deliveryInstructions}
            onChangeText={setDeliveryInstructions}
            multiline
          />
        </View>
        
        {/* Payment method section */}
        <View style={styles.section}>
          <PaymentMethodSelector
            selectedMethodId={selectedPaymentMethodId}
            onSelect={setSelectedPaymentMethodId}
            onAddNew={handleAddPaymentMethod}
          />
        </View>
        
        {/* Tip section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tip</Text>
          <View style={styles.tipContainer}>
            {[0, 10, 20, 50].map((amount) => (
              <TouchableOpacity
                key={amount}
                style={[
                  styles.tipButton,
                  tipAmount === amount && styles.selectedTipButton,
                ]}
                onPress={() => handleTipSelection(amount)}
              >
                <Text
                  style={[
                    styles.tipButtonText,
                    tipAmount === amount && styles.selectedTipButtonText,
                  ]}
                >
                  {amount === 0 ? "No Tip" : `${amount} ETB`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        {/* Order summary section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Items ({cart.length})</Text>
              <Text style={styles.summaryValue}>{getCartTotal()} ETB</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery Fee</Text>
              <Text style={styles.summaryValue}>{getDeliveryFee()} ETB</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tax</Text>
              <Text style={styles.summaryValue}>{getTaxAmount()} ETB</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tip</Text>
              <Text style={styles.summaryValue}>{tipAmount} ETB</Text>
            </View>
            
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{getOrderTotal() + tipAmount} ETB</Text>
            </View>
          </View>
        </View>
      </ScrollView>
      
      {/* Place order button */}
      <View style={styles.footer}>
        <Button
          title="Place Order"
          onPress={handlePlaceOrder}
          variant="primary"
          fullWidth
          loading={isPlacingOrder || isProcessingPayment}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  scrollContent: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    ...typography.heading4,
    marginBottom: 16,
  },
  addressContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  addressIcon: {
    marginRight: 12,
    marginTop: 4,
  },
  addressInput: {
    flex: 1,
    ...typography.body,
    minHeight: 40,
  },
  instructionsInput: {
    ...typography.body,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    minHeight: 80,
    textAlignVertical: "top",
  },
  tipContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  tipButton: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "#DBDBDB",
  },
  selectedTipButton: {
    backgroundColor: "#0095F6",
    borderColor: "#0095F6",
  },
  tipButtonText: {
    ...typography.bodySmall,
    fontWeight: "600",
  },
  selectedTipButtonText: {
    color: "#FFFFFF",
  },
  summaryContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  summaryLabel: {
    ...typography.body,
    color: "#8E8E8E",
  },
  summaryValue: {
    ...typography.body,
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#DBDBDB",
    marginBottom: 0,
  },
  totalLabel: {
    ...typography.heading4,
  },
  totalValue: {
    ...typography.heading4,
  },
  footer: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#DBDBDB",
  },
});