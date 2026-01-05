'use client';

import { authClient } from '@/lib/auth-client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { MdFolder, MdArrowBack } from 'react-icons/md';
import toast from 'react-hot-toast';

export default function ResetPassword() {

    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true)
        const formData = new FormData(e.currentTarget);

        try {
            const { data, error } = await authClient.requestPasswordReset({
                email: formData.get('email') as string,
                redirectTo: `${process.env.NEXT_PUBLIC_BETTER_AUTH_URL}/reset-password`,
            });
            if (error) {
                toast.error(error.message || 'Failed to send reset email')
                setLoading(false)
                return
            }
            console.log('Password reset email sent:', data);
            toast.success('Password reset email sent! Check your inbox.')
            setLoading(false)
        } catch (error: any) {
            console.error('Login error:', error);
            toast.error(error?.message || 'An error occurred')
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
                    <h2 className="text-2xl font-bold mb-2 text-center">Forgot Password?</h2>
                    <p className='text-sm text-gray-400 text-center mb-6'>
                        No worries! Enter your email and we'll send you a reset link
                    </p>

                    <form onSubmit={handleSubmit} className='space-y-4'>
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
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30"
                        >
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </button>
                    </form>

                    <div className='mt-6 text-center'>
                        <p className='text-sm text-gray-400'>
                            Remember your password?{' '}
                            <Link href="/login" className="text-blue-400 hover:text-blue-300 transition-colors font-medium">
                                Back to Login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
