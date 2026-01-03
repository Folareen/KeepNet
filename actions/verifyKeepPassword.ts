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
