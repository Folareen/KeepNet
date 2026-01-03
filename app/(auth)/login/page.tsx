'use client';

import ContinueWithGoogle from '@/components/auth/ContinueWithGoogle';
import { authClient } from '@/lib/auth-client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

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
        <div className='h-screen flex items-center justify-center '>
            <Link href="/" className="absolute top-4 left-4 text-blue-500">
                Home
            </Link>
            <div className='p-3 bg-gray-900 rounded-md shadow-md w-full max-w-md'>
                <h1 className="text-4xl font-bold mb-4 text-center">Login</h1>

                {error && (
                    <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded-md text-red-200">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="identifier">Email or Username:</label>
                        <input
                            type="text"
                            id="identifier"
                            name="identifier"
                            required
                            placeholder="Enter your email or username"
                            className="w-full px-3 py-2 rounded-md bg-gray-800 text-white"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            required
                            className="w-full px-3 py-2 rounded-md bg-gray-800 text-white"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-700 text-white py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <p className='text-center mt-2'>
                    Don't have an account? <a href="/signup" className="text-blue-500">Sign Up</a>
                </p>
                <p className='text-center mt-2'>
                    Forgot your password? <a href="/request-password-reset" className="text-blue-500">Reset Password</a>
                </p>

                <p className="text-center my-4">
                    Or
                </p>

                <ContinueWithGoogle />

            </div>
        </div>
    );
}
