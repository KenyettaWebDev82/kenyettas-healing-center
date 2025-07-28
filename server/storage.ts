import { db, users } from "./db";
import { type User, type InsertUser } from "@shared/db-schema";
import { eq } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(uid: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser & { uid: string }): Promise<User>;
}

export class PostgresStorage implements IStorage {
  async getUser(uid: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.uid, uid)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser & { uid: string }): Promise<User> {
    const result = await db.insert(users).values({
      ...insertUser,
      uid: insertUser.uid
    }).returning();
    return result[0];
  }
}

// Keep MemStorage as fallback for development
export class MemStorage implements IStorage {
  private users: Map<string, User>;

  constructor() {
    this.users = new Map();
  }

  async getUser(uid: string): Promise<User | undefined> {
    return this.users.get(uid);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser & { uid: string }): Promise<User> {
    const user: User = { 
      ...insertUser,
      uid: insertUser.uid,
      photoURL: insertUser.photoURL || null,
      createdAt: new Date(),
      lastSignIn: new Date(),
      preferences: {
        notifications: true,
        dailyReminders: true
      }
    };
    this.users.set(user.uid, user);
    return user;
  }
}

// Use PostgreSQL in production, MemStorage in development
export const storage = process.env.NODE_ENV === "production" 
  ? new PostgresStorage() 
  : new MemStorage();
