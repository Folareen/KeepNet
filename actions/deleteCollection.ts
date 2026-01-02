"use server"

import { getUser } from "@/lib/getUser";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteCollection(collectionId: string, username: string) {
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

    await prisma.collection.delete({
        where: { id: collectionId },
    });

    revalidatePath(`/${username}`);
    redirect(`/${username}`);
}
