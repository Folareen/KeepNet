"use server"

import { getUser } from "@/lib/getUser";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateKeepContent(keepId: string, content: string, username: string, collectionId?: string) {
    const user = await getUser();

    if (!user) {
        throw new Error("Unauthorized");
    }

    const keep = await prisma.keep.findUnique({
        where: { id: keepId },
    });

    if (!keep) {
        throw new Error("Keep not found");
    }

    if (keep.userId !== user.id) {
        throw new Error("Unauthorized");
    }

    await prisma.keep.update({
        where: { id: keepId },
        data: { content },
    });

    if (collectionId) {
        revalidatePath(`/${username}/${collectionId}/${keepId}`);
    } else {
        revalidatePath(`/${username}`);
    }
}
