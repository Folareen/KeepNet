"use server"

import { getUser } from "@/lib/getUser";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateCollection(
    collectionId: string,
    data: { title?: string; description?: string },
    username: string
) {
    const user = await getUser();

    if (!user) {
        throw new Error("Unauthorized");
    }

    const collection = await prisma.collection.findUnique({
        where: { id: collectionId },
    });

    if (!collection) {
        throw new Error("Collection not found");
    }

    if (collection.userId !== user.id) {
        throw new Error("Unauthorized");
    }

    await prisma.collection.update({
        where: { id: collectionId },
        data: {
            ...(data.title !== undefined && { title: data.title }),
            ...(data.description !== undefined && { description: data.description }),
        },
    });

    revalidatePath(`/${username}/${collectionId}`);
    revalidatePath(`/${username}`);
}
