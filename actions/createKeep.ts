"use server"

import { getUser } from "@/lib/getUser";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createKeep(formData: FormData) {
    const user = await getUser();

    if (!user) {
        throw new Error("Unauthorized");
    }

    const title = formData.get("title") as string;
    const description = formData.get("description") as string | null;
    const type = formData.get("type") as "TEXT" | "RICH_TEXT" | "IMAGE" | "VIDEO" | "FILE";
    const visibility = formData.get("visibility") as "PUBLIC" | "PRIVATE" | "LOCKED";
    const password = formData.get("password") as string | null;
    const collectionId = formData.get("collectionId") as string;

    if (!title) {
        throw new Error("Title is required");
    }

    const keep = await prisma.keep.create({
        data: {
            title,
            description,
            type,
            visibility,
            password,
            userId: user.id,
            collectionId,
        },
    });

    if (collectionId) {
        revalidatePath(`/${user.username || user.id}/${collectionId}`);
        redirect(`/${user.username || user.id}/${collectionId}/${keep.id}`);
    } else {
        revalidatePath("/home");
        redirect(`/${user.username || user.id}`);
    }
}
