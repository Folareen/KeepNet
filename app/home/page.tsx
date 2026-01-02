import AppLayout from '@/components/AppLayout';
import CreateCollectionModal from '@/components/CreateCollectionModal';
import CollectionCard from '@/components/CollectionCard';
import { getUser } from '@/lib/getUser';
import { getUserCollections } from '@/lib/getUserCollections';

export default async function HomePage() {
    const user = await getUser();
    const collections = await getUserCollections(user!.id);

    return (
        <AppLayout>
            <div className='p-5 flex-1'>
                <div className='flex items-center justify-between'>
                    <h2 className='text-3xl '>
                        Collections
                    </h2>
                    <CreateCollectionModal />
                </div>
                <div>
                    <div className='grid grid-cols-4 gap-4 p-4 mt-5'>
                        {collections.length === 0 ? (
                            <div className='col-span-4 text-center text-gray-400 py-10'>
                                No collections yet. Create your first one!
                            </div>
                        ) : (
                            collections.map((collection) => (
                                <CollectionCard
                                    key={collection.id}
                                    collection={collection}
                                    username={user!.username || user!.id}
                                    isOwner={true}
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}