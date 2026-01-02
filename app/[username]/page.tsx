import { getUserByUsername } from '@/lib/getUserByUsername'
import AppLayout from '@/components/AppLayout'
import CreateCollectionModal from '@/components/CreateCollectionModal'
import CollectionCard from '@/components/CollectionCard'
import { getUser } from '@/lib/getUser'
import { getUserCollections } from '@/lib/getUserCollections'
import Image from 'next/image'
import avatarImage from '../assets/images/avatar.png'

export default async function UserPage({ params }: { params: Promise<{ username: string }> }) {
    const { username } = await params;
    const user = await getUserByUsername(username);
    const currentUser = await getUser();

    if (!user) {
        return (
            <div className='min-h-screen flex items-center justify-center bg-gray-950 text-white'>
                <h1 className='text-2xl'>User not found</h1>
            </div>
        )
    }

    const isOwner = currentUser?.id === user.id;

    const collections = await getUserCollections(user.id);

    return (
        <AppLayout>
            <div className='py-4'>
                <Image src={avatarImage} alt='user profile picture' width={100} height={100} className='mx-auto rounded-full' />
                <p className='text-2xl text-center'>
                    {user.name}
                </p>
                <p className='text-center text-gray-400'>
                    @{user.username}
                </p>
            </div>

            <div className='flex flex-col gap-4 mt-6'>
                <div className='flex justify-between items-center'>
                    <h2 className='text-2xl'>Collections</h2>
                    {isOwner && <CreateCollectionModal />}
                </div>

                {collections.length === 0 ? (
                    <div className='text-center text-gray-400 py-8'>
                        No collections yet. {isOwner && "Create your first collection!"}
                    </div>
                ) : (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                        {collections.map((collection) => (
                            <CollectionCard
                                key={collection.id}
                                collection={collection}
                                username={username}
                                isOwner={isOwner}
                            />
                        ))}
                    </div>
                )}
            </div>

        </AppLayout>
    )
}