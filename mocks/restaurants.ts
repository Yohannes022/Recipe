import { User } from "@/types/recipe";

export const currentUser: User = {
  id: "user1",
  name: "Abebe Kebede",
  phone: "+251912345678",
  avatar: "https://images.unsplash.com/photo-1539701938214-0d9736e1c16b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
  bio: "Food enthusiast and home cook. I love sharing traditional Ethiopian recipes with a modern twist.",
  location: "Addis Ababa, Ethiopia",
  email: "abebe.kebede@example.com",
  recipes: ["recipe1", "recipe2", "recipe3"],
  savedRecipes: ["recipe4", "recipe5"],
  followers: 245,
  following: 112,
  role: "user",
};

export const restaurantOwnerUser: User = {
  id: "user2",
  name: "Tigist Haile",
  phone: "+251923456789",
  avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
  bio: "Owner of Habesha Restaurant. Passionate about authentic Ethiopian cuisine and hospitality.",
  location: "Bahir Dar, Ethiopia",
  email: "tigist.haile@example.com",
  recipes: ["recipe6", "recipe7"],
  savedRecipes: ["recipe1", "recipe3"],
  followers: 520,
  following: 78,
  role: "restaurant",
  restaurantId: "restaurant1",
};

export const adminUser: User = {
  id: "user3",
  name: "Dawit Mekonnen",
  phone: "+251934567890",
  avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
  bio: "Platform administrator and food critic. I help maintain quality content on Ethiopian Recipe Share.",
  location: "Addis Ababa, Ethiopia",
  email: "dawit.mekonnen@example.com",
  recipes: ["recipe8"],
  savedRecipes: ["recipe2", "recipe6"],
  followers: 310,
  following: 45,
  role: "admin",
};

export const users: User[] = [
  currentUser,
  restaurantOwnerUser,
  adminUser,
  {
    id: "user4",
    name: "Sara Tadesse",
    phone: "+251945678901",
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    bio: "Food blogger and photographer. I love to document Ethiopian culinary traditions.",
    location: "Hawassa, Ethiopia",
    email: "sara.tadesse@example.com",
    recipes: ["recipe9", "recipe10"],
    savedRecipes: ["recipe1", "recipe7"],
    followers: 178,
    following: 203,
    role: "user",
  },
  {
    id: "user5",
    name: "Yonas Bekele",
    phone: "+251956789012",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    bio: "Chef with 10+ years of experience. Specializing in fusion Ethiopian cuisine.",
    location: "Gondar, Ethiopia",
    email: "yonas.bekele@example.com",
    recipes: ["recipe11", "recipe12"],
    savedRecipes: ["recipe3", "recipe8"],
    followers: 412,
    following: 156,
    role: "user",
  },
];

export const deliveryPeople = [
  // Example delivery person object
  {
    id: "1",
    name: "John Doe",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    completedDeliveries: 120,
    rating: 4.8,
  },
  // Add more delivery people as needed
];