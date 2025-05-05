import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Camera } from "lucide-react-native";
import React, { useState } from "react";
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
// 
import Button from "@/components/Button";
import Input from "@/components/Input";
import typography from "@/constants/typography";
import { useRecipeStore } from "@/store/recipeStore";
import { useRestaurantStore } from "@/store/restaurantStore";

export default function AddMenuItemScreen() {
  const { id, categoryId } = useLocalSearchParams<{ id: string; categoryId: string }>();
  const router = useRouter();
  const { getRestaurantById, addMenuItem } = useRestaurantStore();
  const { recipes } = useRecipeStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const restaurant = getRestaurantById(id);
  const category = restaurant?.menuCategories.find(c => c.id === categoryId);
  const restaurantRecipes = recipes.filter(r => r.restaurantId === id);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [recipeId, setRecipeId] = useState<string | undefined>(undefined);
  const [showRecipes, setShowRecipes] = useState(false);

  if (!restaurant || !category) {
    return (
      <View style={styles.notFound}>
        <Text style={typography.heading2}>Category not found</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUrl(result.assets[0].uri);
    }
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      Alert.alert("Error", "Item name is required");
      return;
    }

    if (!price.trim()) {
      Alert.alert("Error", "Price is required");
      return;
    }

    setIsSubmitting(true);

    try {
      addMenuItem(id, categoryId, {
        name,
        description,
        price,
        imageUrl,
        recipeId,
      });

      Alert.alert(
        "Success",
        "Menu item added successfully!",
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.error("Error adding menu item:", error);
      Alert.alert("Error", "Failed to add menu item. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectRecipe = (selectedRecipeId: string) => {
    const selectedRecipe = restaurantRecipes.find(r => r.id === selectedRecipeId);
    if (selectedRecipe) {
      setRecipeId(selectedRecipeId);
      setName(selectedRecipe.title);
      setDescription(selectedRecipe.description);
      setImageUrl(selectedRecipe.imageUrl);
    }
    setShowRecipes(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Add Menu Item to {category.name}</Text>

        <View style={styles.imageSection}>
          <Text style={styles.label}>Item Image</Text>
          {imageUrl ? (
            <View style={styles.imagePreviewContainer}>
              <Image
                source={{ uri: imageUrl }}
                style={styles.imagePreview}
                contentFit="cover"
              />
              <TouchableOpacity
                style={styles.changeImageButton}
                onPress={pickImage}
              >
                <Text style={styles.changeImageText}>Change Image</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.imagePicker}
              onPress={pickImage}
            >
              <Camera size={32} color={"#8E8E8E"} />
              <Text style={styles.imagePickerText}>Add Item Photo</Text>
            </TouchableOpacity>
          )}
        </View>

        <Input
          label="Item Name"
          placeholder="Enter item name"
          value={name}
          onChangeText={setName}
        />

        <Input
          label="Description"
          placeholder="Describe this menu item"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
        />

        <Input
          label="Price"
          placeholder="e.g. 250 ETB"
          value={price}
          onChangeText={setPrice}
        />

        <View style={styles.recipeSection}>
          <Text style={styles.label}>Link to Recipe (Optional)</Text>
          
          {recipeId ? (
            <View style={styles.selectedRecipe}>
              <Text style={styles.selectedRecipeText}>
                Recipe selected: {restaurantRecipes.find(r => r.id === recipeId)?.title}
              </Text>
              <TouchableOpacity
                style={styles.changeRecipeButton}
                onPress={() => setShowRecipes(true)}
              >
                <Text style={styles.changeRecipeText}>Change</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Button
              title="Select Recipe"
              variant="outline"
              onPress={() => setShowRecipes(true)}
            />
          )}
          
          {showRecipes && (
            <View style={styles.recipesContainer}>
              <Text style={styles.recipesTitle}>Select a Recipe</Text>
              
              {restaurantRecipes.length > 0 ? (
                restaurantRecipes.map((recipe) => (
                  <TouchableOpacity
                    key={recipe.id}
                    style={styles.recipeItem}
                    onPress={() => handleSelectRecipe(recipe.id)}
                  >
                    <Image
                      source={{ uri: recipe.imageUrl }}
                      style={styles.recipeImage}
                      contentFit="cover"
                    />
                    <View style={styles.recipeContent}>
                      <Text style={styles.recipeTitle}>{recipe.title}</Text>
                      <Text style={styles.recipeDescription} numberOfLines={1}>
                        {recipe.description}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.noRecipesText}>
                  No recipes available. Create recipes first to link them to menu items.
                </Text>
              )}
              
              <Button
                title="Cancel"
                variant="outline"
                onPress={() => setShowRecipes(false)}
                style={styles.cancelButton}
              />
            </View>
          )}
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Cancel"
            variant="outline"
            onPress={() => router.back()}
            style={styles.button}
          />
          <Button
            title="Add Item"
            variant="primary"
            onPress={handleSubmit}
            loading={isSubmitting}
            style={styles.button}
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
  notFound: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  backButton: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#0095F6",
    borderRadius: 8,
  },
  backButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    ...typography.heading2,
    marginBottom: 24,
  },
  label: {
    ...typography.bodySmall,
    fontWeight: "500",
    marginBottom: 8,
  },
  imageSection: {
    marginBottom: 20,
  },
  imagePreviewContainer: {
    marginBottom: 16,
    position: "relative",
  },
  imagePreview: {
    height: 200,
    width: "100%", // Fixed the missing value here
    borderRadius: 12,
  },
  changeImageButton: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  changeImageText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  imagePicker: {
    height: 200,
    backgroundColor: "#EFEFEF",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#DBDBDB",
    borderStyle: "dashed",
  },
  imagePickerText: {
    ...typography.body,
    color: "#8E8E8E",
    marginTop: 8,
  },
  recipeSection: {
    marginBottom: 24,
  },
  selectedRecipe: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#EFEFEF",
    borderRadius: 8,
    padding: 12,
  },
  selectedRecipeText: {
    ...typography.body,
    flex: 1,
  },
  changeRecipeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  changeRecipeText: {
    ...typography.bodySmall,
    color: "#0095F6",
    fontWeight: "600",
  },
  recipesContainer: {
    marginTop: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#DBDBDB",
  },
  recipesTitle: {
    ...typography.heading4,
    marginBottom: 16,
  },
  recipeItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#DBDBDB",
  },
  recipeImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  recipeContent: {
    flex: 1,
  },
  recipeTitle: {
    ...typography.body,
    fontWeight: "600",
    marginBottom: 4,
  },
  recipeDescription: {
    ...typography.bodySmall,
    color: "#8E8E8E",
  },
  noRecipesText: {
    ...typography.body,
    color: "#8E8E8E",
    textAlign: "center",
    paddingVertical: 20,
  },
  cancelButton: {
    marginTop: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  button: {
    flex: 1,
    marginHorizontal: 6,
  },
});