import prisma from "@/lib/prisma";

export const getCollectionById = async (collectionId: string) => {
    const collection = await prisma.collection.findUnique({
        where: { id: collectionId },
        include: {
            user: true,
            keeps: {
                orderBy: [
                    { createdAt: 'desc' }
                ]
            }
        }
    });

    return collection;
}
