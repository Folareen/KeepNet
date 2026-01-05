'use client';

import ContinueWithGoogle from '@/components/auth/ContinueWithGoogle';
import { authClient } from '@/lib/auth-client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { MdFolder, MdArrowBack, MdInfoOutline } from 'react-icons/md';

export default function SignupPage() {
    const router = useRouter()
    const [error, setError] = useState<string>('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('')
        setLoading(true)
        const formData = new FormData(e.currentTarget);

        try {
            const response = await authClient.signUp.email({
                name: formData.get('fullName') as string,
                username: formData.get('username') as string,
                email: formData.get('email') as string,
                password: formData.get('password') as string,
            });

            if (response.error) {
                setError(response.error.message || 'Signup failed')
                setLoading(false)
                return
            }

            console.log('Signup successful:', response.data);
            router.push('/home')
        } catch (error: any) {
            console.error('Signup error:', error);
            setError(error?.message || 'An error occurred during signup')
            setLoading(false)
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
                    <h2 className="text-2xl font-bold mb-2 text-center">Create your account</h2>
                    <p className='text-sm text-gray-400 text-center mb-6'>
                        Join KeepNet to organize your digital life
                    </p>

                    {error && (
                        <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-xl text-red-300 text-sm backdrop-blur-sm">
                            {error}
                        </div>
                    )}

                    <ContinueWithGoogle />

                    <div className='flex items-center gap-4 my-6'>
                        <div className='flex-1 h-px bg-gray-700/50'></div>
                        <span className='text-sm text-gray-500 font-medium'>OR</span>
                        <div className='flex-1 h-px bg-gray-700/50'></div>
                    </div>

                    <form onSubmit={handleSubmit} className='space-y-4'>
                        <div>
                            <label htmlFor="fullName" className='block text-sm font-medium text-gray-300 mb-2'>
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                required
                                placeholder="Enter your full name"
                                className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700/50 text-white placeholder:text-gray-500 focus:border-blue-500/50 focus:bg-gray-800/80 focus:outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label htmlFor="username" className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                                Username
                                <span className="group relative">
                                    <MdInfoOutline className="w-4 h-4 text-gray-400 cursor-help" />
                                    <span className="invisible group-hover:visible absolute left-6 top-0 w-48 bg-gray-800 border border-gray-700 text-white text-xs rounded-lg py-2 px-3 z-10 shadow-xl">
                                        Username should not contain the '@' symbol
                                    </span>
                                </span>
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                required
                                placeholder="Choose a username"
                                className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700/50 text-white placeholder:text-gray-500 focus:border-blue-500/50 focus:bg-gray-800/80 focus:outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className='block text-sm font-medium text-gray-300 mb-2'>
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                placeholder="Enter your email"
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
                                placeholder="Create a password"
                                className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700/50 text-white placeholder:text-gray-500 focus:border-blue-500/50 focus:bg-gray-800/80 focus:outline-none transition-all"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30"
                        >
                            {loading ? 'Creating account...' : 'Sign Up'}
                        </button>
                    </form>

                    <div className='mt-6 text-center'>
                        <p className='text-sm text-gray-400'>
                            Already have an account?{' '}
                            <Link href="/login" className="text-blue-400 hover:text-blue-300 transition-colors font-medium">
                                Login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
