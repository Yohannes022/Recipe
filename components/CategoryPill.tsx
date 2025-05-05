import typography from "@/constants/typography";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface CategoryPillProps {
  title: string;
  selected?: boolean;
  onPress: () => void;
}

export default function CategoryPill({
  title,
  selected = false,
  onPress,
}: CategoryPillProps) {
  return (
    <TouchableOpacity
      style={[styles.pill, selected && styles.selectedPill]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text
        style={[styles.pillText, selected && styles.selectedPillText]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#EFEFEF",
    marginRight: 8,
    marginBottom: 8,
  },
  selectedPill: {
    backgroundColor: "#0095F6",
  },
  pillText: {
    ...typography.caption,
    color: "#262626",
    fontWeight: "500",
  },
  selectedPillText: {
    color: "#FFFFFF",
  },
});