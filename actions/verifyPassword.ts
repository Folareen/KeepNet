"use server"

import prisma from "@/lib/prisma";

export async function verifyKeepPassword(keepId: string, password: string): Promise<boolean> {
    const keep = await prisma.keep.findUnique({
        where: { id: keepId },
        select: { password: true, visibility: true }
    });

    if (!keep) {
        return false;
    }

    if (keep.visibility !== 'LOCKED') {
        return true;
    }

    return keep.password === password;
}

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
