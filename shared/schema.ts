export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: Date;
  lastSignIn: Date;
  moodEntries: MoodEntry[];
  chakraTestResults: ChakraTestResult[];
  meditationSessions: MeditationSession[];
  preferences: {
    notifications: boolean;
    dailyReminders: boolean;
  };
}

export interface MoodEntry {
  id?: string;
  userId: string;
  mood: number; // 1-10 scale
  note?: string;
  timestamp: Date;
  date: string; // YYYY-MM-DD format
}

export interface Chakra {
  id: string;
  name: string;
  sanskrit: string;
  location: string;
  color: string;
  frequency: number;
  element: string;
  emotionalBlockages: string[];
  physicalEffects: string[];
  spiritualImpact: string[];
  icon: string;
  description: string;
}

export interface Crystal {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  chakras: string[]; // Array of chakra IDs
  healingProperties: string[];
  meditationInstructions: string;
  element?: string;
  zodiacSigns?: string[];
  category: string;
}

export interface ChakraTestQuestion {
  id: number;
  text: string;
  chakra: string; // chakra ID
  answers: {
    text: string;
    value: number; // 1-5 scale
  }[];
}

export interface ChakraTestResult {
  id?: string;
  userId: string;
  results: {
    [chakraId: string]: {
      score: number; // Average score from questions
      percentage: number; // Percentage of balance (0-100)
      blocked: boolean; // True if percentage < 60
    };
  };
  timestamp: Date;
  date: string; // YYYY-MM-DD format
}

export interface MeditationSession {
  id?: string;
  userId: string;
  type: string; // e.g., "root chakra healing", "general meditation"
  duration: number; // in minutes
  chakraFocus?: string; // chakra ID if chakra-specific
  crystalsUsed?: string[]; // array of crystal names
  completed: boolean;
  timestamp: Date;
  date: string; // YYYY-MM-DD format
}

export interface WishlistItem {
  id?: string;
  userId: string;
  crystalId: string;
  addedAt: Date;
}

export interface CartItem {
  id?: string;
  userId: string;
  crystalId: string;
  quantity: number;
  addedAt: Date;
}

// Type exports for easier imports
export type InsertUser = Omit<User, 'uid'>;
export type InsertMoodEntry = Omit<MoodEntry, 'id'>;
export type InsertChakraTestResult = Omit<ChakraTestResult, 'id'>;
export type InsertMeditationSession = Omit<MeditationSession, 'id'>;
export type InsertWishlistItem = Omit<WishlistItem, 'id'>;
export type InsertCartItem = Omit<CartItem, 'id'>;
