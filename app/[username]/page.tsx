import AppLayout from '@/components/AppLayout'
import Breadcrumb from '@/components/Breadcrumb'
import CollectionSearchInput from '@/components/CollectionSearchInput'
import { getUser } from '@/lib/getUser'
import { getUserByUsername } from '@/lib/getUserByUsername'
import { getUserCollections } from '@/lib/getUserCollections'
import Image from 'next/image'
import { MdHome, MdPerson } from 'react-icons/md'

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

    if (!user.visibility && !isOwner) {
        return (
            <AppLayout>
                <div className='flex items-center justify-center min-h-[60vh]'>
                    <div className='text-center'>
                        {user.image ? (
                            <Image
                                src={user.image}
                                alt={user.name}
                                width={80}
                                height={80}
                                className='w-20 h-20 rounded-full object-cover mx-auto'
                            />
                        ) : (
                            <div className='w-20 h-20 bg-linear-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto text-white text-3xl font-bold'>
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                        )}
                        <p className='text-xl font-semibold mt-4'>{user.name}</p>
                        <p className='text-gray-500 text-sm mt-1'>@{user.username}</p>
                        <p className='text-gray-500 text-sm mt-4'>This account is private</p>
                    </div>
                </div>
            </AppLayout>
        )
    }

    const collections = await getUserCollections(user.id);

    return (
        <AppLayout>
            <Breadcrumb
                items={[
                    { label: 'Home', href: '/home', icon: <MdHome size={18} /> },
                    { label: user.name, href: `/${username}`, icon: <MdPerson size={18} /> }
                ]}
            />
            <div className='space-y-6'>
                <div className='max-w-md mx-auto px-4 sm:px-0'>
                    <div className='flex flex-col items-center text-center py-6 sm:py-8'>
                        {user.image ? (
                            <Image
                                src={user.image}
                                alt={user.name}
                                width={120}
                                height={120}
                                className='w-24 h-24 sm:w-30 sm:h-30 rounded-full object-cover'
                            />
                        ) : (
                            <div className='w-24 h-24 sm:w-30 sm:h-30 bg-linear-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl sm:text-5xl font-bold'>
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                        )}
                        <h1 className='text-2xl sm:text-3xl font-bold text-gray-100 mt-4 sm:mt-6'>{user.name}</h1>
                        <p className='text-gray-400 mt-1 sm:mt-2 text-base sm:text-lg'>@{user.username}</p>
                        <div className='flex items-center gap-4 sm:gap-6 mt-4 sm:mt-6 text-sm text-gray-500'>
                            <div className='text-center'>
                                <p className='text-xl sm:text-2xl font-bold text-gray-300'>{collections.length}</p>
                                <p className='text-xs sm:text-sm'>Collections</p>
                            </div>
                            <div className='h-6 sm:h-8 w-px bg-gray-700'></div>
                            <div className='text-center'>
                                <p className='text-xl sm:text-2xl font-bold text-gray-300'>{collections.reduce((sum, c) => sum + (c._count?.keeps || 0), 0)}</p>
                                <p className='text-xs sm:text-sm'>Keeps</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='bg-gray-900/40 border border-gray-800 rounded-xl p-4 sm:p-6'>
                    <h2 className='text-base sm:text-lg font-semibold text-gray-300 mb-4 sm:mb-6'>Collections</h2>

                    <CollectionSearchInput
                        collections={collections}
                        username={username}
                        isOwner={isOwner}
                    />
                </div>
            </div>
        </AppLayout>
    )
}