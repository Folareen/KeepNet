import AppLayout from '@/components/AppLayout';
import Breadcrumb from '@/components/Breadcrumb';
import CollectionSearchInput from '@/components/CollectionSearchInput';
import CreateCollectionModal from '@/components/CreateCollectionModal';
import EditAccountModal from '@/components/EditAccountModal';
import { getUser } from '@/lib/getUser';
import { getUserCollections } from '@/lib/getUserCollections';
import Image from 'next/image';
import { MdHome } from 'react-icons/md';

export default async function HomePage() {
    const user = await getUser();
    const collections = await getUserCollections(user!.id);

    return (
        <AppLayout>
            <Breadcrumb
                items={[
                    { label: 'Home', href: '/home', icon: <MdHome size={18} /> }
                ]}
            />
            <div className='space-y-6'>
                <div className='bg-gray-900/40 border border-gray-800 rounded-xl p-4 sm:p-6'>
                    <div className='flex flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-4'>
                        <h2 className='text-base sm:text-lg font-semibold text-gray-300'>Account</h2>
                        <EditAccountModal user={user!} />
                    </div>
                    <div className='flex items-center gap-3 sm:gap-4'>
                        {user!.image ? (
                            <Image
                                src={user!.image}
                                alt={user!.name}
                                width={64}
                                height={64}
                                className='w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover shrink-0'
                            />
                        ) : (
                            <div className='w-12 h-12 sm:w-16 sm:h-16 bg-linear-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shrink-0 text-white text-lg sm:text-2xl font-bold'>
                                {user!.name.charAt(0).toUpperCase()}
                            </div>
                        )}
                        <div className='min-w-0 flex-1'>
                            <h3 className='text-lg sm:text-xl font-bold text-gray-100 truncate'>{user!.name}</h3>
                            <p className='text-xs sm:text-sm text-gray-500'>@{user!.username}</p>
                        </div>
                    </div>
                </div>

                <div className='bg-gray-900/40 border border-gray-800 rounded-xl p-4 sm:p-6'>
                    <div className='flex sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6'>
                        <h2 className='text-base sm:text-lg font-semibold text-gray-300'>Collections</h2>
                        <CreateCollectionModal />
                    </div>

                    <CollectionSearchInput
                        collections={collections}
                        username={user!.username || user!.id}
                        isOwner={true}
                    />
                </div>
            </div>
        </AppLayout>
    )
}