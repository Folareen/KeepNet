'use client';

import ContinueWithGoogle from '@/components/auth/ContinueWithGoogle';
import { auth } from '@/lib/auth';
import { authClient } from '@/lib/auth-client';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent } from 'react';

export default function LoginPage() {

    const router = useRouter()

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        try {
            // const response = await axios.post('/api/auth/login', {
            //     email: formData.get('email'),
            //     password: formData.get('password'),
            // });
            // console.log('Login successful:', response.data);
            console.log('log in now')
            const data = await authClient.signIn.email({
                email: formData.get('email') as string,
                password: formData.get('password') as string,
            });
            console.log(data, 'see this data')
            console.log('login ')
            router.push('/home')
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
                <h1 className="text-4xl font-bold mb-4 text-center">Login</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email">Email:</label>
                        <input type="email" id="email" name="email" required className="w-full px-3 py-2 rounded-md bg-gray-800 text-white" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password">Password:</label>
                        <input type="password" id="password" name="password" required className="w-full px-3 py-2 rounded-md bg-gray-800 text-white" />
                    </div>
                    <button type="submit" className="w-full bg-blue-700 text-white py-2 rounded-md">Login</button>
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
