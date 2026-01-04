"use server"

import { getUser } from "@/lib/getUser";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { deleteFromS3 } from "./s3Upload";

export async function deleteKeep(keepId: string, username: string, collectionId?: string) {
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

    if (keep.content && (keep.type === 'IMAGE' || keep.type === 'VIDEO' || keep.type === 'FILE')) {
        await deleteFromS3(keep.content);
    }

    await prisma.keep.delete({
        where: { id: keepId },
    });

    if (collectionId) {
        revalidatePath(`/${username}/${collectionId}`);
        redirect(`/${username}/${collectionId}`);
    } else {
        revalidatePath(`/${username}`);
        redirect(`/${username}`);
    }
}
