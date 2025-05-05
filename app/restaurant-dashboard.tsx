/**
 * Restaurant dashboard for restaurant owners
 * Allows management of menu, orders, and restaurant information
 * Provides analytics and tools for restaurant operations
 */

import Button from "@/components/Button";
import typography from "@/constants/typography";
import { useAuthStore } from "@/store/authStore";
import { useRestaurantStore } from "@/store/restaurantStore";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import {
    ChevronRight,
    Clock,
    Edit,
    Menu,
    Package,
    Settings,
    Star,
    Store
} from "lucide-react-native";
import React, { useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

// Tab types for dashboard navigation
type DashboardTab = "overview" | "menu" | "orders" | "settings";

export default function RestaurantDashboardScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { restaurants, menuItems, reviews } = useRestaurantStore();
  
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");
  
  // Get restaurant data for the current user
  // In a real app, this would filter by the user's restaurant ID
  const restaurant = restaurants[0];
  const restaurantMenuItems = menuItems.filter(
    (item) => item.restaurantId === restaurant.id
  );
  const restaurantReviews = reviews.filter(
    (review) => review.restaurantId === restaurant.id
  );
  
  // Mock orders data for demonstration
  const orders = [
    {
      id: "order-1",
      customerName: "Abebe Kebede",
      items: [
        { name: "Doro Wat", quantity: 2 },
        { name: "Injera", quantity: 4 },
      ],
      total: 450,
      status: "pending",
      createdAt: new Date().toISOString(),
    },
    {
      id: "order-2",
      customerName: "Tigist Haile",
      items: [
        { name: "Kitfo", quantity: 1 },
        { name: "Special Tibs", quantity: 1 },
      ],
      total: 380,
      status: "preparing",
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: "order-3",
      customerName: "Dawit Mekonnen",
      items: [
        { name: "Vegetarian Combo", quantity: 1 },
      ],
      total: 220,
      status: "completed",
      createdAt: new Date(Date.now() - 7200000).toISOString(),
    },
  ];
  
  /**
   * Handle adding a new menu item
   * In a real app, this would navigate to a form
   */
  const handleAddMenuItem = () => {
    Alert.alert("Add Menu Item", "This feature is coming soon!");
  };
  
  /**
   * Handle editing an existing menu item
   * @param menuItemId - ID of the menu item to edit
   */
  const handleEditMenuItem = (menuItemId: string) => {
    Alert.alert("Edit Menu Item", "This feature is coming soon!");
  };
  
  /**
   * Handle updating an order's status
   * @param orderId - ID of the order to update
   * @param newStatus - New status to set
   */
  const handleUpdateOrderStatus = (orderId: string, newStatus: string) => {
    Alert.alert("Update Order Status", "This feature is coming soon!");
  };
  
  /**
   * Handle logout with confirmation
   */
  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout",
          onPress: logout,
          style: "destructive"
        }
      ]
    );
  };
  
  if (!restaurant) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Restaurant Dashboard</Text>
        <Text style={styles.errorText}>Restaurant not found</Text>
        <Button
          title="Logout"
          onPress={handleLogout}
          variant="outline"
          style={styles.logoutButton}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Restaurant header with basic info */}
      <View style={styles.header}>
        <View style={styles.restaurantInfo}>
          <Image
            source={{ uri: restaurant.imageUrl }}
            style={styles.restaurantImage}
            contentFit="cover"
          />
          <View style={styles.restaurantDetails}>
            <Text style={styles.restaurantName}>{restaurant.name}</Text>
            <View style={styles.ratingContainer}>
              <Star size={16} color={"#8E8E8E"} fill={"#8E8E8E"} />
              <Text style={styles.rating}>{restaurant.rating}</Text>
              <Text style={styles.reviewCount}>({restaurant.reviewCount} reviews)</Text>
            </View>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>
                {restaurant.isOpen ? "Open" : "Closed"}
              </Text>
            </View>
          </View>
        </View>
      </View>
      
      {/* Tab navigation */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "overview" && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab("overview")}
        >
          <Store
            size={20}
            color={activeTab === "overview" ? "#0095F6" : "#8E8E8E"}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "overview" && styles.activeTabText,
            ]}
          >
            Overview
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "menu" && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab("menu")}
        >
          <Menu
            size={20}
            color={activeTab === "menu" ? "#0095F6" : "#8E8E8E"}
          />
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
            activeTab === "orders" && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab("orders")}
        >
          <Package
            size={20}
            color={activeTab === "orders" ? "#0095F6" : "#8E8E8E"}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "orders" && styles.activeTabText,
            ]}
          >
            Orders
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "settings" && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab("settings")}
        >
          <Settings
            size={20}
            color={activeTab === "settings" ? "#0095F6" : "#8E8E8E"}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "settings" && styles.activeTabText,
            ]}
          >
            Settings
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content}>
        {/* Overview tab content */}
        {activeTab === "overview" && (
          <View style={styles.overviewContainer}>
            {/* Stats cards */}
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{orders.length}</Text>
                <Text style={styles.statLabel}>Active Orders</Text>
              </View>
              
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{restaurantMenuItems.length}</Text>
                <Text style={styles.statLabel}>Menu Items</Text>
              </View>
              
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{restaurant.rating}</Text>
                <Text style={styles.statLabel}>Rating</Text>
              </View>
            </View>
            
            {/* Recent orders section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent Orders</Text>
                <TouchableOpacity onPress={() => setActiveTab("orders")}>
                  <Text style={styles.sectionLink}>View All</Text>
                </TouchableOpacity>
              </View>
              
              {orders.slice(0, 3).map((order) => (
                <View key={order.id} style={styles.orderCard}>
                  <View style={styles.orderHeader}>
                    <Text style={styles.orderNumber}>Order #{order.id.slice(-4)}</Text>
                    <View
                      style={[
                        styles.orderStatusBadge,
                        order.status === "pending" && styles.pendingBadge,
                        order.status === "preparing" && styles.preparingBadge,
                        order.status === "completed" && styles.completedBadge,
                      ]}
                    >
                      <Text style={styles.orderStatusText}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Text>
                    </View>
                  </View>
                  
                  <Text style={styles.customerName}>{order.customerName}</Text>
                  
                  <View style={styles.orderItems}>
                    {order.items.map((item, index) => (
                      <Text key={index} style={styles.orderItem}>
                        {item.quantity}x {item.name}
                      </Text>
                    ))}
                  </View>
                  
                  <View style={styles.orderFooter}>
                    <Text style={styles.orderTotal}>{order.total} ETB</Text>
                    <TouchableOpacity
                      style={styles.updateButton}
                      onPress={() => handleUpdateOrderStatus(order.id, "next")}
                    >
                      <Text style={styles.updateButtonText}>Update Status</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
            
            {/* Popular items section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Popular Items</Text>
                <TouchableOpacity onPress={() => setActiveTab("menu")}>
                  <Text style={styles.sectionLink}>View All</Text>
                </TouchableOpacity>
              </View>
              
              {restaurantMenuItems.slice(0, 3).map((item) => (
                <View key={item.id} style={styles.menuItemCard}>
                  <Image
                    source={{ uri: item.imageUrl }}
                    style={styles.menuItemImage}
                    contentFit="cover"
                  />
                  <View style={styles.menuItemInfo}>
                    <Text style={styles.menuItemName}>{item.name}</Text>
                    <Text style={styles.menuItemDescription} numberOfLines={2}>
                      {item.description}
                    </Text>
                    <Text style={styles.menuItemPrice}>{item.price} ETB</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}
        
        {/* Menu tab content */}
        {activeTab === "menu" && (
          <View style={styles.menuContainer}>
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>Menu Items</Text>
              <Button
                title="Add Item"
                onPress={handleAddMenuItem}
                variant="primary"
              />
            </View>
            
            {/* Menu items list */}
            {restaurantMenuItems.map((item) => (
              <View key={item.id} style={styles.menuItemCard}>
                <Image
                  source={{ uri: item.imageUrl }}
                  style={styles.menuItemImage}
                  contentFit="cover"
                />
                <View style={styles.menuItemInfo}>
                  <Text style={styles.menuItemName}>{item.name}</Text>
                  <Text style={styles.menuItemDescription} numberOfLines={2}>
                    {item.description}
                  </Text>
                  <Text style={styles.menuItemPrice}>{item.price} ETB</Text>
                </View>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => handleEditMenuItem(item.id)}
                >
                  <Edit size={20} color={"#0095F6"} />
                </TouchableOpacity>
              </View>
            ))}
            
            {/* Empty state for no menu items */}
            {restaurantMenuItems.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateTitle}>No Menu Items</Text>
                <Text style={styles.emptyStateText}>
                  Add your first menu item to get started
                </Text>
                <Button
                  title="Add Item"
                  onPress={handleAddMenuItem}
                  variant="primary"
                  style={styles.emptyStateButton}
                />
              </View>
            )}
          </View>
        )}
        
        {/* Orders tab content */}
        {activeTab === "orders" && (
          <View style={styles.ordersContainer}>
            {/* Order status tabs */}
            <View style={styles.orderTabs}>
              <TouchableOpacity style={[styles.orderTab, styles.activeOrderTab]}>
                <Text style={styles.activeOrderTabText}>Active</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.orderTab}>
                <Text style={styles.orderTabText}>Completed</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.orderTab}>
                <Text style={styles.orderTabText}>Cancelled</Text>
              </TouchableOpacity>
            </View>
            
            {/* Orders list */}
            {orders.map((order) => (
              <View key={order.id} style={styles.orderCard}>
                <View style={styles.orderHeader}>
                  <Text style={styles.orderNumber}>Order #{order.id.slice(-4)}</Text>
                  <View
                    style={[
                      styles.orderStatusBadge,
                      order.status === "pending" && styles.pendingBadge,
                      order.status === "preparing" && styles.preparingBadge,
                      order.status === "completed" && styles.completedBadge,
                    ]}
                  >
                    <Text style={styles.orderStatusText}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Text>
                  </View>
                </View>
                
                <Text style={styles.customerName}>{order.customerName}</Text>
                
                <View style={styles.orderItems}>
                  {order.items.map((item, index) => (
                    <Text key={index} style={styles.orderItem}>
                      {item.quantity}x {item.name}
                    </Text>
                  ))}
                </View>
                
                <View style={styles.orderMeta}>
                  <View style={styles.orderMetaItem}>
                    <Clock size={16} color={"#8E8E8E"} />
                    <Text style={styles.orderMetaText}>
                      {new Date(order.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.orderFooter}>
                  <Text style={styles.orderTotal}>{order.total} ETB</Text>
                  <View style={styles.orderActions}>
                    {/* Action buttons based on order status */}
                    {order.status === "pending" && (
                      <>
                        <TouchableOpacity
                          style={[styles.actionButton, styles.acceptButton]}
                          onPress={() => handleUpdateOrderStatus(order.id, "preparing")}
                        >
                          <Text style={styles.actionButtonText}>Accept</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.actionButton, styles.rejectButton]}
                          onPress={() => handleUpdateOrderStatus(order.id, "cancelled")}
                        >
                          <Text style={[styles.actionButtonText, styles.rejectButtonText]}>
                            Reject
                          </Text>
                        </TouchableOpacity>
                      </>
                    )}
                    
                    {order.status === "preparing" && (
                      <TouchableOpacity
                        style={[styles.actionButton, styles.completeButton]}
                        onPress={() => handleUpdateOrderStatus(order.id, "completed")}
                      >
                        <Text style={styles.actionButtonText}>Mark Ready</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            ))}
            
            {/* Empty state for no orders */}
            {orders.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateTitle}>No Active Orders</Text>
                <Text style={styles.emptyStateText}>
                  New orders will appear here
                </Text>
              </View>
            )}
          </View>
        )}
        
        {/* Settings tab content */}
        {activeTab === "settings" && (
          <View style={styles.settingsContainer}>
            {/* Restaurant information settings */}
            <View style={styles.settingSection}>
              <Text style={styles.settingSectionTitle}>Restaurant Information</Text>
              <TouchableOpacity style={styles.settingItem}>
                <View style={styles.settingItemContent}>
                  <Text style={styles.settingItemTitle}>Edit Profile</Text>
                  <Text style={styles.settingItemDescription}>
                    Update restaurant name, description, and photos
                  </Text>
                </View>
                <ChevronRight size={20} color={"#8E8E8E"} />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.settingItem}>
                <View style={styles.settingItemContent}>
                  <Text style={styles.settingItemTitle}>Business Hours</Text>
                  <Text style={styles.settingItemDescription}>
                    Set your opening and closing times
                  </Text>
                </View>
                <ChevronRight size={20} color={"#8E8E8E"} />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.settingItem}>
                <View style={styles.settingItemContent}>
                  <Text style={styles.settingItemTitle}>Location & Delivery Area</Text>
                  <Text style={styles.settingItemDescription}>
                    Update your address and delivery radius
                  </Text>
                </View>
                <ChevronRight size={20} color={"#8E8E8E"} />
              </TouchableOpacity>
            </View>
            
            {/* Menu settings */}
            <View style={styles.settingSection}>
              <Text style={styles.settingSectionTitle}>Menu Settings</Text>
              <TouchableOpacity style={styles.settingItem}>
                <View style={styles.settingItemContent}>
                  <Text style={styles.settingItemTitle}>Categories</Text>
                  <Text style={styles.settingItemDescription}>
                    Manage your menu categories
                  </Text>
                </View>
                <ChevronRight size={20} color={"#8E8E8E"} />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.settingItem}>
                <View style={styles.settingItemContent}>
                  <Text style={styles.settingItemTitle}>Special Offers</Text>
                  <Text style={styles.settingItemDescription}>
                    Create discounts and promotions
                  </Text>
                </View>
                <ChevronRight size={20} color={"#8E8E8E"} />
              </TouchableOpacity>
            </View>
            
            {/* Account settings */}
            <View style={styles.settingSection}>
              <Text style={styles.settingSectionTitle}>Account</Text>
              <TouchableOpacity style={styles.settingItem}>
                <View style={styles.settingItemContent}>
                  <Text style={styles.settingItemTitle}>Payment Settings</Text>
                  <Text style={styles.settingItemDescription}>
                    Manage your payment methods and bank account
                  </Text>
                </View>
                <ChevronRight size={20} color={"#8E8E8E"} />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.settingItem}>
                <View style={styles.settingItemContent}>
                  <Text style={styles.settingItemTitle}>Notifications</Text>
                  <Text style={styles.settingItemDescription}>
                    Customize your notification preferences
                  </Text>
                </View>
                <ChevronRight size={20} color={"#8E8E8E"} />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.settingItem, styles.logoutItem]}
                onPress={handleLogout}
              >
                <Text style={styles.logoutText}>Logout</Text>
              </TouchableOpacity>
            </View>
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
  header: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#DBDBDB",
  },
  restaurantInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  restaurantImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  restaurantDetails: {
    marginLeft: 16,
    flex: 1,
  },
  restaurantName: {
    ...typography.heading3,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  rating: {
    ...typography.bodySmall,
    fontWeight: "600",
    marginLeft: 4,
  },
  reviewCount: {
    ...typography.caption,
    color: "#8E8E8E",
    marginLeft: 2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: "#0095F6" + "20",
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  statusText: {
    ...typography.caption,
    color: "#0095F6",
    fontWeight: "600",
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
    paddingVertical: 12,
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: "#0095F6",
  },
  tabText: {
    ...typography.caption,
    color: "#8E8E8E",
    marginTop: 4,
  },
  activeTabText: {
    color: "#0095F6",
    fontWeight: "600",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    ...typography.heading1,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  errorText: {
    ...typography.body,
    color: "#ED4956",
    textAlign: "center",
    marginBottom: 16,
  },
  logoutButton: {
    marginHorizontal: 16,
  },
  
  // Overview tab styles
  overviewContainer: {},
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginHorizontal: 4,
  },
  statValue: {
    ...typography.heading2,
    color: "#0095F6",
    marginBottom: 4,
  },
  statLabel: {
    ...typography.caption,
    color: "#8E8E8E",
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    ...typography.heading4,
  },
  sectionLink: {
    ...typography.bodySmall,
    color: "#0095F6",
  },
  
  // Menu tab styles
  menuContainer: {},
  menuHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  menuTitle: {
    ...typography.heading3,
  },
  menuItemCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
  },
  menuItemImage: {
    width: 80,
    height: 80,
  },
  menuItemInfo: {
    flex: 1,
    padding: 12,
  },
  menuItemName: {
    ...typography.bodySmall,
    fontWeight: "600",
    marginBottom: 4,
  },
  menuItemDescription: {
    ...typography.caption,
    color: "#8E8E8E",
    marginBottom: 4,
  },
  menuItemPrice: {
    ...typography.bodySmall,
    fontWeight: "600",
    color: "#0095F6",
  },
  editButton: {
    padding: 12,
    justifyContent: "center",
  },
  
  // Orders tab styles
  ordersContainer: {},
  orderTabs: {
    flexDirection: "row",
    marginBottom: 16,
  },
  orderTab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: "#EFEFEF",
  },
  activeOrderTab: {
    backgroundColor: "#0095F6",
  },
  orderTabText: {
    ...typography.caption,
    color: "#262626",
  },
  activeOrderTabText: {
    ...typography.caption,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  orderCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  orderNumber: {
    ...typography.bodySmall,
    fontWeight: "600",
  },
  orderStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pendingBadge: {
    backgroundColor: "#ED4956" + "20",
  },
  preparingBadge: {
    backgroundColor: "#0095F6" + "20",
  },
  completedBadge: {
    backgroundColor: "#58C322" + "20",
  },
  orderStatusText: {
    ...typography.caption,
    fontWeight: "600",
  },
  customerName: {
    ...typography.body,
    marginBottom: 8,
  },
  orderItems: {
    marginBottom: 8,
  },
  orderItem: {
    ...typography.caption,
    color: "#8E8E8E",
    marginBottom: 4,
  },
  orderMeta: {
    flexDirection: "row",
    marginBottom: 12,
  },
  orderMetaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  orderMetaText: {
    ...typography.caption,
    color: "#8E8E8E",
    marginLeft: 4,
  },
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#DBDBDB",
    paddingTop: 12,
  },
  orderTotal: {
    ...typography.bodySmall,
    fontWeight: "600",
  },
  updateButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#0095F6",
    borderRadius: 8,
  },
  updateButtonText: {
    ...typography.caption,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  orderActions: {
    flexDirection: "row",
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginLeft: 8,
  },
  acceptButton: {
    backgroundColor: "#0095F6",
  },
  rejectButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#ED4956",
  },
  completeButton: {
    backgroundColor: "#58C322",
  },
  actionButtonText: {
    ...typography.caption,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  rejectButtonText: {
    color: "#ED4956",
  },
  
  // Settings tab styles
  settingsContainer: {},
  settingSection: {
    marginBottom: 24,
  },
  settingSectionTitle: {
    ...typography.heading4,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  settingItemContent: {
    flex: 1,
  },
  settingItemTitle: {
    ...typography.bodySmall,
    fontWeight: "600",
    marginBottom: 4,
  },
  settingItemDescription: {
    ...typography.caption,
    color: "#8E8E8E",
  },
  logoutItem: {
    justifyContent: "center",
    marginTop: 8,
  },
  logoutText: {
    ...typography.body,
    color: "#ED4956",
    fontWeight: "600",
    textAlign: "center",
  },
  
  // Empty state styles
  emptyState: {
    alignItems: "center",
    padding: 40,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
  },
  emptyStateTitle: {
    ...typography.heading3,
    marginBottom: 8,
  },
  emptyStateText: {
    ...typography.body,
    color: "#8E8E8E",
    textAlign: "center",
    marginBottom: 16,
  },
  emptyStateButton: {
    minWidth: 120,
  },
});