/**
 * Order status tracker component
 * Displays the current status of an order with a visual timeline
 * Shows progress through order states: confirmed, preparing, ready, out for delivery, delivered
 * Provides special UI for cancelled orders
 */

import typography from "@/constants/typography";
import { OrderStatus } from "@/types/restaurant";
import { Check } from "lucide-react-native";
import React from "react";
import {
    StyleSheet,
    Text,
    View,
} from "react-native";

interface OrderStatusTrackerProps {
  currentStatus: OrderStatus;
}

export default function OrderStatusTracker({
  currentStatus,
}: OrderStatusTrackerProps) {
  // Define the order status flow with labels
  const statuses: { key: OrderStatus; label: string }[] = [
    { key: "confirmed", label: "Confirmed" },
    { key: "preparing", label: "Preparing" },
    { key: "ready_for_pickup", label: "Ready for Pickup" },
    { key: "out_for_delivery", label: "Out for Delivery" },
    { key: "delivered", label: "Delivered" },
  ];

  // Find the index of the current status
  const currentIndex = statuses.findIndex((status) => status.key === currentStatus);
  
  // If order is cancelled, show a different UI
  if (currentStatus === "cancelled") {
    return (
      <View style={styles.cancelledContainer}>
        <Text style={styles.cancelledText}>Order Cancelled</Text>
        <Text style={styles.cancelledDescription}>
          This order has been cancelled. Please contact customer support if you have any questions.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {statuses.map((status, index) => {
        const isCompleted = index <= currentIndex;
        const isActive = index === currentIndex;
        
        return (
          <React.Fragment key={status.key}>
            {/* Status circle */}
            <View style={styles.statusItem}>
              <View
                style={[
                  styles.statusCircle,
                  isCompleted && styles.completedCircle,
                  isActive && styles.activeCircle,
                ]}
              >
                {isCompleted && <Check size={16} color={"#FFFFFF"} />}
              </View>
              <Text
                style={[
                  styles.statusText,
                  isCompleted && styles.completedText,
                  isActive && styles.activeText,
                ]}
              >
                {status.label}
              </Text>
            </View>
            
            {/* Connector line */}
            {index < statuses.length - 1 && (
              <View
                style={[
                  styles.connector,
                  index < currentIndex && styles.completedConnector,
                ]}
              />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  statusItem: {
    alignItems: "center",
    width: 70,
  },
  statusCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#EFEFEF",
    borderWidth: 1,
    borderColor: "#DBDBDB",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  completedCircle: {
    backgroundColor: "#0095F6",
    borderColor: "#0095F6",
  },
  activeCircle: {
    borderColor: "#0095F6",
    borderWidth: 2,
  },
  statusText: {
    ...typography.caption,
    color: "#8E8E8E",
    textAlign: "center",
  },
  completedText: {
    color: "#262626",
    fontWeight: "500",
  },
  activeText: {
    color: "#0095F6",
    fontWeight: "600",
  },
  connector: {
    height: 2,
    flex: 1,
    backgroundColor: "#DBDBDB",
  },
  completedConnector: {
    backgroundColor: "#0095F6",
  },
  cancelledContainer: {
    backgroundColor: "#ED4956" + "15", // Light red background
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  cancelledText: {
    ...typography.heading4,
    color: "#ED4956",
    marginBottom: 8,
  },
  cancelledDescription: {
    ...typography.bodySmall,
    color: "#262626",
    textAlign: "center",
  },
});