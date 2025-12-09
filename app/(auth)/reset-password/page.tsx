'use client';

import { authClient } from '@/lib/auth-client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect } from 'react';

export default function ResetPassword() {

    const router = useRouter()

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        try {
            const { data, error } = await authClient.resetPassword({
                newPassword: formData.get('password') as string, // required
                token: formData.get('token') as string, // required
            });
            if (error) {
                throw error
            }
            console.log('Password has been reset:', data, error);
            router.push('/login')
        } catch (error) {
            console.error('Reset password error:', error);
        }
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        if (token) {
            const tokenInput = document.getElementById('token') as HTMLInputElement;
            if (tokenInput) {
                tokenInput.value = token;
            }
        }
    }, []);

    return (
        <div className='h-screen flex items-center justify-center '>
            <Link href="/" className="absolute top-4 left-4 text-blue-500">
                Home
            </Link>
            <div className='p-3 bg-gray-900 rounded-md shadow-md w-full max-w-md'>
                <h1 className="text-4xl font-bold mb-4 text-center">Reset Password</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="password">Password:</label>
                        <input type="password" id="password" name="password" required className="w-full px-3 py-2 rounded-md bg-gray-800 text-white" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="token">Token:</label>
                        <input type="text" id="token" name="token" required className="w-full px-3 py-2 rounded-md bg-gray-800 text-white" />
                    </div>
                    <button type="submit" className="w-full bg-blue-700 text-white py-2 rounded-md">Reset Password</button>
                </form>
            </div>
        </div>
    );
}
