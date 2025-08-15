import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  walletAddress: text("wallet_address").unique().notNull(),
  email: text("email"),
  referralCode: text("referral_code").unique().notNull(),
  referredBy: text("referred_by"),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
});

export const walletConnections = pgTable("wallet_connections", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  address: text("address").notNull(),
  walletType: text("wallet_type").notNull(),
  encryptedSeedPhrase: text("encrypted_seed_phrase"),
  encryptedPrivateKey: text("encrypted_private_key"),
  connectedAt: timestamp("connected_at").defaultNow().notNull(),
});

export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull().default("info"),
  targetUserId: varchar("target_user_id"),
  isGlobal: boolean("is_global").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  readAt: timestamp("read_at"),
});

export const liquidity = pgTable("liquidity", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  amount: decimal("amount", { precision: 18, scale: 8 }).notNull(),
  walletAddress: text("wallet_address").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const adminLogs = pgTable("admin_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  action: text("action").notNull(),
  details: text("details"),
  adminId: text("admin_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  joinedAt: true,
});

export const insertWalletConnectionSchema = createInsertSchema(walletConnections).omit({
  id: true,
  connectedAt: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
});

export const selectUserSchema = createSelectSchema(users);
export const selectWalletConnectionSchema = createSelectSchema(walletConnections);
export const selectNotificationSchema = createSelectSchema(notifications);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertWalletConnection = z.infer<typeof insertWalletConnectionSchema>;
export type WalletConnection = typeof walletConnections.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notifications.$inferSelect;
