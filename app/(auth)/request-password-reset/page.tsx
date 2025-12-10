'use client';

import { authClient } from '@/lib/auth-client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent } from 'react';

export default function ResetPassword() {

    const router = useRouter()

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        try {
            const { data, error } = await authClient.requestPasswordReset({
                email: formData.get('email') as string,
                redirectTo: `${process.env.NEXT_PUBLIC_BETTER_AUTH_URL}/reset-password`,
            });
            if (error) {
                throw error
            }
            console.log('Password reset email sent:', data);
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    return (
        <div className='h-screen flex items-center justify-center '>
            <Link href="/" className="absolute top-4 left-4 text-blue-500">
                Home
            </Link>
            <div className='p-3 bg-gray-900 rounded-md shadow-md w-full max-w-md'>
                <h1 className="text-4xl font-bold mb-4 text-center">Forgot Password</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email">Email:</label>
                        <input type="email" id="email" name="email" required className="w-full px-3 py-2 rounded-md bg-gray-800 text-white" />
                    </div>
                    <button type="submit" className="w-full bg-blue-700 text-white py-2 rounded-md">Submit</button>
                </form>

                <p className='text-center mt-2'>
                    Back to login? <a href="/login" className="text-blue-500">Login</a>
                </p>
            </div>
        </div>
    );
}
