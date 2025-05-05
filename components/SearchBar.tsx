import { Search, X } from "lucide-react-native";
import React from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

interface SearchBarProps {
  value: string;
  onChangeText: (query: string) => void;
  onClear: () => void;
  placeholder: string;
}

export default function SearchBar({
  value,
  onChangeText,
  onClear,
  placeholder,
}: SearchBarProps) {
  return (
    <View style={styles.container}>
      <Search size={20} color="#8E8E8E" />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#8E8E8E"
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={onClear}>
          <X size={20} color="#8E8E8E" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFEFEF",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: "#262626",
  },
});