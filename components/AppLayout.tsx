import { getUser } from "@/lib/getUser";
import Header from "./Header";

export default async function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getUser();

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            <Header user={user} />
            <main>{children}</main>
        </div>
    );
}
