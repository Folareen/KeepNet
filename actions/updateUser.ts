"use server";

import prisma from "@/lib/prisma";
import { getUser } from "@/lib/getUser";
import { revalidatePath } from "next/cache";

type UpdateUserData = {
    name?: string;
    username?: string;
    displayUsername?: string;
    visibility?: boolean;
};

export async function updateUser(data: UpdateUserData) {
    try {
        const currentUser = await getUser();

        if (!currentUser) {
            return { success: false, error: "User not authenticated" };
        }

        if (data.username && data.username !== currentUser.username) {
            const existingUser = await prisma.user.findUnique({
                where: { username: data.username }
            });

            if (existingUser) {
                return { success: false, error: "Username already taken" };
            }
        }

        const updatedUser = await prisma.user.update({
            where: { id: currentUser.id },
            data: {
                ...(data.name && { name: data.name }),
                ...(data.username && {
                    username: data.username,
                    displayUsername: data.username
                }),
                ...(data.visibility !== undefined && { visibility: data.visibility })
            }
        });

        revalidatePath('/home');
        revalidatePath(`/${updatedUser.username}`);

        return { success: true, user: updatedUser };
    } catch (error) {
        console.error("Error updating user:", error);
        return { success: false, error: "Failed to update user" };
    }
}
