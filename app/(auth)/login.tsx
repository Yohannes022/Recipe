import Button from "@/components/Button";
import Input from "@/components/Input";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
// 
import typography from "@/constants/typography";
import { useAuthStore } from "@/store/authStore";

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading, error } = useAuthStore();
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [userType, setUserType] = useState<"user" | "restaurant">("user");

  const validatePhone = () => {
    if (!phone) {
      setPhoneError("Phone number is required");
      return false;
    }
    
    if (phone.length < 10) {
      setPhoneError("Please enter a valid phone number");
      return false;
    }
    
    setPhoneError("");
    return true;
  };

  const handleLogin = async () => {
    if (!validatePhone()) return;
    
    try {
      await login(phone, userType);
      router.push("/verify");
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.safeArea}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.header}>
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?q=80&w=500",
                }}
                style={styles.logo}
                contentFit="cover"
              />
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>
                Enter your phone number to continue
              </Text>
            </View>

            <View style={styles.userTypeContainer}>
              <TouchableOpacity
                style={[
                  styles.userTypeButton,
                  userType === "user" && styles.activeUserTypeButton,
                ]}
                onPress={() => setUserType("user")}
              >
                <Text
                  style={[
                    styles.userTypeText,
                    userType === "user" && styles.activeUserTypeText,
                  ]}
                >
                  Regular User
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.userTypeButton,
                  userType === "restaurant" && styles.activeUserTypeButton,
                ]}
                onPress={() => setUserType("restaurant")}
              >
                <Text
                  style={[
                    styles.userTypeText,
                    userType === "restaurant" && styles.activeUserTypeText,
                  ]}
                >
                  Restaurant Owner
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.form}>
              <Input
                label="Phone Number"
                placeholder="+251 91 234 5678"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                error={phoneError}
              />

              {error && <Text style={styles.errorText}>{error}</Text>}

              <Button
                title="Continue"
                onPress={handleLogin}
                variant="primary"
                size="large"
                loading={isLoading}
                fullWidth
                style={styles.button}
              />
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                By continuing, you agree to our Terms of Service and Privacy
                Policy
              </Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  header: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 24,
  },
  title: {
    ...typography.heading2,
    marginBottom: 8,
  },
  subtitle: {
    ...typography.body,
    color: "#8E8E8E",
    textAlign: "center",
  },
  userTypeContainer: {
    flexDirection: "row",
    marginBottom: 24,
    borderRadius: 8,
    backgroundColor: "#EFEFEF",
    padding: 4,
  },
  userTypeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 6,
  },
  activeUserTypeButton: {
    backgroundColor: "white",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  userTypeText: {
    ...typography.body,
    color: "#8E8E8E",
  },
  activeUserTypeText: {
    color: "#0095F6",
    fontWeight: "600",
  },
  form: {
    marginBottom: 24,
  },
  button: {
    marginTop: 16,
  },
  errorText: {
    ...typography.bodySmall,
    color: "#ED4956",
    marginTop: 8,
    marginBottom: 8,
  },
  footer: {
    marginTop: "auto",
    alignItems: "center",
  },
  footerText: {
    ...typography.caption,
    color: "#8E8E8E",
    textAlign: "center",
  },
});