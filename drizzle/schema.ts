import { drizzle } from "drizzle-orm/vercel-postgres";
import { relations, sql } from "drizzle-orm";
import {
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const UsersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email"),
  image: text("image").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const TierListTable = pgTable("tier_list", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("introduction").notNull(),
  tierListContent: jsonb("tier_list_content").notNull(),
  coverImage: text("cover_image"),
  userId: integer("user_id").references(() => UsersTable.id),

  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const tierListRelations = relations(TierListTable, ({ one }) => ({
  user: one(UsersTable, {
    fields: [TierListTable.userId],
    references: [UsersTable.id],
    relationName: "user",
  }),
}));
