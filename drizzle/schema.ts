import { 
  int, 
  varchar, 
  text, 
  timestamp, 
  mysqlTable,
  boolean,
  decimal
} from "drizzle-orm/mysql-core";

// Users table with PIN authentication
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).unique(),
  pin: varchar("pin", { length: 4 }).notNull().unique(),
  role: varchar("role", { length: 50 }).notNull(), // admin, media_buyer, creator, viewer
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Creative posts table
export const creativePosts = mysqlTable("creative_posts", {
  id: int("id").autoincrement().primaryKey(),
  creatorId: int("creator_id").notNull(),
  mediaUrl: text("media_url"),
  storageKey: varchar("storage_key", { length: 512 }),
  caption: text("caption"),
  internalNote: text("internal_note"),
  status: varchar("status", { length: 50 }).default("Pending").notNull(), // Pending, Approved, Published, Returned, Back for Update, Closed, Archived
  managerComment: text("manager_comment"),
  managerId: int("manager_id"),
  approvedAt: timestamp("approved_at"),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type CreativePost = typeof creativePosts.$inferSelect;
export type InsertCreativePost = typeof creativePosts.$inferInsert;

// Campaign briefs table
export const briefs = mysqlTable("briefs", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  assignedTo: int("assigned_to").notNull(),
  createdBy: int("created_by").notNull(),
  status: varchar("status", { length: 50 }).default("Draft").notNull(), // Draft, Published, Seen, In Progress, Submitted, Done
  deadline: timestamp("deadline"),
  isSeen: boolean("is_seen").default(false).notNull(),
  seenAt: timestamp("seen_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Brief = typeof briefs.$inferSelect;
export type InsertBrief = typeof briefs.$inferInsert;

// Daily reports table
export const dailyReports = mysqlTable("daily_reports", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  campaignName: varchar("campaign_name", { length: 255 }).notNull(),
  currentSpend: decimal("current_spend", { precision: 12, scale: 2 }),
  budgetLimit: decimal("budget_limit", { precision: 12, scale: 2 }),
  cpl: decimal("cpl", { precision: 10, scale: 2 }),
  statusUpdate: text("status_update"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type DailyReport = typeof dailyReports.$inferSelect;
export type InsertDailyReport = typeof dailyReports.$inferInsert;

// Activity logs table for audit trail
export const activityLogs = mysqlTable("activity_logs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  actionType: varchar("action_type", { length: 100 }).notNull(), // creative_uploaded, creative_approved, etc
  targetId: int("target_id"),
  targetType: varchar("target_type", { length: 50 }),
  details: text("details"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type ActivityLog = typeof activityLogs.$inferSelect;
export type InsertActivityLog = typeof activityLogs.$inferInsert;

// Async standups table
export const standups = mysqlTable("standups", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  yesterday: text("yesterday"),
  today: text("today"),
  blockers: text("blockers"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Standup = typeof standups.$inferSelect;
export type InsertStandup = typeof standups.$inferInsert;

// Comments/feedback table
export const comments = mysqlTable("comments", {
  id: int("id").autoincrement().primaryKey(),
  creativeId: int("creative_id").notNull(),
  authorId: int("author_id").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Comment = typeof comments.$inferSelect;
export type InsertComment = typeof comments.$inferInsert;
