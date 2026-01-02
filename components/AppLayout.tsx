import { getUser } from "@/lib/getUser";
import Header from "./Header";
import { redirect } from "next/navigation";

export default async function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getUser();

    if (!user) {
        redirect('/login');
    }

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            <Header user={user} />
            <main>{children}</main>
        </div>
    );
}
