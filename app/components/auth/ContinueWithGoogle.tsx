'use client';

import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

const ContinueWithGoogle = () => {
    const router = useRouter()

    return (
        <button onClick={async () => {
            const data = await authClient.signIn.social({
                provider: "google",
                callbackURL: "/home",
            });
        }} className="w-full bg-red-700 text-white py-2 rounded-md mt-4">
            Continue with google
        </button>)
}

export default ContinueWithGoogle