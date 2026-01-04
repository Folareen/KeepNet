"use server"

import { getUser } from "@/lib/getUser";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import * as argon2 from "argon2";

export async function updateKeep(
    keepId: string,
    data: {
        title?: string;
        description?: string;
        content?: string;
        visibility?: 'PUBLIC' | 'PRIVATE' | 'LOCKED';
        password?: string;
    },
    username: string,
    collectionId?: string
) {
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

    let hashedPassword = undefined;
    if (data.visibility === 'LOCKED' && data.password) {
        hashedPassword = await argon2.hash(data.password);
    }

    await prisma.keep.update({
        where: { id: keepId },
        data: {
            ...(data.title !== undefined && { title: data.title }),
            ...(data.description !== undefined && { description: data.description }),
            ...(data.content !== undefined && { content: data.content }),
            ...(data.visibility !== undefined && { visibility: data.visibility }),
            ...(hashedPassword !== undefined && { password: hashedPassword }),
        },
    });

    if (collectionId) {
        revalidatePath(`/${username}/${collectionId}/${keepId}`);
    } else {
        revalidatePath(`/${username}`);
    }
}
