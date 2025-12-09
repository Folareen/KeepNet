"use client"

import { authClient } from '@/lib/auth-client';
import axios from 'axios'
import { useRouter } from 'next/navigation';
import React from 'react'

const page = () => {
    const { push } = useRouter();
    return (
        <div className='min-h-scree'>
            <div className='flex items-center justify-between bg-gray-900 p-4 shadow-md'>
                <h1 className='text-3xl '>
                    Home
                </h1>

                <button onClick={async () => {
                    await authClient.signOut()
                    push('/login');
                }} className='bg-red-600 text-white px-4 py-2 rounded-md'>
                    Logout
                </button>
            </div>
        </div>
    )
}

export default page