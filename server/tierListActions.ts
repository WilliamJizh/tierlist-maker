"use server";

import { revalidatePath } from "next/cache";
import { db } from "../drizzle/db";
import * as schema from "../drizzle/schema";
import { desc, eq, sql } from "drizzle-orm";

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
    email: string;
    image: string;
    createdAt: Date;
  } | null;
};

export const listTierListsByPagination = async (
  page: number,
  limit: number
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

interface CreateTierListProps {
  title: string;
  content: JSON;
  description?: string;
  userId?: number;
  coverImage?: string;
}

export const createTierList = async ({
  title,
  content,
  description,
  userId,
  coverImage,
}: {
  title: string;
  content: JSON;
  description?: string;
  userId?: number;
  coverImage?: string;
}) => {
  console.log({ title, content, description, userId, coverImage });
  const tierList = db
    .insert(schema.TierListTable)
    .values({
      title,
      tierListContent: content,
      description: description || "",
      coverImage: coverImage,
      userId: userId,
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
