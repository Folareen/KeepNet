"use server"

import prisma from "@/lib/prisma";
import * as argon2 from "argon2";

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

    if (!keep.password) {
        return false;
    }

    try {
        return await argon2.verify(keep.password, password);
    } catch (error) {
        console.error("Error verifying password:", error);
        return false;
    }
}
