"use server"

import { getUser } from "@/lib/getUser";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as argon2 from "argon2";

export async function createCollection(formData: FormData) {
    const user = await getUser();

    if (!user) {
        throw new Error("Unauthorized");
    }

    const title = formData.get("title") as string;
    const description = formData.get("description") as string | null;
    const visibility = formData.get("visibility") as "PUBLIC" | "PRIVATE" | "LOCKED";
    const password = formData.get("password") as string | null;

    if (!title) {
        throw new Error("Title is required");
    }

    let hashedPassword = null;
    if (visibility === "LOCKED" && password) {
        hashedPassword = await argon2.hash(password);
    }

    const collection = await prisma.collection.create({
        data: {
            title,
            description,
            visibility,
            password: hashedPassword,
            userId: user.id,
        },
    });

    revalidatePath("/home");
    redirect(`/${user.username || user.id}/${collection.id}`);
}
