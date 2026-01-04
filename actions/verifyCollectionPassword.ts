"use server"

import prisma from "@/lib/prisma";
import * as argon2 from "argon2";

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

    if (!collection.password) {
        return false;
    }

    try {
        return await argon2.verify(collection.password, password);
    } catch (error) {
        console.error("Error verifying password:", error);
        return false;
    }
}
