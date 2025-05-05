import typography from "@/constants/typography";
import React from "react";
import {
    ActivityIndicator,
    StyleProp,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    View,
    ViewStyle,
} from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "admin";
  size?: "small" | "medium" | "large";
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export default function Button({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  fullWidth = false,
  disabled = false,
  loading = false,
  icon,
  iconPosition = "left",
  style,
  textStyle,
}: ButtonProps) {
  const getButtonStyle = () => {
    const baseStyle: ViewStyle[] = [styles.button];

    // Add variant style
    switch (variant) {
      case "primary":
        baseStyle.push(styles.primaryButton);
        break;
      case "secondary":
        baseStyle.push(styles.secondaryButton);
        break;
      case "outline":
        baseStyle.push(styles.outlineButton);
        break;
      case "ghost":
        baseStyle.push(styles.ghostButton);
        break;
      case "admin":
        baseStyle.push(styles.adminButton);
        break;
    }

    // Add size style
    switch (size) {
      case "small":
        baseStyle.push(styles.smallButton);
        break;
      case "medium":
        baseStyle.push(styles.mediumButton);
        break;
      case "large":
        baseStyle.push(styles.largeButton);
        break;
    }

    // Add full width style
    if (fullWidth) {
      baseStyle.push(styles.fullWidthButton);
    }

    // Add disabled style
    if (disabled || loading) {
      baseStyle.push(styles.disabledButton);
    }

    return baseStyle;
  };

  const getTextStyle = () => {
    const baseStyle: TextStyle[] = [styles.buttonText];

    // Add variant text style
    switch (variant) {
      case "primary":
        baseStyle.push(styles.primaryButtonText);
        break;
      case "secondary":
        baseStyle.push(styles.secondaryButtonText);
        break;
      case "outline":
        baseStyle.push(styles.outlineButtonText);
        break;
      case "ghost":
        baseStyle.push(styles.ghostButtonText);
        break;
      case "admin":
        baseStyle.push(styles.adminButtonText);
        break;
    }

    // Add size text style
    switch (size) {
      case "small":
        baseStyle.push(styles.smallButtonText);
        break;
      case "medium":
        baseStyle.push(styles.mediumButtonText);
        break;
      case "large":
        baseStyle.push(styles.largeButtonText);
        break;
    }

    // Add disabled text style
    if (disabled || loading) {
      baseStyle.push(styles.disabledButtonText);
    }

    return baseStyle;
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={
            variant === "outline" || variant === "ghost"
              ? "#0095F6"
              : "#FFFFFF"
          }
          size="small"
        />
      ) : (
        <View style={styles.contentContainer}>
          {icon && iconPosition === "left" && <View style={styles.iconLeft}>{icon}</View>}
          <Text style={[getTextStyle(), textStyle]}>{title}</Text>
          {icon && iconPosition === "right" && <View style={styles.iconRight}>{icon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: "#0095F6",
  },
  secondaryButton: {
    backgroundColor: "#8E8E8E",
  },
  outlineButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#0095F6",
  },
  ghostButton: {
    backgroundColor: "transparent",
  },
  adminButton: {
    backgroundColor: "#0095F6",
  },
  smallButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  mediumButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  largeButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  fullWidthButton: {
    width: "100%",
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    fontWeight: "600",
    textAlign: "center",
  },
  primaryButtonText: {
    color: "#FFFFFF",
  },
  secondaryButtonText: {
    color: "#FFFFFF",
  },
  outlineButtonText: {
    color: "#0095F6",
  },
  ghostButtonText: {
    color: "#0095F6",
  },
  adminButtonText: {
    color: "#FFFFFF",
  },
  smallButtonText: {
    ...typography.caption,
  },
  mediumButtonText: {
    ...typography.body,
  },
  largeButtonText: {
    ...typography.body,
  },
  disabledButtonText: {
    opacity: 0.7,
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});