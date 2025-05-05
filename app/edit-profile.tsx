import Button from "@/components/Button";
import Input from "@/components/Input";
import typography from "@/constants/typography";
import { useAuthStore } from "@/store/authStore";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { ArrowLeft, Camera } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, updateProfile } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setBio(user.bio || "");
      setLocation(user.location || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setAvatar(user.avatar || "");
    } else {
      router.replace("/(auth)");
    }
  }, [user]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert("Error", "Name is required");
      return;
    }

    setIsSubmitting(true);

    try {
      updateProfile({
        name,
        bio,
        location,
        email,
        phone,
        avatar,
      });

      Alert.alert(
        "Success",
        "Your profile has been updated successfully!",
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={"#262626"} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: avatar || "https://via.placeholder.com/150" }}
            style={styles.avatar}
            contentFit="cover"
          />
          <TouchableOpacity
            style={styles.changeAvatarButton}
            onPress={pickImage}
          >
            <Camera size={20} color={"#FFFFFF"} />
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <Input
            label="Name"
            placeholder="Your full name"
            value={name}
            onChangeText={setName}
          />

          <Input
            label="Bio"
            placeholder="Tell us about yourself"
            value={bio}
            onChangeText={setBio}
            multiline
            numberOfLines={4}
          />

          <Input
            label="Location"
            placeholder="City, Country"
            value={location}
            onChangeText={setLocation}
          />

          <Input
            label="Email"
            placeholder="your.email@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <Input
            label="Phone"
            placeholder="+251 91 234 5678"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          <Button
            title="Save Changes"
            onPress={handleSave}
            loading={isSubmitting}
            fullWidth
            style={styles.saveButton}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 50 : 20,
    paddingBottom: 10,
    backgroundColor: "#FAFAFA",
    borderBottomWidth: 1,
    borderBottomColor: "#DBDBDB",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    ...typography.heading3,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 24,
    position: "relative",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  changeAvatarButton: {
    position: "absolute",
    bottom: 0,
    right: "35%",
    backgroundColor: "#0095F6",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  form: {
    marginBottom: 40,
  },
  saveButton: {
    marginTop: 24,
  },
});