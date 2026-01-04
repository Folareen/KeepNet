import AppLayout from '@/components/AppLayout';
import CollectionSearchInput from '@/components/CollectionSearchInput';
import CreateCollectionModal from '@/components/CreateCollectionModal';
import EditAccountModal from '@/components/EditAccountModal';
import { getUser } from '@/lib/getUser';
import { getUserCollections } from '@/lib/getUserCollections';

export default async function HomePage() {
    const user = await getUser();
    const collections = await getUserCollections(user!.id);

    return (
        <AppLayout>
            <div className='p-5 flex-1'>
                <div className='flex items-center justify-between mb-6'>
                    <div>
                        <h2 className='text-3xl'>Welcome, {user!.name}</h2>
                        <p className='text-gray-400 mt-1'>@{user!.username}</p>
                    </div>
                    <EditAccountModal user={user!} />
                </div>

                <div className='flex items-center justify-between mt-8'>
                    <h2 className='text-3xl '>
                        Collections
                    </h2>
                    <CreateCollectionModal />
                </div>

                <CollectionSearchInput
                    collections={collections}
                    username={user!.username || user!.id}
                    isOwner={true}
                />
            </div>
        </AppLayout>
    )
}