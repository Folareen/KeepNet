'use client';

import { authClient } from '@/lib/auth-client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

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
                name: formData.get('name') as string,
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
                        <label htmlFor="name">Name:</label>
                        <input type="text" id="name" name="name" required className="w-full px-3 py-2 rounded-md bg-gray-800 text-white" />
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
