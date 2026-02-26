import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import AdminBackButton from "@/components/admin/AdminBackButton";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect("/api/auth/signin?callbackUrl=/admin");
    }

    // @ts-ignore
    if (session.user.role !== "admin") {
        return (
            <main className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
                <Header />
                <h1 className="text-4xl font-black text-red-600 uppercase mb-4">Access Denied</h1>
                <p className="font-mono text-gray-600 mb-8 max-w-md">
                    You are currently logged in as <strong>{session.user.email}</strong>.<br />
                    This account does not have admin permissions.
                </p>
                <div className="flex flex-col gap-4 w-full max-w-sm">
                    <a
                        href="/api/auth/signout?callbackUrl=/login"
                        className="px-6 py-4 bg-black text-white uppercase font-bold hover:bg-primary transition-colors w-full"
                    >
                        Switch Account / Sign Out
                    </a>
                    <a href="/" className="px-6 py-4 border border-black uppercase font-bold hover:bg-gray-100 transition-colors w-full">
                        Return to Store
                    </a>
                </div>
            </main>
        );
    }

    return (
        <div className="min-h-screen bg-black">
            <Header />
            <AdminBackButton />
            {children}
            <Navigation />
        </div>
    );
}
