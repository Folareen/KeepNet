import AppLayout from '@/components/AppLayout';
import CollectionContentWrapper from '@/components/CollectionContentWrapper';
import { getUser } from '@/lib/getUser';
import { getCollectionById } from '@/lib/getCollectionById';

export default async function CollectionPage({ params }: { params: Promise<{ username: string, collectionId: string }> }) {
    const { username, collectionId } = await params;
    const currentUser = await getUser();

    const collection = await getCollectionById(collectionId);

    if (!collection) {
        return (
            <div className='min-h-screen flex items-center justify-center bg-gray-950 text-white'>
                <h1 className='text-2xl'>Collection not found</h1>
            </div>
        );
    }

    const isOwner = currentUser?.id === collection.userId;

    return (
        <AppLayout>
            <div className='flex flex-col gap-4'>
                <CollectionContentWrapper
                    collection={{
                        id: collection.id,
                        title: collection.title,
                        description: collection.description,
                        visibility: collection.visibility,
                        keeps: collection.keeps.map(keep => ({
                            id: keep.id,
                            title: keep.title,
                            description: keep.description,
                            type: keep.type
                        }))
                    }}
                    username={username}
                    isOwner={isOwner}
                />
            </div>
        </AppLayout>
    )
}