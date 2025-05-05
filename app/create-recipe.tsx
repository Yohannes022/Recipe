import Button from "@/components/Button";
import Input from "@/components/Input";
import typography from "@/constants/typography";
import { popularTags, regions } from "@/mocks/recipes";
import { useRecipeStore } from "@/store/recipeStore";
import { Ingredient, Step } from "@/types/recipe";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { Camera, Plus, X } from "lucide-react-native";
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

export default function CreateRecipeScreen() {
  const router = useRouter();
  const { addRecipe } = useRecipeStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [servings, setServings] = useState("");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [region, setRegion] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: "1", name: "", amount: "", unit: "" },
  ]);
  const [steps, setSteps] = useState<Step[]>([
    { id: "1", description: "" },
  ]);

  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
    imageUrl?: string;
    ingredients?: string;
    steps?: string;
  }>({});

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUrl(result.assets[0].uri);
    }
  };

  const addIngredient = () => {
    setIngredients([
      ...ingredients,
      { id: Date.now().toString(), name: "", amount: "", unit: "" },
    ]);
  };

  const updateIngredient = (id: string, field: keyof Ingredient, value: string) => {
    setIngredients(
      ingredients.map((ing) =>
        ing.id === id ? { ...ing, [field]: value } : ing
      )
    );
  };

  const removeIngredient = (id: string) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((ing) => ing.id !== id));
    }
  };

  const addStep = () => {
    setSteps([
      ...steps,
      { id: Date.now().toString(), description: "" },
    ]);
  };

  const updateStep = (id: string, description: string) => {
    setSteps(
      steps.map((step) =>
        step.id === id ? { ...step, description } : step
      )
    );
  };

  const removeStep = (id: string) => {
    if (steps.length > 1) {
      setSteps(steps.filter((step) => step.id !== id));
    }
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (!title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!imageUrl) {
      newErrors.imageUrl = "Please add a recipe image";
    }

    const hasEmptyIngredient = ingredients.some(
      (ing) => !ing.name.trim() || !ing.amount.trim()
    );
    if (hasEmptyIngredient) {
      newErrors.ingredients = "Please complete all ingredient fields";
    }

    const hasEmptyStep = steps.some((step) => !step.description.trim());
    if (hasEmptyStep) {
      newErrors.steps = "Please complete all instruction steps";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // For demo purposes, we'll use a placeholder image if the user didn't select one
      const finalImageUrl = imageUrl || "https://images.unsplash.com/photo-1567364816519-cbc9c4ffe1eb?q=80&w=1000";

      addRecipe({
        title,
        description,
        imageUrl: finalImageUrl,
        prepTime: parseInt(prepTime) || 0,
        cookTime: parseInt(cookTime) || 0,
        servings: parseInt(servings) || 1,
        difficulty,
        ingredients,
        steps,
        region: region || "", // Ensure region is always a string
        tags: selectedTags.length > 0 ? selectedTags : ["traditional"],
      });

      Alert.alert(
        "Success",
        "Your recipe has been created successfully!",
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.error("Error creating recipe:", error);
      Alert.alert("Error", "Failed to create recipe. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Recipe Details</Text>

          <Input
            label="Recipe Title"
            placeholder="Enter recipe name"
            value={title}
            onChangeText={setTitle}
            error={errors.title}
          />

          <Input
            label="Description"
            placeholder="Describe your recipe"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            error={errors.description}
          />

          <Text style={styles.label}>Recipe Image</Text>
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
              <Text style={styles.imagePickerText}>Add Recipe Photo</Text>
            </TouchableOpacity>
          )}
          {errors.imageUrl && (
            <Text style={styles.errorText}>{errors.imageUrl}</Text>
          )}

          <View style={styles.row}>
            <Input
              label="Prep Time (min)"
              placeholder="30"
              value={prepTime}
              onChangeText={setPrepTime}
              keyboardType="number-pad"
              style={styles.halfInput}
            />
            <Input
              label="Cook Time (min)"
              placeholder="45"
              value={cookTime}
              onChangeText={setCookTime}
              keyboardType="number-pad"
              style={styles.halfInput}
            />
          </View>

          <View style={styles.row}>
            <Input
              label="Servings"
              placeholder="4"
              value={servings}
              onChangeText={setServings}
              keyboardType="number-pad"
              style={styles.halfInput}
            />
            <View style={[styles.halfInput, styles.difficultyContainer]}>
              <Text style={styles.label}>Difficulty</Text>
              <View style={styles.difficultyButtons}>
                {["easy", "medium", "hard"].map((level) => (
                  <TouchableOpacity
                    key={level}
                    style={[
                      styles.difficultyButton,
                      difficulty === level && styles.selectedDifficulty,
                    ]}
                    onPress={() => setDifficulty(level as any)}
                  >
                    <Text
                      style={[
                        styles.difficultyButtonText,
                        difficulty === level && styles.selectedDifficultyText,
                      ]}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          <Text style={styles.label}>Region (Optional)</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.regionsContainer}
          >
            {regions.filter(r => r !== "All regions").map((r) => (
              <TouchableOpacity
                key={r}
                style={[
                  styles.regionButton,
                  region === r && styles.selectedRegion,
                ]}
                onPress={() => setRegion(region === r ? "" : r)}
              >
                <Text
                  style={[
                    styles.regionButtonText,
                    region === r && styles.selectedRegionText,
                  ]}
                >
                  {r}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.label}>Tags</Text>
          <View style={styles.tagsContainer}>
            {popularTags.map((tag) => (
              <TouchableOpacity
                key={tag}
                style={[
                  styles.tagButton,
                  selectedTags.includes(tag) && styles.selectedTag,
                ]}
                onPress={() => toggleTag(tag)}
              >
                <Text
                  style={[
                    styles.tagButtonText,
                    selectedTags.includes(tag) && styles.selectedTagText,
                  ]}
                >
                  {tag}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Ingredients</Text>
          {errors.ingredients && (
            <Text style={styles.errorText}>{errors.ingredients}</Text>
          )}

          {ingredients.map((ingredient, index) => (
            <View key={ingredient.id} style={styles.ingredientRow}>
              <View style={styles.ingredientInputs}>
                <Input
                  placeholder="Amount"
                  value={ingredient.amount}
                  onChangeText={(text) =>
                    updateIngredient(ingredient.id, "amount", text)
                  }
                  style={styles.amountInput}
                />
                <Input
                  placeholder="Unit (optional)"
                  value={ingredient.unit || ""}
                  onChangeText={(text) =>
                    updateIngredient(ingredient.id, "unit", text)
                  }
                  style={styles.unitInput}
                />
                <Input
                  placeholder="Ingredient name"
                  value={ingredient.name}
                  onChangeText={(text) =>
                    updateIngredient(ingredient.id, "name", text)
                  }
                  style={styles.nameInput}
                />
              </View>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeIngredient(ingredient.id)}
                disabled={ingredients.length === 1}
              >
                <X
                  size={20}
                  color={
                    ingredients.length === 1
                      ? "#DBDBDB"
                      : "#8E8E8E"
                  }
                />
              </TouchableOpacity>
            </View>
          ))}

          <TouchableOpacity
            style={styles.addButton}
            onPress={addIngredient}
          >
            <Plus size={20} color={"#0095F6"} />
            <Text style={styles.addButtonText}>Add Ingredient</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Instructions</Text>
          {errors.steps && (
            <Text style={styles.errorText}>{errors.steps}</Text>
          )}

          {steps.map((step, index) => (
            <View key={step.id} style={styles.stepContainer}>
              <View style={styles.stepHeader}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{index + 1}</Text>
                </View>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeStep(step.id)}
                  disabled={steps.length === 1}
                >
                  <X
                    size={20}
                    color={
                      steps.length === 1 ? "#DBDBDB" : "#8E8E8E"
                    }
                  />
                </TouchableOpacity>
              </View>
              <Input
                placeholder="Describe this step..."
                value={step.description}
                onChangeText={(text) => updateStep(step.id, text)}
                multiline
                numberOfLines={3}
              />
            </View>
          ))}

          <TouchableOpacity
            style={styles.addButton}
            onPress={addStep}
          >
            <Plus size={20} color={"#0095F6"} />
            <Text style={styles.addButtonText}>Add Step</Text>
          </TouchableOpacity>

          <View style={styles.submitContainer}>
            <Button
              title="Create Recipe"
              onPress={handleSubmit}
              loading={isSubmitting}
              fullWidth
            />
          </View>
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
  content: {
    padding: 20,
  },
  sectionTitle: {
    ...typography.heading2,
    marginBottom: 20,
  },
  label: {
    ...typography.bodySmall,
    fontWeight: "500",
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfInput: {
    width: "48%",
  },
  imagePicker: {
    height: 200,
    backgroundColor: "#EFEFEF",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#DBDBDB",
    borderStyle: "dashed",
  },
  imagePickerText: {
    ...typography.body,
    color: "#8E8E8E",
    marginTop: 12,
  },
  imagePreviewContainer: {
    marginBottom: 16,
    position: "relative",
  },
  imagePreview: {
    height: 200,
    width: "100%",
    borderRadius: 12,
  },
  changeImageButton: {
    position: "absolute",
    bottom: 12,
    right: 12,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  changeImageText: {
    ...typography.caption,
    color: "#FFFFFF",
  },
  difficultyContainer: {
    marginBottom: 16,
  },
  difficultyButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  difficultyButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "#EFEFEF",
    borderWidth: 1,
    borderColor: "#DBDBDB",
  },
  difficultyButtonText: {
    ...typography.bodySmall,
    color: "#262626",
  },
  selectedDifficulty: {
    backgroundColor: "#0095F6",
    borderColor: "#0095F6",
  },
  selectedDifficultyText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  regionsContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  regionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#EFEFEF",
    marginRight: 8,
    marginBottom: 8,
  },
  regionButtonText: {
    ...typography.caption,
    color: "#262626",
  },
  selectedRegion: {
    backgroundColor: "#0095F6",
  },
  selectedRegionText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  tagButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#EFEFEF",
    marginRight: 8,
    marginBottom: 8,
  },
  tagButtonText: {
    ...typography.caption,
    color: "#262626",
  },
  selectedTag: {
    backgroundColor: "#0095F6",
  },
  selectedTagText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "#DBDBDB",
    marginVertical: 24,
  },
  ingredientRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  ingredientInputs: {
    flex: 1,
    flexDirection: "row",
  },
  amountInput: {
    width: "25%",
    marginRight: 8,
    marginBottom: 0,
  },
  unitInput: {
    width: "25%",
    marginRight: 8,
    marginBottom: 0,
  },
  nameInput: {
    flex: 1,
    marginBottom: 0,
  },
  removeButton: {
    padding: 8,
    marginLeft: 8,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    backgroundColor: "#EFEFEF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#DBDBDB",
    borderStyle: "dashed",
  },
  addButtonText: {
    ...typography.body,
    color: "#0095F6",
    marginLeft: 8,
    fontWeight: "500",
  },
  stepContainer: {
    marginBottom: 16,
  },
  stepHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#0095F6",
    justifyContent: "center",
    alignItems: "center",
  },
  stepNumberText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  submitContainer: {
    marginTop: 32,
    marginBottom: 40,
  },
  errorText: {
    ...typography.caption,
    color: "#ED4956",
    marginBottom: 8,
  },
});