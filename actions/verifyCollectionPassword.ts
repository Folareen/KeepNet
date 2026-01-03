"use server"

import prisma from "@/lib/prisma";

export async function verifyCollectionPassword(collectionId: string, password: string): Promise<boolean> {
    const collection = await prisma.collection.findUnique({
        where: { id: collectionId },
        select: { password: true, visibility: true }
    });

    if (!collection) {
        return false;
    }

    if (collection.visibility !== 'LOCKED') {
        return true;
    }

    return collection.password === password;
}
