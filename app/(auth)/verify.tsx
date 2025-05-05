import Button from "@/components/Button";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
// 
import typography from "@/constants/typography";
import { useAuthStore } from "@/store/authStore";

export default function VerifyScreen() {
  const router = useRouter();
  const { verifyOtp, isLoading, error } = useAuthStore();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(60);
  const inputRefs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timerId);
    }
  }, [timeLeft]);

  const handleOtpChange = (text: string, index: number) => {
    if (text.length > 1) {
      text = text[0];
    }
    
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    
    // Auto-focus next input
    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = () => {
    setTimeLeft(60);
    // In a real app, this would trigger the OTP to be resent
  };

  const handleVerify = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 6) return;
    
    try {
      await verifyOtp(otpString);
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Verification error:", error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.title}>Verification Code</Text>
              <Text style={styles.subtitle}>
                We've sent a verification code to your phone
              </Text>
            </View>

            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => { inputRefs.current[index] = ref; }}
                  style={styles.otpInput}
                  value={digit}
                  onChangeText={(text) => handleOtpChange(text, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  keyboardType="number-pad"
                  maxLength={1}
                  selectTextOnFocus
                />
              ))}
            </View>

            {error && <Text style={styles.errorText}>{error}</Text>}

            <Button
              title="Verify"
              onPress={handleVerify}
              variant="primary"
              size="large"
              loading={isLoading}
              fullWidth
              style={styles.button}
            />

            <View style={styles.resendContainer}>
              <Text style={styles.resendText}>Didn't receive the code? </Text>
              {timeLeft > 0 ? (
                <Text style={styles.timerText}>{`Resend in ${timeLeft}s`}</Text>
              ) : (
                <TouchableOpacity onPress={handleResend}>
                  <Text style={styles.resendButton}>Resend</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  header: {
    marginTop: 40,
    marginBottom: 40,
  },
  title: {
    ...typography.heading2,
    marginBottom: 8,
  },
  subtitle: {
    ...typography.body,
    color: "#8E8E8E",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 32,
  },
  otpInput: {
    width: 50,
    height: 56,
    borderWidth: 1,
    borderColor: "#DBDBDB",
    borderRadius: 8,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "600",
    backgroundColor: "white",
  },
  button: {
    marginBottom: 24,
  },
  errorText: {
    ...typography.bodySmall,
    color: "#ED4956",
    marginBottom: 16,
  },
  resendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  resendText: {
    ...typography.bodySmall,
    color: "#8E8E8E",
  },
  timerText: {
    ...typography.bodySmall,
    color: "#8E8E8E",
  },
  resendButton: {
    ...typography.bodySmall,
    color: "#0095F6",
    fontWeight: "600",
  },
});