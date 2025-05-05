import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Bookmark,
  ChevronLeft,
  Clock,
  Edit,
  Heart,
  MessageCircle,
  MoreVertical,
  Send,
  Share2,
  Trash2,
  Users,
} from "lucide-react-native";
import React, { useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
// 
import CategoryPill from "@/components/CategoryPill";
import CommentItem from "@/components/CommentItem";
import StarRating from "@/components/StarRating";
import typography from "@/constants/typography";
import { useAuthStore } from "@/store/authStore";
import { useRecipeStore } from "@/store/recipeStore";

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { recipes, toggleLike, toggleSave, deleteRecipe, addComment, deleteComment, addRating } = useRecipeStore();
  const { user, isAuthenticated } = useAuthStore();
  const [showOptions, setShowOptions] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [showRating, setShowRating] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const recipe = recipes.find((r) => r.id === id);

  if (!recipe) {
    return (
      <View style={styles.notFound}>
        <Text style={typography.heading2}>Recipe not found</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isOwner = user?.id === recipe.authorId;
  const totalTime = recipe.prepTime + recipe.cookTime;
  const userRating = user ? recipe.ratings.find(r => r.userId === user.id)?.value : undefined;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this amazing recipe for ${recipe.title} on Ethiopian Recipe Share!`,
        title: recipe.title,
      });
    } catch (error) {
      console.error("Error sharing recipe:", error);
    }
  };

  const handleEdit = () => {
    setShowOptions(false);
    router.push(`/recipe/${recipe.id}/edit`);
  };

  const handleDelete = () => {
    setShowOptions(false);
    Alert.alert(
      "Delete Recipe",
      "Are you sure you want to delete this recipe? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => {
            deleteRecipe(recipe.id);
            router.back();
          },
          style: "destructive",
        },
      ]
    );
  };

  const handleSubmitComment = () => {
    if (!isAuthenticated) {
      Alert.alert("Sign In Required", "Please sign in to comment on recipes.");
      return;
    }

    if (newComment.trim()) {
      addComment(recipe.id, newComment.trim());
      setNewComment("");
    }
  };

  const handleDeleteComment = (commentId: string) => {
    Alert.alert(
      "Delete Comment",
      "Are you sure you want to delete this comment?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => deleteComment(recipe.id, commentId),
          style: "destructive",
        },
      ]
    );
  };

  const handleRateRecipe = (rating: number) => {
    if (!isAuthenticated) {
      Alert.alert("Sign In Required", "Please sign in to rate recipes.");
      return;
    }

    addRating(recipe.id, rating);
    setShowRating(false);
  };

  const toggleCommentsSection = () => {
    setShowComments(!showComments);
    if (!showComments) {
      // Scroll to comments section when opening
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
      keyboardVerticalOffset={100}
    >
      <ScrollView 
        ref={scrollViewRef}
        style={styles.container} 
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: recipe.imageUrl }}
            style={styles.image}
            contentFit="cover"
          />
          <LinearGradient
            colors={["rgba(0,0,0,0.7)", "transparent"]}
            style={styles.gradient}
          />
          <TouchableOpacity
            style={styles.backIconButton}
            onPress={() => router.back()}
          >
            <ChevronLeft size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.moreIconButton}
            onPress={() => setShowOptions(!showOptions)}
          >
            <MoreVertical size={24} color="white" />
          </TouchableOpacity>

          {showOptions && isOwner && (
            <View style={styles.optionsMenu}>
              <TouchableOpacity
                style={styles.optionItem}
                onPress={handleEdit}
              >
                <Edit size={20} color="#262626" />
                <Text style={styles.optionText}>Edit Recipe</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.optionItem}
                onPress={handleDelete}
              >
                <Trash2 size={20} color="#ED4956" />
                <Text style={[styles.optionText, { color: "#ED4956" }]}>
                  Delete Recipe
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>{recipe.title}</Text>
            <View style={styles.authorContainer}>
              <Image
                source={{ uri: recipe.authorAvatar }}
                style={styles.authorAvatar}
              />
              <Text style={styles.authorName}>{recipe.authorName}</Text>
            </View>
          </View>

          <View style={styles.ratingSection}>
            {(recipe.averageRating ?? 0) > 0 && (
              <View style={styles.ratingDisplay}>
                <StarRating rating={recipe.averageRating ?? 0} size={18} showLabel />
                <Text style={styles.ratingCount}>
                  ({recipe.ratings.length} {recipe.ratings.length === 1 ? "rating" : "ratings"})
                </Text>
              </View>
            )}
            
            <TouchableOpacity
              style={styles.rateButton}
              onPress={() => setShowRating(!showRating)}
            >
              <Text style={styles.rateButtonText}>
                {userRating ? "Update Rating" : "Rate Recipe"}
              </Text>
            </TouchableOpacity>
          </View>

          {showRating && (
            <View style={styles.ratingInputContainer}>
              <Text style={styles.ratingInputLabel}>Your Rating:</Text>
              <StarRating
                rating={userRating || 0}
                editable
                size={32}
                onRatingChange={handleRateRecipe}
                style={styles.ratingInput}
              />
            </View>
          )}

          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              <Clock size={16} color={"#8E8E8E"} />
              <Text style={styles.metaText}>{totalTime} min</Text>
            </View>
            <View style={styles.metaItem}>
              <Users size={16} color={"#8E8E8E"} />
              <Text style={styles.metaText}>{recipe.servings} servings</Text>
            </View>
            <View style={styles.metaDifficulty}>
              <Text style={styles.difficultyText}>{recipe.difficulty}</Text>
            </View>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => toggleLike(recipe.id)}
            >
              <Heart
                size={20}
                color={recipe.isLiked ? "#0095F6" : "#8E8E8E"}
                fill={recipe.isLiked ? "#0095F6" : "none"}
              />
              <Text
                style={[
                  styles.actionText,
                  recipe.isLiked && { color: "#0095F6" },
                ]}
              >
                {recipe.likes}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => toggleSave(recipe.id)}
            >
              <Bookmark
                size={20}
                color={recipe.isSaved ? "#8E8E8E" : "#8E8E8E"}
                fill={recipe.isSaved ? "#8E8E8E" : "none"}
              />
              <Text
                style={[
                  styles.actionText,
                  recipe.isSaved && { color: "#8E8E8E" },
                ]}
              >
                Save
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={toggleCommentsSection}
            >
              <MessageCircle
                size={20}
                color={showComments ? "#0095F6" : "#8E8E8E"}
                fill={showComments ? "#0095F6" : "none"}
              />
              <Text
                style={[
                  styles.actionText,
                  showComments && { color: "#0095F6" },
                ]}
              >
                {recipe.comments.length}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleShare}
            >
              <Share2 size={20} color={"#8E8E8E"} />
              <Text style={styles.actionText}>Share</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{recipe.description}</Text>
          </View>

          {recipe.region && (
            <View style={styles.regionContainer}>
              <Text style={styles.regionLabel}>Region:</Text>
              <Text style={styles.regionText}>{recipe.region}</Text>
            </View>
          )}

          <View style={styles.tagsContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tagsScrollContent}
            >
              {recipe.tags.map((tag) => (
                <CategoryPill
                  key={tag}
                  title={tag}
                  onPress={() => {}}
                  selected={false}
                />
              ))}
            </ScrollView>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ingredients</Text>
            {recipe.ingredients.map((ingredient) => (
              <View key={ingredient.id} style={styles.ingredientItem}>
                <View style={styles.bulletPoint} />
                <Text style={styles.ingredientText}>
                  {ingredient.amount} {ingredient.unit}{" "}
                  <Text style={{ fontWeight: "600" }}>{ingredient.name}</Text>
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Instructions</Text>
            {recipe.steps.map((step, index) => (
              <View key={step.id} style={styles.stepItem}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{index + 1}</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepText}>{step.description}</Text>
                  {step.imageUrl && (
                    <Image
                      source={{ uri: step.imageUrl }}
                      style={styles.stepImage}
                      contentFit="cover"
                    />
                  )}
                </View>
              </View>
            ))}
          </View>

          {showComments && (
            <View style={styles.commentsSection}>
              <Text style={styles.sectionTitle}>Comments</Text>
              
              <View style={styles.commentInputContainer}>
                <TextInput
                  style={styles.commentInput}
                  placeholder="Add a comment..."
                  value={newComment}
                  onChangeText={setNewComment}
                  multiline
                />
                <TouchableOpacity
                  style={[
                    styles.sendButton,
                    !newComment.trim() && styles.disabledSendButton,
                  ]}
                  onPress={handleSubmitComment}
                  disabled={!newComment.trim()}
                >
                  <Send size={20} color={"#FFFFFF"} />
                </TouchableOpacity>
              </View>
              
              {recipe.comments.length > 0 ? (
                recipe.comments.map((comment) => (
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                    onDelete={handleDeleteComment}
                  />
                ))
              ) : (
                <Text style={styles.noCommentsText}>
                  No comments yet. Be the first to comment!
                </Text>
              )}
            </View>
          )}
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
  imageContainer: {
    height: 300,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  gradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  backIconButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 20,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  moreIconButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 20,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  optionsMenu: {
    position: "absolute",
    top: Platform.OS === "ios" ? 100 : 70,
    right: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 8,
    elevation: 4,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  optionText: {
    ...typography.body,
    marginLeft: 12,
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    ...typography.heading1,
    marginBottom: 12,
  },
  authorContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  authorAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  authorName: {
    ...typography.body,
    fontWeight: "500",
  },
  ratingSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  ratingDisplay: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingCount: {
    ...typography.caption,
    color: "#8E8E8E",
    marginLeft: 8,
  },
  rateButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#EFEFEF",
    borderRadius: 16,
  },
  rateButtonText: {
    ...typography.caption,
    color: "#0095F6",
    fontWeight: "600",
  },
  ratingInputContainer: {
    backgroundColor: "#EFEFEF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: "center",
  },
  ratingInputLabel: {
    ...typography.bodySmall,
    marginBottom: 8,
  },
  ratingInput: {
    marginTop: 8,
  },
  metaContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  metaText: {
    ...typography.bodySmall,
    color: "#8E8E8E",
    marginLeft: 6,
  },
  metaDifficulty: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: "#FBAD50" + "33", // Adding transparency
    borderRadius: 12,
  },
  difficultyText: {
    ...typography.caption,
    color: "#FBAD50",
    fontWeight: "600",
    textTransform: "capitalize",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#DBDBDB",
    marginBottom: 24,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionText: {
    ...typography.bodySmall,
    marginLeft: 8,
    color: "#8E8E8E",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    ...typography.heading3,
    marginBottom: 16,
  },
  description: {
    ...typography.body,
    lineHeight: 24,
  },
  regionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  regionLabel: {
    ...typography.body,
    fontWeight: "600",
    marginRight: 8,
  },
  regionText: {
    ...typography.body,
  },
  tagsContainer: {
    marginBottom: 24,
  },
  tagsScrollContent: {
    paddingBottom: 8,
  },
  ingredientItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  bulletPoint: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#0095F6",
    marginRight: 12,
  },
  ingredientText: {
    ...typography.body,
    flex: 1,
  },
  stepItem: {
    flexDirection: "row",
    marginBottom: 20,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#0095F6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    marginTop: 4,
  },
  stepNumberText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  stepContent: {
    flex: 1,
  },
  stepText: {
    ...typography.body,
    marginBottom: 12,
  },
  stepImage: {
    width: "100%",
    height: 180,
    borderRadius: 8,
    marginTop: 8,
  },
  commentsSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#DBDBDB",
  },
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  commentInput: {
    flex: 1,
    backgroundColor: "#EFEFEF",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
    ...typography.body,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#0095F6",
    justifyContent: "center",
    alignItems: "center",
  },
  disabledSendButton: {
    backgroundColor: "#8E8E8E",
    opacity: 0.5,
  },
  noCommentsText: {
    ...typography.body,
    color: "#8E8E8E",
    textAlign: "center",
    padding: 20,
  },
});