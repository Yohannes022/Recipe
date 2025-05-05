/**
 * Order tracking screen
 * Shows order status, delivery tracking, and order details
 * Allows users to view their order progress and contact delivery person
 * Provides real-time updates on order status and delivery location
 */

import { Image } from "expo-image";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import {
  CheckCircle,
  ChevronLeft,
  Clock,
  MapPin,
  MessageCircle,
  Phone,
  XCircle,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
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
import DeliveryMap from "@/components/restaurant/DeliveryMap";
import OrderStatusTracker from "@/components/restaurant/OrderStatusTracker";
import typography from "@/constants/typography";
import { deliveryPeople } from "@/mocks/restaurants";
import { useLocationStore } from "@/store/locationStore";
import { useOrderStore } from "@/store/orderStore";
import { useRestaurantStore } from "@/store/restaurantStore";

export default function OrderTrackingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getOrderById, cancelOrder } = useOrderStore();
  const { getRestaurantById } = useRestaurantStore();
  const { userLocation } = useLocationStore();

  const order = getOrderById(id);
  const restaurant = order ? getRestaurantById(order.restaurantId) : null;

  const [isCancelling, setIsCancelling] = useState(false);

  // Redirect if order not found
  useEffect(() => {
    if (!order) {
      router.replace("/profile");
    }
  }, [order]);

  if (!order || !restaurant || !userLocation) {
    return null;
  }

  // Get delivery person info
  const deliveryPerson = order.deliveryPersonId
    ? deliveryPeople.find((dp) => dp.id === order.deliveryPersonId)
    : null;

  /**
   * Handle order cancellation with confirmation
   */
  const handleCancel = async () => {
    if (order.status === "delivered" || order.status === "cancelled") {
      return;
    }

    Alert.alert("Cancel Order", "Are you sure you want to cancel this order?", [
      {
        text: "No",
        style: "cancel",
      },
      {
        text: "Yes, Cancel",
        onPress: async () => {
          setIsCancelling(true);
          try {
            await cancelOrder(order.id);
            Alert.alert(
              "Order Cancelled",
              "Your order has been cancelled successfully."
            );
          } catch (error) {
            Alert.alert("Error", "Failed to cancel order. Please try again.");
          } finally {
            setIsCancelling(false);
          }
        },
        style: "destructive",
      },
    ]);
  };

  /**
   * Format date string to readable time
   */
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Determine if order can be cancelled
  const canCancel = !["delivered", "cancelled"].includes(order.status);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: `Order #${order.id.slice(-4)}`,
          headerLeft: () => (
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ChevronLeft size={24} color="#262626" />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView style={styles.content}>
        {/* Order status tracker */}
        <View style={styles.statusContainer}>
          <OrderStatusTracker currentStatus={order.status} />
        </View>

        {/* Delivery map - only shown when order is out for delivery */}
        {order.status === "out_for_delivery" &&
          order.deliveryPersonLocation && (
            <View style={styles.mapContainer}>
              <DeliveryMap
                restaurantLocation={restaurant.location}
                deliveryPersonLocation={order.deliveryPersonLocation}
                userLocation={order.deliveryAddress}
                estimatedTime={order.estimatedDeliveryTime}
              />

              {/* Delivery person info */}
              {deliveryPerson && (
                <View style={styles.deliveryPersonContainer}>
                  <Image
                    source={{ uri: deliveryPerson.avatar }}
                    style={styles.deliveryPersonAvatar}
                    contentFit="cover"
                  />
                  <View style={styles.deliveryPersonInfo}>
                    <Text style={styles.deliveryPersonName}>
                      {deliveryPerson.name}
                    </Text>
                    <Text style={styles.deliveryPersonMeta}>
                      {deliveryPerson.completedDeliveries} deliveries •{" "}
                      {deliveryPerson.rating} ★
                    </Text>
                  </View>
                  <View style={styles.deliveryPersonActions}>
                    <TouchableOpacity style={styles.deliveryPersonAction}>
                      <Phone size={20} color="#0095F6" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.deliveryPersonAction}>
                      <MessageCircle size={20} color="#0095F6" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          )}

        {/* Restaurant information */}
        <View style={styles.restaurantContainer}>
          <Image
            source={{ uri: restaurant.imageUrl }}
            style={styles.restaurantImage}
            contentFit="cover"
          />
          <View style={styles.restaurantInfo}>
            <Text style={styles.restaurantName}>{restaurant.name}</Text>
            <View style={styles.restaurantMeta}>
              <Clock size={14} color="#8E8E8E" />
              <Text style={styles.restaurantMetaText}>
                Order placed at {formatDate(order.createdAt)}
              </Text>
            </View>
            <View style={styles.restaurantMeta}>
              <MapPin size={14} color="#8E8E8E" />
              <Text style={styles.restaurantMetaText} numberOfLines={1}>
                {order.deliveryAddress.address}
              </Text>
            </View>
          </View>
        </View>

        {/* Order details section */}
        <View style={styles.orderDetailsContainer}>
          <Text style={styles.sectionTitle}>Order Details</Text>

          {/* Order items */}
          {order.items.map((item) => (
            <View key={item.id} style={styles.orderItem}>
              <View style={styles.orderItemQuantity}>
                <Text style={styles.orderItemQuantityText}>
                  {item.quantity}x
                </Text>
              </View>
              <View style={styles.orderItemInfo}>
                <Text style={styles.orderItemName}>{item.menuItem.name}</Text>
                {item.selectedOptions && item.selectedOptions.length > 0 && (
                  <Text style={styles.orderItemOptions}>
                    {item.selectedOptions
                      .map((option) => {
                        const optionDetails = item.menuItem?.options?.find(
                          (opt) => opt.id === option.optionId
                        );

                        if (!optionDetails) return null;

                        const choiceNames = option.choiceIds.map((choiceId) => {
                          const choice = optionDetails.choices.find(
                            (c) => c.id === choiceId
                          );
                          return choice?.name || "";
                        });

                        return `${optionDetails.name}: ${choiceNames.join(
                          ", "
                        )}`;
                      })
                      .join(", ")}
                  </Text>
                )}
                {item.specialInstructions && (
                  <Text style={styles.orderItemInstructions}>
                    Note: {item.specialInstructions}
                  </Text>
                )}
              </View>
              <Text style={styles.orderItemPrice}>{item.totalPrice} ETB</Text>
            </View>
          ))}

          <View style={styles.divider} />

          {/* Order summary */}
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>{order.subtotal} ETB</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee</Text>
            <Text style={styles.summaryValue}>{order.deliveryFee} ETB</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax</Text>
            <Text style={styles.summaryValue}>{order.tax} ETB</Text>
          </View>

          {order.tip && order.tip > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tip</Text>
              <Text style={styles.summaryValue}>{order.tip} ETB</Text>
            </View>
          )}

          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{order.total} ETB</Text>
          </View>

          {/* Payment information */}
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Payment Method</Text>
            <Text style={styles.paymentValue}>
              {order.paymentMethod === "credit_card"
                ? "Credit Card"
                : order.paymentMethod === "debit_card"
                ? "Debit Card"
                : order.paymentMethod === "mobile_money"
                ? "Mobile Money"
                : "Cash"}
            </Text>
          </View>

          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Payment Status</Text>
            <View style={styles.paymentStatusContainer}>
              {order.paymentStatus === "completed" ? (
                <CheckCircle size={16} color="#58C322" />
              ) : (
                <XCircle size={16} color="#ED4956" />
              )}
              <Text
                style={[
                  styles.paymentStatusText,
                  order.paymentStatus === "completed"
                    ? styles.successText
                    : styles.errorText,
                ]}
              >
                {order.paymentStatus === "completed" ? "Paid" : "Pending"}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Cancel order button - only shown for orders that can be cancelled */}
      {canCancel && (
        <View style={styles.footer}>
          <Button
            title="Cancel Order"
            onPress={handleCancel}
            variant="outline"
            fullWidth
            loading={isCancelling}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  backButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  statusContainer: {
    backgroundColor: "white",
    marginBottom: 16,
    paddingVertical: 8,
  },
  mapContainer: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  deliveryPersonContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  deliveryPersonAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  deliveryPersonInfo: {
    flex: 1,
    marginLeft: 12,
  },
  deliveryPersonName: {
    ...typography.bodySmall,
    fontWeight: "600",
    marginBottom: 4,
  },
  deliveryPersonMeta: {
    ...typography.caption,
    color: "#8E8E8E",
  },
  deliveryPersonActions: {
    flexDirection: "row",
  },
  deliveryPersonAction: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#0095F6" + "20",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  restaurantContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 16,
    marginBottom: 16,
  },
  restaurantImage: {
    width: 60,
    height: 60,
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
  restaurantMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  restaurantMetaText: {
    ...typography.caption,
    color: "#8E8E8E",
    marginLeft: 6,
  },
  orderDetailsContainer: {
    backgroundColor: "white",
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    ...typography.heading4,
    marginBottom: 16,
  },
  orderItem: {
    flexDirection: "row",
    marginBottom: 16,
  },
  orderItemQuantity: {
    width: 30,
    alignItems: "center",
  },
  orderItemQuantityText: {
    ...typography.bodySmall,
    fontWeight: "600",
  },
  orderItemInfo: {
    flex: 1,
    marginLeft: 8,
  },
  orderItemName: {
    ...typography.bodySmall,
    fontWeight: "500",
  },
  orderItemOptions: {
    ...typography.caption,
    color: "#8E8E8E",
    marginTop: 2,
  },
  orderItemInstructions: {
    ...typography.caption,
    color: "#8E8E8E",
    fontStyle: "italic",
    marginTop: 2,
  },
  orderItemPrice: {
    ...typography.bodySmall,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "#DBDBDB",
    marginVertical: 16,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
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
    marginBottom: 16,
  },
  totalLabel: {
    ...typography.heading4,
  },
  totalValue: {
    ...typography.heading4,
  },
  paymentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  paymentLabel: {
    ...typography.body,
    color: "#8E8E8E",
  },
  paymentValue: {
    ...typography.body,
    fontWeight: "500",
  },
  paymentStatusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  paymentStatusText: {
    ...typography.body,
    fontWeight: "500",
    marginLeft: 6,
  },
  successText: {
    color: "#58C322",
  },
  errorText: {
    color: "#ED4956",
  },
  footer: {
    backgroundColor: "white",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#DBDBDB",
  },
});