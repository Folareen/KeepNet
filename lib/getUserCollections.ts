import prisma from "@/lib/prisma";

export const getUserCollections = async (userId: string) => {
    const collections = await prisma.collection.findMany({
        where: { userId },
        select: {
            id: true,
            title: true,
            description: true,
            visibility: true,
            _count: {
                select: { keeps: true }
            },
            updatedAt: true
        },
        orderBy: [
            { updatedAt: 'desc' }
        ]
    });

    return collections;
}
