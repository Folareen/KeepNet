import AppLayout from '@/components/AppLayout';
import Breadcrumb from '@/components/Breadcrumb';
import CollectionContentWrapper from '@/components/CollectionContentWrapper';
import { getUser } from '@/lib/getUser';
import { getCollectionById } from '@/lib/getCollectionById';
import { getUserByUsername } from '@/lib/getUserByUsername';
import { MdHome, MdPerson, MdFolder } from 'react-icons/md';

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

    const user = await getUserByUsername(username);
    const isOwner = currentUser?.id === collection.userId;

    return (
        <AppLayout>
            <Breadcrumb
                items={[
                    { label: 'Home', href: '/home', icon: <MdHome size={18} /> },
                    { label: user?.name || username, href: `/${username}`, icon: <MdPerson size={18} /> },
                    { label: collection.title, href: `/${username}/${collectionId}`, icon: <MdFolder size={18} /> }
                ]}
            />
            <div className='space-y-6'>
                <div className='bg-gray-900/40 border border-gray-800 rounded-xl p-4 sm:p-6'>
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
                                type: keep.type,
                                updatedAt: keep.updatedAt,
                            }))
                        }}
                        username={username}
                        isOwner={isOwner}
                    />
                </div>
            </div>
        </AppLayout>
    )
}