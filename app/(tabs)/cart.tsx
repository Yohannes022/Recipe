/**
 * Cart screen
 * Shows items in the cart and allows checkout
 */

import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { ChevronRight, Minus, Plus, Trash2 } from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
// 
import Button from "@/components/Button";
import typography from "@/constants/typography";
import { useAuthStore } from "@/store/authStore";
import { useOrderStore } from "@/store/orderStore";
import { useRestaurantStore } from "@/store/restaurantStore";

export default function CartScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { 
    cart, 
    selectedRestaurantId, 
    updateCartItemQuantity, 
    removeFromCart, 
    clearCart,
    getCartTotal,
    getDeliveryFee,
    getTaxAmount,
    getOrderTotal
  } = useOrderStore();
  
  const { getRestaurantById } = useRestaurantStore();
  
  const restaurant = selectedRestaurantId 
    ? getRestaurantById(selectedRestaurantId) 
    : null;
  
  const [isRemoving, setIsRemoving] = useState(false);
  
  const handleQuantityChange = (cartItemId: string, newQuantity: number) => {
    updateCartItemQuantity(cartItemId, newQuantity);
  };
  
  const handleRemoveItem = (cartItemId: string) => {
    setIsRemoving(true);
    setTimeout(() => {
      removeFromCart(cartItemId);
      setIsRemoving(false);
    }, 300);
  };
  
  const handleClearCart = () => {
    Alert.alert(
      "Clear Cart",
      "Are you sure you want to remove all items from your cart?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Clear",
          onPress: clearCart,
          style: "destructive"
        }
      ]
    );
  };
  
  const handleCheckout = () => {
    if (!user) {
      Alert.alert(
        "Sign In Required",
        "Please sign in to continue with your order",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          {
            text: "Sign In",
            onPress: () => router.push("/login")
          }
        ]
      );
      return;
    }
    
    router.push("/checkout");
  };
  
  if (cart.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Image
          source={{ uri: "https://images.unsplash.com/photo-1594385208974-2e75f8d7bb48?q=80&w=1000&auto=format&fit=crop" }}
          style={styles.emptyImage}
          contentFit="contain"
        />
        <Text style={styles.emptyTitle}>Your cart is empty</Text>
        <Text style={styles.emptyText}>
          Add items from restaurants to start an order
        </Text>
        <Button
          title="Browse Restaurants"
          onPress={() => router.push("/restaurants")}
          variant="primary"
          style={styles.browseButton}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Your Cart</Text>
          {cart.length > 0 && (
            <TouchableOpacity onPress={handleClearCart}>
              <Text style={styles.clearText}>Clear All</Text>
            </TouchableOpacity>
          )}
        </View>
        
        {restaurant && (
          <TouchableOpacity
            style={styles.restaurantContainer}
            onPress={() => router.push(`/restaurant/${restaurant.id}`)}
          >
            <Image
              source={{ uri: restaurant.imageUrl }}
              style={styles.restaurantImage}
              contentFit="cover"
            />
            <View style={styles.restaurantInfo}>
              <Text style={styles.restaurantName}>{restaurant.name}</Text>
              <Text style={styles.restaurantAddress} numberOfLines={1}>
                {restaurant.location.address}
              </Text>
            </View>
            <ChevronRight size={20} color="#8E8E8E" />
          </TouchableOpacity>
        )}
        
        <View style={styles.cartItemsContainer}>
          {cart.map((item) => (
            <View key={item.id} style={styles.cartItem}>
              <View style={styles.cartItemHeader}>
                <Text style={styles.cartItemName}>{item.menuItem.name}</Text>
                <TouchableOpacity
                  onPress={() => handleRemoveItem(item.id)}
                  disabled={isRemoving}
                >
                  <Trash2 size={20} color="#ED4956" />
                </TouchableOpacity>
              </View>
              
              {item.selectedOptions && item.selectedOptions.length > 0 && (
                <Text style={styles.cartItemOptions}>
                  {item.selectedOptions.map((option) => {
                    const optionDetails = item.menuItem.options?.find(
                      (opt) => opt.id === option.optionId
                    );
                    
                    if (!optionDetails) return null;
                    
                    const choiceNames = option.choiceIds.map((choiceId) => {
                      const choice = optionDetails.choices.find(
                        (c) => c.id === choiceId
                      );
                      return choice?.name || "";
                    });
                    
                    return `${optionDetails.name}: ${choiceNames.join(", ")}`;
                  }).join(", ")}
                </Text>
              )}
              
              {item.specialInstructions && (
                <Text style={styles.cartItemInstructions}>
                  Note: {item.specialInstructions}
                </Text>
              )}
              
              <View style={styles.cartItemFooter}>
                <View style={styles.quantityContainer}>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => handleQuantityChange(item.id, item.quantity - 1)}
                  >
                    <Minus size={16} color="#262626" />
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{item.quantity}</Text>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => handleQuantityChange(item.id, item.quantity + 1)}
                  >
                    <Plus size={16} color="#262626" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.cartItemPrice}>{item.totalPrice} ETB</Text>
              </View>
            </View>
          ))}
        </View>
        
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Order Summary</Text>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
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
          
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{getOrderTotal()} ETB</Text>
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <Button
          title="Proceed to Checkout"
          onPress={handleCheckout}
          variant="primary"
          fullWidth
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  scrollContent: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    ...typography.heading1,
  },
  clearText: {
    ...typography.body,
    color: "#ED4956",
  },
  restaurantContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 12,
  },
  restaurantImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  restaurantInfo: {
    flex: 1,
    marginLeft: 12,
  },
  restaurantName: {
    ...typography.bodySmall,
    fontWeight: "600",
    marginBottom: 4,
  },
  restaurantAddress: {
    ...typography.caption,
    color: "#8E8E8E",
  },
  cartItemsContainer: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  cartItem: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  cartItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cartItemName: {
    ...typography.bodySmall,
    fontWeight: "600",
    flex: 1,
    marginRight: 8,
  },
  cartItemOptions: {
    ...typography.caption,
    color: "#8E8E8E",
    marginBottom: 8,
  },
  cartItemInstructions: {
    ...typography.caption,
    color: "#8E8E8E",
    fontStyle: "italic",
    marginBottom: 8,
  },
  cartItemFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFEFEF",
    borderRadius: 20,
    paddingHorizontal: 8,
  },
  quantityButton: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityText: {
    ...typography.bodySmall,
    fontWeight: "600",
    marginHorizontal: 8,
  },
  cartItemPrice: {
    ...typography.bodySmall,
    fontWeight: "600",
  },
  summaryContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 100,
  },
  summaryTitle: {
    ...typography.heading4,
    marginBottom: 16,
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
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#DBDBDB",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyImage: {
    width: 200,
    height: 200,
    marginBottom: 24,
  },
  emptyTitle: {
    ...typography.heading2,
    marginBottom: 8,
  },
  emptyText: {
    ...typography.body,
    color: "#8E8E8E",
    textAlign: "center",
    marginBottom: 24,
  },
  browseButton: {
    width: 200,
  },
});