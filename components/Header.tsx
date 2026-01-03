"use client"
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
    user: UserData;
};

const Header = ({ user }: HeaderProps) => {
    const { push } = useRouter();

    return (
        <header className='flex items-center justify-between bg-gray-900 p-4 shadow-md'>
            <h1 className='text-3xl '>
                <Link href="/home">
                    Home
                </Link>
            </h1>
            <div>
                <input
                    type="text"
                    placeholder='Search keeps and collections...'
                    className='px-3 py-2 rounded-md bg-gray-800 text-white min-w-[400px]'
                />
            </div>

            <div className='flex items-center gap-4'>
                <span className='text-sm text-gray-300'>
                    {user.name || user.email}
                </span>
                <button
                    onClick={async () => {
                        await authClient.signOut();
                        push('/login');
                    }}
                    className='bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700'
                >
                    Logout
                </button>
            </div>
        </header>
    )
}

export default Header