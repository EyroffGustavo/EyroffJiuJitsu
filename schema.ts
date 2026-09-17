import { boolean, integer, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  age: integer("age").notNull(),
  interest: varchar("interest", { length: 40 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  instagram: varchar("instagram", { length: 100 }).notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const feedbacks = pgTable("feedbacks", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 80 }).notNull(),
  interest: varchar("interest", { length: 40 }).notNull(),
  message: text("message").notNull(),
  published: boolean("published").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
