"use server";
export const dynamic = 'force-dynamic';
import { revalidatePath } from "next/cache";
import { db } from "../drizzle/db";
import * as schema from "../drizzle/schema";
import { desc, eq, sql } from "drizzle-orm";
import { generateUser } from "./fakerUser";
import { User } from "lucide-react";
import { faker } from "@faker-js/faker";
import { uuid } from "drizzle-orm/pg-core";

export const listTierLists = async () => {
  return db.query.TierListTable.findMany({
    with: {
      user: true,
    },
  });
};

export type ListTierListsByPaginationResponse = {
  id: string;
  createdAt: Date;
  title: string;
  description: string;
  tierListContent: unknown;
  coverImage: string | null;
  userId: number | null;
  user: {
    id: number;
    name: string;
    email: string | null;
    image: string;
    createdAt: Date;
  } | null;
};

export const listTierListsByPagination = async (
  page: number,
  limit: number,
): Promise<ListTierListsByPaginationResponse[]> => {
  return db.query.TierListTable.findMany({
    limit: limit,
    offset: (page - 1) * limit,
    orderBy: [desc(schema.TierListTable.createdAt)],
    with: {
      user: true,
    },
  });
};

export const listRandomTierLists = async (limit: number) => {
  return db.query.TierListTable.findMany({
    limit: limit,
    orderBy: [sql`RANDOM()`],
    with: {
      user: true,
    },
  });
};

export const createTierList = async ({
  title,
  content,
  description,
  userId,
  coverImage,
  guest,
  userImage,
  userName,
}: {
  title: string;
  content: JSON;
  description?: string;
  userId?: string;
  userName?: string;  
  userImage?: string;
  coverImage?: string;
  guest?: boolean;
}) => {
  let guestId = null;
  if (guest) {
    const guest = generateUser();
    const createGuest = await db
      .insert(schema.UsersTable)
      .values({
        name: guest.name,
        image: guest.avatar,
      })
      .returning({ id: schema.UsersTable.id });
      guestId = createGuest[0].id;
  }

  const upsertUser = await db
    .insert(schema.UsersTable)
    .values({
      externalId: userId || null,
      name: userName || "N/A",
      image: userImage || faker.image.avatar(),
    })
    .onConflictDoUpdate({
      target: [schema.UsersTable.externalId],
      set: {
        name: userName || "N/A",
        image: userImage,
      },
    })
    .returning();

  const tierList = db
    .insert(schema.TierListTable)
    .values({
      title,
      tierListContent: content,
      description: description || "",
      coverImage: coverImage,
      userId: guest ? guestId : upsertUser[0].id,
    })
    .returning();
  revalidatePath("/");
  return tierList;
};

export const getTierList = async (id: string) => {
  return db.query.TierListTable.findFirst({
    where: eq(schema.TierListTable.id, id),
  });
};
