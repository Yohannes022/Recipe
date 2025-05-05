import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowLeft,
  Camera,
  ChevronRight,
  Clock,
  Edit2,
  Globe,
  Mail,
  MapPin,
  Phone,
  Plus,
  Store,
  Trash2,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
// 
import Button from "@/components/Button";
import Input from "@/components/Input";
import typography from "@/constants/typography";
import { useRecipeStore } from "@/store/recipeStore";
import { useRestaurantStore } from "@/store/restaurantStore";

export default function ManageRestaurantScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { 
    getRestaurantById, 
    updateRestaurant,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    addMenuCategory,
    updateMenuCategory,
    deleteMenuCategory
  } = useRestaurantStore();
  const { getRestaurantRecipes } = useRecipeStore();
  
  const restaurant = getRestaurantById(id);
  const restaurantRecipes = getRestaurantRecipes(id);
  
  const [activeTab, setActiveTab] = useState<"info" | "menu" | "recipes">("info");
  const [isEditing, setIsEditing] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  
  // Form state for restaurant info
  const [name, setName] = useState(restaurant?.name || "");
  const [description, setDescription] = useState(restaurant?.description || "");
  const [location, setLocation] = useState(restaurant?.location || "");
  const [phone, setPhone] = useState(restaurant?.phone || "");
  const [email, setEmail] = useState(restaurant?.email || "");
  const [website, setWebsite] = useState(restaurant?.website || "");
  const [openingHours, setOpeningHours] = useState(restaurant?.openingHours || "");
  const [logo, setLogo] = useState(restaurant?.logo || "");
  const [coverImage, setCoverImage] = useState(restaurant?.coverImage || "");

  if (!restaurant) {
    return (
      <View style={styles.notFound}>
        <Text style={typography.heading2}>Restaurant not found</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const pickLogo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setLogo(result.assets[0].uri);
    }
  };

  const pickCoverImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled) {
      setCoverImage(result.assets[0].uri);
    }
  };

  const handleSaveInfo = () => {
    if (!name.trim() || !location.trim() || !phone.trim()) {
      Alert.alert("Error", "Name, location and phone are required");
      return;
    }

    updateRestaurant(id, {
      name,
      description,
      location,
      phone,
      email,
      website,
      openingHours,
      logo,
      coverImage,
    });

    Alert.alert("Success", "Restaurant information updated successfully");
    setIsEditing(false);
  };

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      addMenuCategory(id, newCategoryName.trim());
      setNewCategoryName("");
      setEditingCategory(null);
    }
  };

  const handleUpdateCategory = (categoryId: string, name: string) => {
    if (name.trim()) {
      updateMenuCategory(id, categoryId, name.trim());
      setEditingCategory(null);
    }
  };

  const handleDeleteCategory = (categoryId: string) => {
    Alert.alert(
      "Delete Category",
      "Are you sure you want to delete this category? All menu items in this category will also be deleted.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => {
            deleteMenuCategory(id, categoryId);
          },
          style: "destructive",
        },
      ]
    );
  };

  const handleAddMenuItem = (categoryId: string) => {
    router.push(`/restaurant/${id}/add-menu-item?categoryId=${categoryId}`);
  };

  const handleEditMenuItem = (categoryId: string, itemId: string) => {
    router.push(`/restaurant/${id}/edit-menu-item?categoryId=${categoryId}&itemId=${itemId}`);
  };

  const handleDeleteMenuItem = (categoryId: string, itemId: string) => {
    Alert.alert(
      "Delete Menu Item",
      "Are you sure you want to delete this menu item?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => {
            deleteMenuItem(id, categoryId, itemId);
          },
          style: "destructive",
        },
      ]
    );
  };

  const handleAddRecipe = () => {
    router.push("/create-recipe");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={"#262626"} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Restaurant</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "info" && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab("info")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "info" && styles.activeTabText,
            ]}
          >
            Information
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "menu" && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab("menu")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "menu" && styles.activeTabText,
            ]}
          >
            Menu
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "recipes" && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab("recipes")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "recipes" && styles.activeTabText,
            ]}
          >
            Recipes
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === "info" && (
          <View style={styles.infoContainer}>
            {!isEditing ? (
              <>
                <View style={styles.restaurantHeader}>
                  <Image
                    source={{ uri: restaurant.logo }}
                    style={styles.logo}
                    contentFit="cover"
                  />
                  <View style={styles.restaurantInfo}>
                    <Text style={styles.restaurantName}>{restaurant.name}</Text>
                    <Text style={styles.restaurantLocation}>{restaurant.location}</Text>
                  </View>
                </View>

                <View style={styles.infoSection}>
                  <View style={styles.infoItem}>
                    <Store size={20} color={"#0095F6"} />
                    <Text style={styles.infoLabel}>Description:</Text>
                    <Text style={styles.infoValue}>{restaurant.description}</Text>
                  </View>
                  
                  <View style={styles.infoItem}>
                    <MapPin size={20} color={"#0095F6"} />
                    <Text style={styles.infoLabel}>Location:</Text>
                    <Text style={styles.infoValue}>{restaurant.location}</Text>
                  </View>
                  
                  <View style={styles.infoItem}>
                    <Phone size={20} color={"#0095F6"} />
                    <Text style={styles.infoLabel}>Phone:</Text>
                    <Text style={styles.infoValue}>{restaurant.phone}</Text>
                  </View>
                  
                  {restaurant.email && (
                    <View style={styles.infoItem}>
                      <Mail size={20} color={"#0095F6"} />
                      <Text style={styles.infoLabel}>Email:</Text>
                      <Text style={styles.infoValue}>{restaurant.email}</Text>
                    </View>
                  )}
                  
                  {restaurant.website && (
                    <View style={styles.infoItem}>
                      <Globe size={20} color={"#0095F6"} />
                      <Text style={styles.infoLabel}>Website:</Text>
                      <Text style={styles.infoValue}>{restaurant.website}</Text>
                    </View>
                  )}
                  
                  {restaurant.openingHours && (
                    <View style={styles.infoItem}>
                      <Clock size={20} color={"#0095F6"} />
                      <Text style={styles.infoLabel}>Hours:</Text>
                      <Text style={styles.infoValue}>{restaurant.openingHours}</Text>
                    </View>
                  )}
                </View>

                <Button
                  title="Edit Information"
                  onPress={() => setIsEditing(true)}
                  variant="primary"
                  icon={<Edit2 size={16} color={"#FFFFFF"} />}
                  style={styles.editButton}
                />
              </>
            ) : (
              <View style={styles.editForm}>
                <Text style={styles.formTitle}>Edit Restaurant Information</Text>
                
                <View style={styles.imageSection}>
                  <View style={styles.logoSection}>
                    <Text style={styles.imageLabel}>Logo</Text>
                    {logo ? (
                      <TouchableOpacity onPress={pickLogo}>
                        <Image
                          source={{ uri: logo }}
                          style={styles.logoPreview}
                          contentFit="cover"
                        />
                        <View style={styles.editImageOverlay}>
                          <Camera size={20} color={"#FFFFFF"} />
                        </View>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={styles.imagePicker}
                        onPress={pickLogo}
                      >
                        <Camera size={24} color={"#8E8E8E"} />
                        <Text style={styles.imagePickerText}>Add Logo</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                  
                  <View style={styles.coverSection}>
                    <Text style={styles.imageLabel}>Cover Image</Text>
                    {coverImage ? (
                      <TouchableOpacity onPress={pickCoverImage}>
                        <Image
                          source={{ uri: coverImage }}
                          style={styles.coverPreview}
                          contentFit="cover"
                        />
                        <View style={styles.editImageOverlay}>
                          <Camera size={20} color={"#FFFFFF"} />
                        </View>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={styles.coverPicker}
                        onPress={pickCoverImage}
                      >
                        <Camera size={24} color={"#8E8E8E"} />
                        <Text style={styles.imagePickerText}>Add Cover Image</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
                
                <Input
                  label="Restaurant Name"
                  placeholder="Enter restaurant name"
                  value={name}
                  onChangeText={setName}
                />
                
                <Input
                  label="Description"
                  placeholder="Describe your restaurant"
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={4}
                />
                
                <Input
                  label="Location"
                  placeholder="Enter restaurant address"
                  value={location}
                  onChangeText={setLocation}
                />
                
                <Input
                  label="Phone Number"
                  placeholder="+251 91 234 5678"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />
                
                <Input
                  label="Email (Optional)"
                  placeholder="restaurant@example.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                />
                
                <Input
                  label="Website (Optional)"
                  placeholder="www.restaurant.com"
                  value={website}
                  onChangeText={setWebsite}
                />
                
                <Input
                  label="Opening Hours (Optional)"
                  placeholder="Mon-Sun: 10:00 AM - 10:00 PM"
                  value={openingHours}
                  onChangeText={setOpeningHours}
                />
                
                <View style={styles.formButtons}>
                  <Button
                    title="Cancel"
                    onPress={() => setIsEditing(false)}
                    variant="outline"
                    style={styles.formButton}
                  />
                  <Button
                    title="Save"
                    onPress={handleSaveInfo}
                    variant="primary"
                    style={styles.formButton}
                  />
                </View>
              </View>
            )}
          </View>
        )}

        {activeTab === "menu" && (
          <View style={styles.menuContainer}>
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>Menu Categories</Text>
              <Button
                title="Add Category"
                variant="primary"
                size="small"
                icon={<Plus size={16} color={"#FFFFFF"} />}
                onPress={() => setEditingCategory("new")}
              />
            </View>

            {editingCategory === "new" && (
              <View style={styles.categoryEditContainer}>
                <Input
                  placeholder="Category name"
                  value={newCategoryName}
                  onChangeText={setNewCategoryName}
                  style={styles.categoryInput}
                />
                <View style={styles.categoryEditButtons}>
                  <Button
                    title="Cancel"
                    variant="outline"
                    size="small"
                    onPress={() => {
                      setEditingCategory(null);
                      setNewCategoryName("");
                    }}
                    style={styles.categoryEditButton}
                  />
                  <Button
                    title="Add"
                    variant="primary"
                    size="small"
                    onPress={handleAddCategory}
                    style={styles.categoryEditButton}
                  />
                </View>
              </View>
            )}

            {restaurant.menuCategories.map((category) => (
              <View key={category.id} style={styles.categoryContainer}>
                <View style={styles.categoryHeader}>
                  {editingCategory === category.id ? (
                    <View style={styles.categoryEditContainer}>
                      <Input
                        placeholder="Category name"
                        value={newCategoryName}
                        onChangeText={setNewCategoryName}
                        style={styles.categoryInput}
                      />
                      <View style={styles.categoryEditButtons}>
                        <Button
                          title="Cancel"
                          variant="outline"
                          size="small"
                          onPress={() => {
                            setEditingCategory(null);
                            setNewCategoryName("");
                          }}
                          style={styles.categoryEditButton}
                        />
                        <Button
                          title="Save"
                          variant="primary"
                          size="small"
                          onPress={() => handleUpdateCategory(category.id, newCategoryName)}
                          style={styles.categoryEditButton}
                        />
                      </View>
                    </View>
                  ) : (
                    <>
                      <Text style={styles.categoryName}>{category.name}</Text>
                      <View style={styles.categoryActions}>
                        <TouchableOpacity
                          style={styles.categoryAction}
                          onPress={() => {
                            setEditingCategory(category.id);
                            setNewCategoryName(category.name);
                          }}
                        >
                          <Edit2 size={16} color={"#0095F6"} />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.categoryAction}
                          onPress={() => handleDeleteCategory(category.id)}
                        >
                          <Trash2 size={16} color={"#ED4956"} />
                        </TouchableOpacity>
                      </View>
                    </>
                  )}
                </View>

                {category.items.map((item) => (
                  <View key={item.id} style={styles.menuItem}>
                    {item.imageUrl && (
                      <Image
                        source={{ uri: item.imageUrl }}
                        style={styles.menuItemImage}
                        contentFit="cover"
                      />
                    )}
                    <View style={styles.menuItemContent}>
                      <View style={styles.menuItemHeader}>
                        <Text style={styles.menuItemName}>{item.name}</Text>
                        <Text style={styles.menuItemPrice}>{item.price}</Text>
                      </View>
                      <Text style={styles.menuItemDescription}>
                        {item.description}
                      </Text>
                    </View>
                    <View style={styles.menuItemActions}>
                      <TouchableOpacity
                        style={styles.menuItemAction}
                        onPress={() => handleEditMenuItem(category.id, item.id)}
                      >
                        <Edit2 size={16} color={"#0095F6"} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.menuItemAction}
                        onPress={() => handleDeleteMenuItem(category.id, item.id)}
                      >
                        <Trash2 size={16} color={"#ED4956"} />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}

                <Button
                  title="Add Menu Item"
                  variant="outline"
                  size="small"
                  icon={<Plus size={16} color={"#0095F6"} />}
                  onPress={() => handleAddMenuItem(category.id)}
                  style={styles.addItemButton}
                />
              </View>
            ))}
          </View>
        )}

        {activeTab === "recipes" && (
          <View style={styles.recipesContainer}>
            <View style={styles.recipesHeader}>
              <Text style={styles.recipesTitle}>Restaurant Recipes</Text>
              <Button
                title="Add Recipe"
                variant="primary"
                size="small"
                icon={<Plus size={16} color={"#FFFFFF"} />}
                onPress={handleAddRecipe}
              />
            </View>

            {restaurantRecipes.length > 0 ? (
              restaurantRecipes.map((recipe) => (
                <TouchableOpacity
                  key={recipe.id}
                  style={styles.recipeItem}
                  onPress={() => router.push(`/recipe/${recipe.id}`)}
                >
                  <Image
                    source={{ uri: recipe.imageUrl }}
                    style={styles.recipeImage}
                    contentFit="cover"
                  />
                  <View style={styles.recipeContent}>
                    <Text style={styles.recipeTitle}>{recipe.title}</Text>
                    <Text style={styles.recipeDescription} numberOfLines={2}>
                      {recipe.description}
                    </Text>
                  </View>
                  <ChevronRight size={20} color={"#8E8E8E"} />
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateTitle}>No recipes yet</Text>
                <Text style={styles.emptyStateText}>
                  Add recipes to showcase your restaurant's specialties
                </Text>
                <Button
                  title="Add Recipe"
                  variant="primary"
                  onPress={handleAddRecipe}
                  style={styles.emptyStateButton}
                />
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
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
    padding: 8,
  },
  backButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
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
  headerTitle: {
    ...typography.heading3,
  },
  placeholder: {
    width: 40,
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#DBDBDB",
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 16,
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: "#0095F6",
  },
  tabText: {
    ...typography.bodySmall,
    color: "#8E8E8E",
  },
  activeTabText: {
    color: "#0095F6",
    fontWeight: "600",
  },
  content: {
    flex: 1,
  },
  infoContainer: {
    padding: 20,
  },
  restaurantHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  restaurantInfo: {
    flex: 1,
  },
  restaurantName: {
    ...typography.heading3,
    marginBottom: 4,
  },
  restaurantLocation: {
    ...typography.bodySmall,
    color: "#8E8E8E",
  },
  infoSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  infoLabel: {
    ...typography.bodySmall,
    fontWeight: "600",
    marginLeft: 8,
    marginRight: 4,
    width: 80,
  },
  infoValue: {
    ...typography.body,
    flex: 1,
  },
  editButton: {
    marginTop: 8,
  },
  editForm: {
    marginBottom: 40,
  },
  formTitle: {
    ...typography.heading3,
    marginBottom: 20,
  },
  imageSection: {
    marginBottom: 20,
  },
  logoSection: {
    marginBottom: 16,
  },
  coverSection: {
    marginBottom: 16,
  },
  imageLabel: {
    ...typography.bodySmall,
    fontWeight: "500",
    marginBottom: 8,
  },
  logoPreview: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  coverPreview: {
    width: "100%",
    height: 150,
    borderRadius: 12,
  },
  editImageOverlay: {
    position: "absolute",
    right: 10,
    bottom: 10,
    backgroundColor: "rgba(0,0,0,0.6)",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  imagePicker: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#EFEFEF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#DBDBDB",
    borderStyle: "dashed",
  },
  coverPicker: {
    width: "100%",
    height: 150,
    borderRadius: 12,
    backgroundColor: "#EFEFEF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#DBDBDB",
    borderStyle: "dashed",
  },
  imagePickerText: {
    ...typography.caption,
    color: "#8E8E8E",
    marginTop: 8,
  },
  formButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  formButton: {
    width: "48%",
  },
  menuContainer: {
    padding: 20,
  },
  menuHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  menuTitle: {
    ...typography.heading3,
  },
  categoryContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  categoryName: {
    ...typography.heading4,
  },
  categoryActions: {
    flexDirection: "row",
  },
  categoryAction: {
    padding: 8,
    marginLeft: 8,
  },
  categoryEditContainer: {
    marginBottom: 16,
  },
  categoryInput: {
    marginBottom: 8,
  },
  categoryEditButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  categoryEditButton: {
    marginLeft: 8,
  },
  menuItem: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#DBDBDB",
    paddingBottom: 16,
    marginBottom: 16,
  },
  menuItemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  menuItemName: {
    ...typography.bodySmall,
    fontWeight: "600",
  },
  menuItemPrice: {
    ...typography.bodySmall,
    color: "#0095F6",
  },
  menuItemDescription: {
    ...typography.caption,
    color: "#8E8E8E",
  },
  menuItemActions: {
    justifyContent: "center",
  },
  menuItemAction: {
    padding: 8,
  },
  addItemButton: {
    alignSelf: "flex-start",
  },
  recipesContainer: {
    padding: 20,
  },
  recipesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  recipesTitle: {
    ...typography.heading3,
  },
  recipeItem: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  recipeImage: {
    width: 80,
    height: 80,
  },
  recipeContent: {
    flex: 1,
    padding: 12,
  },
  recipeTitle: {
    ...typography.bodySmall,
    fontWeight: "600",
    marginBottom: 4,
  },
  recipeDescription: {
    ...typography.caption,
    color: "#8E8E8E",
  },
  emptyState: {
    alignItems: "center",
    padding: 40,
  },
  emptyStateTitle: {
    ...typography.heading3,
    marginBottom: 8,
  },
  emptyStateText: {
    ...typography.body,
    color: "#8E8E8E",
    textAlign: "center",
    marginBottom: 24,
  },
  emptyStateButton: {
    width: 200,
  },
});