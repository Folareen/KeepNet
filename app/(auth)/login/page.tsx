'use client';

import ContinueWithGoogle from '@/components/auth/ContinueWithGoogle';
import { authClient } from '@/lib/auth-client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { MdFolder, MdArrowBack } from 'react-icons/md';

export default function LoginPage() {
    const router = useRouter()
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const identifier = formData.get('identifier') as string;
        const password = formData.get('password') as string;

        try {
            let data;

            if (identifier.includes('@')) {
                data = await authClient.signIn.email({
                    email: identifier,
                    password: password,
                });
            } else {
                data = await authClient.signIn.username({
                    username: identifier,
                    password: password,
                });
            }

            if (data.error) {
                setError(data.error.message || 'Login failed');
                setLoading(false);
                return;
            }

            console.log('Login successful:', data);
            router.push('/home');
        } catch (error: any) {
            console.error('Login error:', error);
            setError(error?.message || 'An error occurred during login');
            setLoading(false);
        }
    };

    return (
        <div className='min-h-screen bg-linear-to-br from-gray-900 via-gray-950 to-black flex items-center justify-center p-4'>
            <div className='absolute inset-0 overflow-hidden pointer-events-none'>
                <div className='absolute -top-40 -right-40 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl'></div>
                <div className='absolute -bottom-40 -left-40 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl'></div>
            </div>

            <Link href="/" className="absolute top-6 left-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors z-10">
                <MdArrowBack size={20} />
                <span className='hidden sm:inline'>Back</span>
            </Link>

            <div className='w-full max-w-md relative z-10'>
                <div className='flex items-center justify-center gap-3 mb-8'>
                    <div className='w-14 h-14 bg-linear-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20'>
                        <MdFolder className='text-white' size={32} />
                    </div>
                    <h1 className="text-3xl font-bold bg-linear-to-r from-white to-gray-300 bg-clip-text text-transparent">KeepNet</h1>
                </div>

                <div className='bg-gray-900/60 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-8 shadow-2xl'>
                    <h2 className="text-2xl font-bold mb-2 text-center">Welcome back</h2>
                    <p className='text-sm text-gray-400 text-center mb-6'>
                        Sign in to access your collections
                    </p>

                    {error && (
                        <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-xl text-red-300 text-sm backdrop-blur-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className='space-y-4'>
                        <div>
                            <label htmlFor="identifier" className='block text-sm font-medium text-gray-300 mb-2'>
                                Email or Username
                            </label>
                            <input
                                type="text"
                                id="identifier"
                                name="identifier"
                                required
                                placeholder="Enter your email or username"
                                className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700/50 text-white placeholder:text-gray-500 focus:border-blue-500/50 focus:bg-gray-800/80 focus:outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className='block text-sm font-medium text-gray-300 mb-2'>
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                required
                                placeholder="Enter your password"
                                className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700/50 text-white placeholder:text-gray-500 focus:border-blue-500/50 focus:bg-gray-800/80 focus:outline-none transition-all"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30"
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    <div className='flex items-center gap-4 my-6'>
                        <div className='flex-1 h-px bg-gray-700/50'></div>
                        <span className='text-sm text-gray-500 font-medium'>OR</span>
                        <div className='flex-1 h-px bg-gray-700/50'></div>
                    </div>

                    <ContinueWithGoogle />

                    <div className='mt-6 text-center space-y-3'>
                        <Link href="/request-password-reset" className="block text-sm text-blue-400 hover:text-blue-300 transition-colors">
                            Forgot your password?
                        </Link>
                        <p className='text-sm text-gray-400'>
                            Don't have an account?{' '}
                            <Link href="/signup" className="text-blue-400 hover:text-blue-300 transition-colors font-medium">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
