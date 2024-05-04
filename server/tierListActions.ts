"use server";

import { revalidatePath } from "next/cache";
import { db } from "../drizzle/db";
import * as schema from "../drizzle/schema";
import { desc, eq, sql } from "drizzle-orm";
import { generateUser } from "./fakerUser";
import { User } from "lucide-react";

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
}: {
  title: string;
  content: JSON;
  description?: string;
  userId?: number;
  coverImage?: string;
  guest?: boolean;
}) => {
  console.log({ title, content, description, userId, coverImage });
  let user = userId;
  if (guest) {
    const guest = generateUser();
    const createGuest = await db
      .insert(schema.UsersTable)
      .values({
        name: guest.name,
        image: guest.avatar,
      })
      .returning({ id: schema.UsersTable.id });
      user = createGuest[0].id;
  }
  const tierList = db
    .insert(schema.TierListTable)
    .values({
      title,
      tierListContent: content,
      description: description || "",
      coverImage: coverImage,
      userId: user,
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
