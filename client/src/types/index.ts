export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: Date;
  lastSignIn: Date;
}

export interface MoodEntry {
  id?: string;
  userId: string;
  mood: number;
  note?: string;
  timestamp: Date;
  date: string;
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
  chakras: string[];
  healingProperties: string[];
  meditationInstructions: string;
  element?: string;
  zodiacSigns?: string[];
  category: string;
}

export interface ChakraTestQuestion {
  id: number;
  text: string;
  chakra: string;
  answers: {
    text: string;
    value: number;
  }[];
}

export interface ChakraTestResult {
  id?: string;
  userId: string;
  results: {
    [chakra: string]: {
      score: number;
      percentage: number;
      blocked: boolean;
    };
  };
  timestamp: Date;
  date: string;
}

export interface MeditationSession {
  id?: string;
  userId: string;
  type: string;
  duration: number;
  chakraFocus?: string;
  crystalsUsed?: string[];
  completed: boolean;
  timestamp: Date;
  date: string;
}
