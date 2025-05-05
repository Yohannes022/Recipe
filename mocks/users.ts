export interface User {
    id: string;
    name: string;
    phone: string;
    avatar: string; // Added avatar property
    bio: string;
    location: string;
    recipes: string[];
    savedRecipes: string[];
    followers: number;
    following: number;
}

export const users: User[] = [
  {
    id: "1",
    name: "Makeda Abebe",
    phone: "+251911234567",
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=200",
    bio: "Passionate about traditional Ethiopian cuisine. Cooking since I was 10 years old.",
    location: "Addis Ababa",
    recipes: ["1"],
    savedRecipes: ["2", "4"],
    followers: 1245,
    following: 352,
  },
  {
    id: "2",
    name: "Dawit Haile",
    phone: "+251922345678",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200",
    bio: "Chef and food blogger specializing in Ethiopian cuisine with a modern twist.",
    location: "Bahir Dar",
    recipes: ["2"],
    savedRecipes: ["1", "3", "5"],
    followers: 987,
    following: 245,
  },
  {
    id: "3",
    name: "Tigist Bekele",
    phone: "+251933456789",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200",
    bio: "Exploring the diverse flavors of Ethiopia's regional cuisines.",
    location: "Gondar",
    recipes: ["3"],
    savedRecipes: ["1", "2"],
    followers: 756,
    following: 198,
  },
  {
    id: "4",
    name: "Solomon Tadesse",
    phone: "+251944567890",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200",
    bio: "Home cook with a passion for vegan Ethiopian dishes.",
    location: "Hawassa",
    recipes: ["4"],
    savedRecipes: ["2", "5"],
    followers: 543,
    following: 321,
  },
  {
    id: "5",
    name: "Hanna Girma",
    phone: "+251955678901",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200",
    bio: "Third-generation chef preserving family recipes from Tigray region.",
    location: "Mekelle",
    recipes: ["5"],
    savedRecipes: ["1", "3"],
    followers: 876,
    following: 234,
  },
];

export const currentUser = users[0];