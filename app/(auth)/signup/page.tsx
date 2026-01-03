'use client';

import { authClient } from '@/lib/auth-client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { AiOutlineInfoCircle } from 'react-icons/ai';

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
        <div className='h-screen flex items-center justify-center '>
            <Link href="/" className="absolute top-4 left-4 text-blue-500">
                Home
            </Link>
            <div className='p-3 bg-gray-900 rounded-md shadow-md w-full max-w-md'>
                <h1 className="text-4xl font-bold mb-4 text-center">Sign Up</h1>

                {error && (
                    <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded-md text-red-200">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="fullName">Full Name:</label>
                        <input type="text" id="fullName" name="fullName" required className="w-full px-3 py-2 rounded-md bg-gray-800 text-white" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="username" className="flex items-center gap-2">
                            Username:
                            <span className="group relative">
                                <AiOutlineInfoCircle className="w-4 h-4 text-gray-400 cursor-help" />
                                <span className="invisible group-hover:visible absolute left-6 top-0 w-48 bg-gray-700 text-white text-xs rounded py-1 px-2 z-10">
                                    Username should not contain the '@' symbol
                                </span>
                            </span>
                        </label>
                        <input type="text" id="username" name="username" required className="w-full px-3 py-2 rounded-md bg-gray-800 text-white" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email">Email:</label>
                        <input type="email" id="email" name="email" required className="w-full px-3 py-2 rounded-md bg-gray-800 text-white" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password">Password:</label>
                        <input type="password" id="password" name="password" required className="w-full px-3 py-2 rounded-md bg-gray-800 text-white" />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-700 text-white py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Signing up...' : 'Sign Up'}
                    </button>
                </form>
                <p className='text-center mt-2'>
                    Already have an account? <a href="/login" className="text-blue-500">Login</a>
                </p>
            </div>

        </div>
    );
}
