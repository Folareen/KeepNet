import prisma from "@/lib/prisma";

export const getUserByUsername = async (username: string) => {
    const user = await prisma.user.findUnique({
        where: { username },
        select: {
            id: true,
            email: true,
            name: true,
            username: true,
            image: true,
            visibility: true,
            emailVerified: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    return user;
}
