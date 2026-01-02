"use client"

import { useState } from "react";

type PasswordModalProps = {
    onSubmit: (password: string) => void;
    error?: string;
    title: string;
    description?: string;
}

export default function PasswordModal({ onSubmit, error, title, description }: PasswordModalProps) {
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(password);
    };

    return (
        <div className='fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50'>
            <div className='bg-gray-900 rounded-lg p-8 max-w-md w-full mx-4'>
                <div className='mb-6'>
                    <div className='w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mb-4'>
                        <svg className='w-6 h-6 text-yellow-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' />
                        </svg>
                    </div>
                    <h2 className='text-2xl font-bold text-white mb-2'>{title}</h2>
                    {description && (
                        <p className='text-gray-400 text-sm'>{description}</p>
                    )}
                </div>

                <form onSubmit={handleSubmit}>
                    <div className='mb-4'>
                        <label htmlFor='password' className='block text-sm font-medium text-gray-300 mb-2'>
                            Password
                        </label>
                        <input
                            type='password'
                            id='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className='w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
                            placeholder='Enter password'
                            autoFocus
                            required
                        />
                        {error && (
                            <p className='text-red-500 text-sm mt-2'>{error}</p>
                        )}
                    </div>

                    <button
                        type='submit'
                        className='w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors'
                    >
                        Unlock
                    </button>
                </form>
            </div>
        </div>
    );
}
