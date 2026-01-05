'use client';

import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { FcGoogle } from 'react-icons/fc';

const ContinueWithGoogle = () => {
    const router = useRouter()

    return (
        <button
            onClick={async () => {
                const data = await authClient.signIn.social({
                    provider: "google",
                    callbackURL: "/home",
                });
            }}
            className="w-full bg-white hover:bg-gray-50 text-gray-900 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-3 border border-gray-300"
        >
            <FcGoogle size={20} />
            Continue with Google
        </button>
    )
}

export default ContinueWithGoogle