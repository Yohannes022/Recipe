/**
 * Cart item component for displaying items in the cart
 */

import typography from "@/constants/typography";
import { CartItem as CartItemType } from "@/types/restaurant";
import { Image } from "expo-image";
import { Minus, Plus, Trash2 } from "lucide-react-native";
import React from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface CartItemProps {
  item: CartItemType;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
}

export default function CartItem({
  item,
  onIncrement,
  onDecrement,
  onRemove,
}: CartItemProps) {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: item.menuItem.imageUrl }}
        style={styles.image}
        contentFit="cover"
      />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>
            {item.menuItem.name}
          </Text>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={onRemove}
          >
            <Trash2 size={16} color={"#ED4956"} />
          </TouchableOpacity>
        </View>
        
        {item.selectedOptions && item.selectedOptions.length > 0 && (
          <View style={styles.optionsContainer}>
            {item.selectedOptions.map((option) => {
              // Find option details from menu item
              const optionDetails = item.menuItem.options?.find(
                (opt) => opt.id === option.optionId
              );
              
              if (!optionDetails) return null;
              
              // Get selected choice names
              const choiceNames = option.choiceIds.map((choiceId) => {
                const choice = optionDetails.choices.find(
                  (c) => c.id === choiceId
                );
                return choice?.name || "";
              });
              
              return (
                <Text key={option.optionId} style={styles.optionText}>
                  {optionDetails.name}: {choiceNames.join(", ")}
                </Text>
              );
            })}
          </View>
        )}
        
        {item.specialInstructions && (
          <Text style={styles.specialInstructions} numberOfLines={1}>
            Note: {item.specialInstructions}
          </Text>
        )}
        
        <View style={styles.footer}>
          <Text style={styles.price}>{item.totalPrice} ETB</Text>
          
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={onDecrement}
            >
              <Minus size={16} color={"#262626"} />
            </TouchableOpacity>
            
            <Text style={styles.quantity}>{item.quantity}</Text>
            
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={onIncrement}
            >
              <Plus size={16} color={"#262626"} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 8,
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  title: {
    ...typography.bodySmall,
    fontWeight: "600",
    flex: 1,
    marginRight: 8,
  },
  removeButton: {
    padding: 4,
  },
  optionsContainer: {
    marginBottom: 4,
  },
  optionText: {
    ...typography.caption,
    color: "#8E8E8E",
  },
  specialInstructions: {
    ...typography.caption,
    color: "#8E8E8E",
    fontStyle: "italic",
    marginBottom: 4,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  price: {
    ...typography.bodySmall,
    fontWeight: "600",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFEFEF",
    borderRadius: 16,
    paddingHorizontal: 4,
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  quantity: {
    ...typography.bodySmall,
    fontWeight: "600",
    marginHorizontal: 8,
  },
});