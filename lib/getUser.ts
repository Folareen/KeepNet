import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { cache } from "react";

export const getUser = cache(async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user) {
        return null;
    }

    return session.user;
});
