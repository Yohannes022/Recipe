/**
 * Payment method selector component
 * Allows users to select a payment method for checkout
 */

import typography from "@/constants/typography";
import { usePaymentStore } from "@/store/paymentStore";
import { CreditCard, DollarSign, Plus, Smartphone } from "lucide-react-native";
import React from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface PaymentMethodSelectorProps {
  selectedMethodId: string | null;
  onSelect: (methodId: string) => void;
  onAddNew: () => void;
}

export default function PaymentMethodSelector({
  selectedMethodId,
  onSelect,
  onAddNew,
}: PaymentMethodSelectorProps) {
  const { paymentMethods } = usePaymentStore();

  const getPaymentIcon = (type: string) => {
    switch (type) {
      case "credit_card":
      case "debit_card":
        return <CreditCard size={24} color={"#262626"} />;
      case "mobile_money":
        return <Smartphone size={24} color={"#262626"} />;
      case "cash":
        return <DollarSign size={24} color={"#262626"} />;
      default:
        return <CreditCard size={24} color={"#262626"} />;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment Method</Text>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.methodsContainer}
      >
        {paymentMethods.map((method) => (
          <TouchableOpacity
            key={method.id}
            style={[
              styles.methodCard,
              selectedMethodId === method.id && styles.selectedMethodCard,
            ]}
            onPress={() => onSelect(method.id)}
          >
            <View style={styles.methodIcon}>
              {getPaymentIcon(method.type)}
            </View>
            <View style={styles.methodInfo}>
              <Text style={styles.methodName}>{method.name}</Text>
              {method.expiryDate && (
                <Text style={styles.methodDetail}>Expires: {method.expiryDate}</Text>
              )}
            </View>
            <View style={styles.radioButton}>
              {selectedMethodId === method.id && (
                <View style={styles.radioButtonSelected} />
              )}
            </View>
          </TouchableOpacity>
        ))}
        
        <TouchableOpacity
          style={styles.addMethodCard}
          onPress={onAddNew}
        >
          <Plus size={24} color={"#0095F6"} />
          <Text style={styles.addMethodText}>Add Payment Method</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    ...typography.heading4,
    marginBottom: 16,
  },
  methodsContainer: {
    paddingBottom: 8,
  },
  methodCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    width: 280,
    borderWidth: 1,
    borderColor: "#DBDBDB",
  },
  selectedMethodCard: {
    borderColor: "#0095F6",
    backgroundColor: "#0095F6" + "10", // Light primary color
  },
  methodIcon: {
    marginRight: 16,
  },
  methodInfo: {
    flex: 1,
  },
  methodName: {
    ...typography.bodySmall,
    fontWeight: "600",
    marginBottom: 4,
  },
  methodDetail: {
    ...typography.caption,
    color: "#8E8E8E",
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#0095F6",
    justifyContent: "center",
    alignItems: "center",
  },
  radioButtonSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#0095F6",
  },
  addMethodCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EFEFEF",
    borderRadius: 12,
    padding: 16,
    width: 220,
    borderWidth: 1,
    borderColor: "#DBDBDB",
    borderStyle: "dashed",
  },
  addMethodText: {
    ...typography.bodySmall,
    color: "#0095F6",
    fontWeight: "600",
    marginLeft: 8,
  },
});