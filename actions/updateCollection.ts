"use server"

import { getUser } from "@/lib/getUser";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import * as argon2 from "argon2";

export async function updateCollection(
    collectionId: string,
    data: {
        title?: string;
        description?: string;
        visibility?: 'PUBLIC' | 'PRIVATE' | 'LOCKED';
        password?: string;
    },
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

    let hashedPassword = undefined;
    if (data.visibility === 'LOCKED' && data.password) {
        hashedPassword = await argon2.hash(data.password);
    }

    await prisma.collection.update({
        where: { id: collectionId },
        data: {
            ...(data.title !== undefined && { title: data.title }),
            ...(data.description !== undefined && { description: data.description }),
            ...(data.visibility !== undefined && { visibility: data.visibility }),
            ...(hashedPassword !== undefined && { password: hashedPassword }),
        },
    });

    revalidatePath(`/${username}/${collectionId}`);
    revalidatePath(`/${username}`);
}
