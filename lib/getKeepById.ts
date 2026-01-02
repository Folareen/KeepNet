import prisma from "@/lib/prisma";

export const getKeepById = async (keepId: string) => {
    const keep = await prisma.keep.findUnique({
        where: { id: keepId },
        include: {
            user: true,
            collection: {
                select: {
                    id: true,
                    title: true,
                    userId: true
                }
            }
        }
    });

    return keep;
}
