import { getUser } from "@/lib/getUser";
import Header from "./Header";

export default async function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getUser();

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-950 to-black text-white">
            <Header user={user} />
            <main className="container mx-auto px-6 py-8">
                {children}
            </main>
        </div>
    );
}
