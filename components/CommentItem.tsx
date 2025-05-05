import typography from "@/constants/typography";
import { useAuthStore } from "@/store/authStore";
import { Comment } from "@/types/recipe";
import { Image } from "expo-image";
import { Trash2 } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface CommentItemProps {
  comment: Comment;
  onDelete?: (commentId: string) => void;
}

export default function CommentItem({ comment, onDelete }: CommentItemProps) {
  const { user } = useAuthStore();
  const isOwner = user?.id === comment.userId;
  
  // Format date to a readable string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: comment.userAvatar }}
        style={styles.avatar}
        contentFit="cover"
      />
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.userName}>{comment.userName}</Text>
          <Text style={styles.date}>{formatDate(comment.createdAt)}</Text>
        </View>
        <Text style={styles.commentText}>{comment.text}</Text>
      </View>
      
      {isOwner && onDelete && (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => onDelete(comment.id)}
        >
          <Trash2 size={16} color={"#ED4956"} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#F9F9F9",
    borderRadius: 12,
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  userName: {
    ...typography.bodySmall,
    fontWeight: "600",
  },
  date: {
    ...typography.caption,
    color: "#8E8E8E",
  },
  commentText: {
    ...typography.body,
  },
  deleteButton: {
    padding: 8,
  },
});