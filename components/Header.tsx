"use client"
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MdFolder, MdPerson, MdLogout } from 'react-icons/md';

type UserData = {
    id: string;
    email: string;
    name: string | null;
    username?: string | null;
    image?: string | null;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
};

type HeaderProps = {
    user: UserData | null;
};

const Header = ({ user }: HeaderProps) => {
    const { push } = useRouter();

    return (
        <header className='sticky top-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-gray-800'>
            <div className='container mx-auto px-4 sm:px-6 py-3 sm:py-4'>
                <div className='flex items-center justify-between gap-2'>
                    <Link href="/home" className='flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity'>
                        <div className='w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-lg flex items-center justify-center shrink-0'>
                            <MdFolder className='text-white' size={20} />
                        </div>
                        <span className='text-xl sm:text-2xl font-bold'>KeepNet</span>
                    </Link>

                    <div className='flex items-center gap-2 sm:gap-4'>
                        {user && (
                            <>
                                <Link
                                    href={`/${user.username || user.id}`}
                                    className='flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors'
                                >
                                    <MdPerson size={20} className='text-gray-400' />
                                    <span className='text-xs sm:text-sm font-medium hidden xs:inline truncate max-w-[100px] sm:max-w-none'>{user.name || user.username}</span>
                                </Link>
                                <button
                                    onClick={async () => {
                                        await authClient.signOut();
                                        push('/login');
                                    }}
                                    className='flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-lg hover:bg-red-600/10 text-red-400 hover:text-red-300 transition-colors'
                                >
                                    <MdLogout size={20} />
                                    <span className='text-xs sm:text-sm font-medium hidden sm:inline'>Logout</span>
                                </button>
                            </>
                        )}
                        {!user && (
                            <button
                                onClick={() => push('/login')}
                                className='px-4 sm:px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors text-sm'
                            >
                                Login
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header