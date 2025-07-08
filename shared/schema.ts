import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("user"), // "user" or "admin"
  firstName: text("first_name"),
  lastName: text("last_name"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const chatSessions = pgTable("chat_sessions", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull().unique(),
  userId: integer("user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  sender: text("sender").notNull(), // 'user' or 'bot'
  content: text("content").notNull(),
  metadata: jsonb("metadata"), // For storing additional data like certifications
  timestamp: timestamp("timestamp").defaultNow(),
});

export const certifications = pgTable("certifications", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  provider: text("provider").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  prepTime: text("prep_time").notNull(),
  examFee: text("exam_fee").notNull(),
  difficulty: text("difficulty").notNull(), // beginner, intermediate, advanced
  icon: text("icon").notNull(),
  iconColor: text("icon_color").notNull(),
  tags: text("tags").array().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
  role: true,
  firstName: true,
  lastName: true,
});

export const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const registerUserSchema = insertUserSchema.extend({
  password: z.string().min(6, "Password must be at least 6 characters"),
  email: z.string().email("Invalid email address"),
});

export const insertChatSessionSchema = createInsertSchema(chatSessions).pick({
  sessionId: true,
  userId: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).pick({
  sessionId: true,
  sender: true,
  content: true,
  metadata: true,
});

export const insertCertificationSchema = createInsertSchema(certifications).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertChatSession = z.infer<typeof insertChatSessionSchema>;
export type ChatSession = typeof chatSessions.$inferSelect;

export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;

export type InsertCertification = z.infer<typeof insertCertificationSchema>;
export type Certification = typeof certifications.$inferSelect;

// Response types for API
export const chatResponseSchema = z.object({
  message: z.string(),
  certifications: z.array(z.object({
    id: z.number(),
    name: z.string(),
    provider: z.string(),
    category: z.string(),
    description: z.string(),
    prepTime: z.string(),
    examFee: z.string(),
    difficulty: z.string(),
    icon: z.string(),
    iconColor: z.string(),
    tags: z.array(z.string()),
  })).optional(),
});

export type ChatResponse = z.infer<typeof chatResponseSchema>;
