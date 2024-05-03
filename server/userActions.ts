"use server";

import { revalidatePath } from "next/cache";
import { db } from "../drizzle/db";
import * as schema from "../drizzle/schema";

export const getUsers = async () => {
  return db.query.UsersTable.findMany();
};

export const addUser = async (name: string, email: string, image: string) => {
  const user = db.insert(schema.UsersTable).values({
    name,
    email,
    image,
  }).returning();
  revalidatePath("/");
  return user;
};
