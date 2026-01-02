import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { cache } from "react";

export const getUser = cache(async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user) {
        return null;
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
    });

    return user;
});
