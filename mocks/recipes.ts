import { Recipe } from "@/types/recipe";

export const recipes: Recipe[] = [
  {
    id: "1",
    title: "Doro Wat (Ethiopian Chicken Stew)",
    description: "A spicy Ethiopian chicken stew that's perfect for special occasions. The key is in the berbere spice and the long, slow cooking process.",
    imageUrl: "https://images.unsplash.com/photo-1567364816519-cbc9c4ffe1eb?q=80&w=1000",
    prepTime: 30,
    cookTime: 90,
    servings: 4,
    difficulty: "medium",
    ingredients: [
      { id: "1-1", name: "Chicken", amount: "2", unit: "lbs" },
      { id: "1-2", name: "Onions", amount: "4", unit: "large" },
      { id: "1-3", name: "Berbere spice", amount: "1/4", unit: "cup" },
      { id: "1-4", name: "Garlic", amount: "4", unit: "cloves" },
      { id: "1-5", name: "Ginger", amount: "1", unit: "inch" },
      { id: "1-6", name: "Eggs", amount: "6", unit: "hard-boiled" },
      { id: "1-7", name: "Niter kibbeh", amount: "1/4", unit: "cup" },
      { id: "1-8", name: "Lemon", amount: "1", unit: "" },
    ],
    steps: [
      { id: "1-1", description: "Marinate chicken pieces in lemon juice for 30 minutes." },
      { id: "1-2", description: "Sauté finely chopped onions until deeply caramelized, about 30 minutes." },
      { id: "1-3", description: "Add minced garlic, ginger, and berbere spice. Cook for 5 minutes." },
      { id: "1-4", description: "Add chicken and niter kibbeh (spiced clarified butter). Simmer for 45 minutes." },
      { id: "1-5", description: "Add hard-boiled eggs in the last 15 minutes of cooking." },
      { id: "1-6", description: "Serve hot with injera bread." },
    ],
    region: "Central Ethiopia",
    tags: ["spicy", "stew", "chicken", "traditional", "festive"],
    authorId: "1",
    authorName: "Makeda Abebe",
    authorAvatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=200",
    createdAt: "2023-09-15T14:30:00Z",
    likes: 245,
    isLiked: false,
    isSaved: false,
    comments: [
      {
        id: "c1",
        userId: "2",
        userName: "Dawit Haile",
        userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200",
        text: "I tried this recipe last weekend and it was amazing! The berbere spice really makes a difference.",
        createdAt: "2023-10-05T09:15:00Z"
      },
      {
        id: "c2",
        userId: "3",
        userName: "Tigist Bekele",
        userAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200",
        text: "My family loved this! I added a bit more garlic and it turned out perfect.",
        createdAt: "2023-11-12T16:30:00Z"
      }
    ],
    ratings: [
      { userId: "2", value: 5 },
      { userId: "3", value: 4 },
      { userId: "4", value: 5 }
    ],
    averageRating: 4.7
  },
  {
    id: "2",
    title: "Injera (Ethiopian Sourdough Flatbread)",
    description: "The staple bread of Ethiopian cuisine. This fermented flatbread has a unique, slightly spongy texture and tangy flavor.",
    imageUrl: "https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?q=80&w=1000",
    prepTime: 20,
    cookTime: 10,
    servings: 6,
    difficulty: "medium",
    ingredients: [
      { id: "2-1", name: "Teff flour", amount: "2", unit: "cups" },
      { id: "2-2", name: "Water", amount: "3", unit: "cups" },
      { id: "2-3", name: "Salt", amount: "1/2", unit: "tsp" },
    ],
    steps: [
      { id: "2-1", description: "Mix teff flour with water and let ferment for 3-4 days in a warm place." },
      { id: "2-2", description: "Add salt to the fermented batter and thin with water if necessary." },
      { id: "2-3", description: "Heat a non-stick pan or traditional mitad." },
      { id: "2-4", description: "Pour the batter in a spiral pattern to cover the pan." },
      { id: "2-5", description: "Cover and cook until bubbles form and the edges lift, about 3-4 minutes." },
      { id: "2-6", description: "Remove and let cool on a cloth." },
    ],
    region: "All regions",
    tags: ["bread", "fermented", "staple", "gluten-free"],
    authorId: "2",
    authorName: "Dawit Haile",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200",
    createdAt: "2023-10-02T09:15:00Z",
    likes: 189,
    isLiked: true,
    isSaved: true,
    comments: [
      {
        id: "c3",
        userId: "1",
        userName: "Makeda Abebe",
        userAvatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=200",
        text: "Perfect injera recipe! The fermentation time is key for that authentic taste.",
        createdAt: "2023-10-10T14:20:00Z"
      }
    ],
    ratings: [
      { userId: "1", value: 5 },
      { userId: "4", value: 4 }
    ],
    averageRating: 4.5
  },
  {
    id: "3",
    title: "Kitfo (Ethiopian Steak Tartare)",
    description: "A traditional Ethiopian dish made from raw minced beef, seasoned with mitmita (spice blend) and niter kibbeh (clarified butter).",
    imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1000",
    prepTime: 15,
    cookTime: 5,
    servings: 4,
    difficulty: "easy",
    ingredients: [
      { id: "3-1", name: "Lean beef", amount: "1", unit: "lb" },
      { id: "3-2", name: "Mitmita spice", amount: "2", unit: "tbsp" },
      { id: "3-3", name: "Niter kibbeh", amount: "3", unit: "tbsp" },
      { id: "3-4", name: "Kocho (optional)", amount: "1", unit: "serving" },
      { id: "3-5", name: "Ayib (cottage cheese)", amount: "1/2", unit: "cup" },
      { id: "3-6", name: "Collard greens", amount: "1", unit: "bunch" },
    ],
    steps: [
      { id: "3-1", description: "Finely mince the beef with a sharp knife." },
      { id: "3-2", description: "Warm the niter kibbeh until just melted but not hot." },
      { id: "3-3", description: "Mix the beef with mitmita spice and niter kibbeh." },
      { id: "3-4", description: "Serve immediately with ayib (cottage cheese) and cooked collard greens." },
      { id: "3-5", description: "Traditionally eaten with kocho or injera." },
    ],
    region: "Southern Ethiopia",
    tags: ["raw", "beef", "spicy", "traditional"],
    authorId: "3",
    authorName: "Tigist Bekele",
    authorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200",
    createdAt: "2023-11-10T16:45:00Z",
    likes: 132,
    isLiked: false,
    isSaved: false,
    comments: [],
    ratings: [
      { userId: "2", value: 4 }
    ],
    averageRating: 4.0
  },
  {
    id: "4",
    title: "Shiro Wat (Ethiopian Chickpea Stew)",
    description: "A delicious vegan Ethiopian stew made from ground chickpea flour. It's a staple dish during fasting periods.",
    imageUrl: "https://images.unsplash.com/photo-1546549032-9571cd6b27df?q=80&w=1000",
    prepTime: 10,
    cookTime: 30,
    servings: 4,
    difficulty: "easy",
    ingredients: [
      { id: "4-1", name: "Shiro powder", amount: "1", unit: "cup" },
      { id: "4-2", name: "Onion", amount: "1", unit: "large" },
      { id: "4-3", name: "Garlic", amount: "3", unit: "cloves" },
      { id: "4-4", name: "Tomato", amount: "1", unit: "medium" },
      { id: "4-5", name: "Berbere spice", amount: "1", unit: "tbsp" },
      { id: "4-6", name: "Vegetable oil", amount: "3", unit: "tbsp" },
      { id: "4-7", name: "Water", amount: "2", unit: "cups" },
    ],
    steps: [
      { id: "4-1", description: "Finely chop onion, garlic, and tomato." },
      { id: "4-2", description: "Sauté onion until translucent, then add garlic and berbere spice." },
      { id: "4-3", description: "Add chopped tomato and cook for 5 minutes." },
      { id: "4-4", description: "Gradually add shiro powder while stirring to avoid lumps." },
      { id: "4-5", description: "Add water and simmer on low heat for 15-20 minutes, stirring occasionally." },
      { id: "4-6", description: "Serve hot with injera bread." },
    ],
    region: "Northern Ethiopia",
    tags: ["vegan", "stew", "chickpea", "fasting"],
    authorId: "4",
    authorName: "Solomon Tadesse",
    authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200",
    createdAt: "2023-12-05T11:20:00Z",
    likes: 178,
    isLiked: false,
    isSaved: true,
    comments: [
      {
        id: "c4",
        userId: "1",
        userName: "Makeda Abebe",
        userAvatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=200",
        text: "This is my go-to recipe during fasting periods. So flavorful!",
        createdAt: "2023-12-20T10:45:00Z"
      }
    ],
    ratings: [
      { userId: "1", value: 5 },
      { userId: "3", value: 4 }
    ],
    averageRating: 4.5
  },
  {
    id: "5",
    title: "Tibs (Ethiopian Sautéed Meat)",
    description: "A popular Ethiopian dish of sautéed meat and vegetables. It can be made with beef, lamb, or goat meat.",
    imageUrl: "https://images.unsplash.com/photo-1559847844-5315695dadae?q=80&w=1000",
    prepTime: 20,
    cookTime: 25,
    servings: 4,
    difficulty: "easy",
    ingredients: [
      { id: "5-1", name: "Beef or lamb", amount: "1.5", unit: "lbs" },
      { id: "5-2", name: "Onion", amount: "1", unit: "large" },
      { id: "5-3", name: "Tomato", amount: "2", unit: "medium" },
      { id: "5-4", name: "Jalapeño", amount: "2", unit: "" },
      { id: "5-5", name: "Rosemary", amount: "2", unit: "sprigs" },
      { id: "5-6", name: "Garlic", amount: "3", unit: "cloves" },
      { id: "5-7", name: "Niter kibbeh", amount: "3", unit: "tbsp" },
      { id: "5-8", name: "Berbere spice", amount: "1", unit: "tsp" },
    ],
    steps: [
      { id: "5-1", description: "Cut meat into small cubes." },
      { id: "5-2", description: "Heat niter kibbeh in a pan and sear meat on high heat until browned." },
      { id: "5-3", description: "Add chopped onions, garlic, and rosemary. Cook until onions are soft." },
      { id: "5-4", description: "Add chopped tomatoes, jalapeños, and berbere spice." },
      { id: "5-5", description: "Cook for another 10-15 minutes until meat is tender and sauce thickens." },
      { id: "5-6", description: "Serve hot with injera bread." },
    ],
    region: "Central Ethiopia",
    tags: ["meat", "spicy", "quick", "popular"],
    authorId: "5",
    authorName: "Hanna Girma",
    authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200",
    createdAt: "2024-01-18T19:30:00Z",
    likes: 210,
    isLiked: true,
    isSaved: false,
    restaurantId: "1",
    comments: [
      {
        id: "c5",
        userId: "2",
        userName: "Dawit Haile",
        userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200",
        text: "I love the simplicity of this recipe. The rosemary adds such a nice flavor!",
        createdAt: "2024-02-01T15:10:00Z"
      }
    ],
    ratings: [
      { userId: "1", value: 5 },
      { userId: "2", value: 5 },
      { userId: "4", value: 4 }
    ],
    averageRating: 4.7
  },
];

export const popularTags = [
  "traditional",
  "spicy",
  "vegan",
  "quick",
  "festive",
  "stew",
  "bread",
  "meat",
  "vegetarian",
  "breakfast",
  "dinner",
  "dessert",
];

export const regions = [
  "All regions",
  "Northern Ethiopia",
  "Southern Ethiopia",
  "Central Ethiopia",
  "Eastern Ethiopia",
  "Western Ethiopia",
];