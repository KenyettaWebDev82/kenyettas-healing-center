import { pgTable, text, timestamp, integer, boolean, jsonb, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  uid: text("uid").primaryKey(),
  email: text("email").notNull().unique(),
  displayName: text("display_name").notNull(),
  photoURL: text("photo_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastSignIn: timestamp("last_sign_in").defaultNow().notNull(),
  preferences: jsonb("preferences").$type<{
    notifications: boolean;
    dailyReminders: boolean;
  }>().default({
    notifications: true,
    dailyReminders: true
  }).notNull()
});

// Mood entries table
export const moodEntries = pgTable("mood_entries", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull().references(() => users.uid),
  mood: integer("mood").notNull(), // 1-10 scale
  note: text("note"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  date: text("date").notNull() // YYYY-MM-DD format
});

// Chakra test results table
export const chakraTestResults = pgTable("chakra_test_results", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull().references(() => users.uid),
  results: jsonb("results").$type<{
    [chakraId: string]: {
      score: number;
      percentage: number;
      blocked: boolean;
    };
  }>().notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  date: text("date").notNull() // YYYY-MM-DD format
});

// Meditation sessions table
export const meditationSessions = pgTable("meditation_sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull().references(() => users.uid),
  type: text("type").notNull(),
  duration: integer("duration").notNull(), // in minutes
  chakraFocus: text("chakra_focus"),
  crystalsUsed: jsonb("crystals_used").$type<string[]>(),
  completed: boolean("completed").default(false).notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  date: text("date").notNull() // YYYY-MM-DD format
});

// Wishlist items table
export const wishlistItems = pgTable("wishlist_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull().references(() => users.uid),
  crystalId: text("crystal_id").notNull(),
  addedAt: timestamp("added_at").defaultNow().notNull()
});

// Cart items table
export const cartItems = pgTable("cart_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull().references(() => users.uid),
  crystalId: text("crystal_id").notNull(),
  quantity: integer("quantity").default(1).notNull(),
  addedAt: timestamp("added_at").defaultNow().notNull()
});

// Insert schemas for validation
export const insertUserSchema = createInsertSchema(users).omit({ uid: true, createdAt: true, lastSignIn: true });
export const insertMoodEntrySchema = createInsertSchema(moodEntries).omit({ id: true, timestamp: true });
export const insertChakraTestResultSchema = createInsertSchema(chakraTestResults).omit({ id: true, timestamp: true });
export const insertMeditationSessionSchema = createInsertSchema(meditationSessions).omit({ id: true, timestamp: true });
export const insertWishlistItemSchema = createInsertSchema(wishlistItems).omit({ id: true, addedAt: true });
export const insertCartItemSchema = createInsertSchema(cartItems).omit({ id: true, addedAt: true });

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type MoodEntry = typeof moodEntries.$inferSelect;
export type InsertMoodEntry = z.infer<typeof insertMoodEntrySchema>;
export type ChakraTestResult = typeof chakraTestResults.$inferSelect;
export type InsertChakraTestResult = z.infer<typeof insertChakraTestResultSchema>;
export type MeditationSession = typeof meditationSessions.$inferSelect;
export type InsertMeditationSession = z.infer<typeof insertMeditationSessionSchema>;
export type WishlistItem = typeof wishlistItems.$inferSelect;
export type InsertWishlistItem = z.infer<typeof insertWishlistItemSchema>;
export type CartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;