import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Link from "next/link";

export default async function AdminPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect("/api/auth/signin?callbackUrl=/admin");
    }

    // Basic role check (if we had roles working perfectly, for now just existence)
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
                    <button
                        onClick={() => {
                            // Force signout then redirect to login
                            window.location.href = "/api/auth/signout?callbackUrl=/login";
                        }}
                        className="px-6 py-4 bg-black text-white uppercase font-bold hover:bg-primary transition-colors w-full"
                    >
                        Switch Account / Sign Out
                    </button>
                    <Link href="/" className="px-6 py-4 border border-black uppercase font-bold hover:bg-gray-100 transition-colors w-full">
                        Return to Store
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-background pb-[60px] pt-24">
            <Header />
            <div className="container mx-auto px-6">
                <h1 className="text-6xl font-black uppercase tracking-tighter mb-12">
                    Admin // <span className="text-primary">Dashboard</span>
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    <Link href="/admin/products" className="p-8 border border-black bg-surface hover:bg-black hover:text-white transition-colors group">
                        <h3 className="font-mono text-gray-500 group-hover:text-gray-400 mb-2">MANAGEMENT</h3>
                        <p className="text-2xl font-bold uppercase">Products</p>
                        <div className="mt-4 text-xs font-mono">ADD / EDIT / DELETE</div>
                    </Link>

                    <Link href="/admin/tour" className="p-8 border border-black bg-surface hover:bg-black hover:text-white transition-colors group">
                        <h3 className="font-mono text-gray-500 group-hover:text-gray-400 mb-2">EVENTS</h3>
                        <p className="text-2xl font-bold uppercase">Tours</p>
                        <div className="mt-4 text-xs font-mono">DATES / VENUES</div>
                    </Link>

                    <Link href="/admin/archives" className="p-8 border border-black bg-surface hover:bg-black hover:text-white transition-colors group">
                        <h3 className="font-mono text-gray-500 group-hover:text-gray-400 mb-2">CONTENT</h3>
                        <p className="text-2xl font-bold uppercase">Archives</p>
                        <div className="mt-4 text-xs font-mono">UPLOAD / CAPTION</div>
                    </Link>

                    <Link href="/admin/about" className="p-8 border border-black bg-surface hover:bg-black hover:text-white transition-colors group">
                        <h3 className="font-mono text-gray-500 group-hover:text-gray-400 mb-2">PAGE</h3>
                        <p className="text-2xl font-bold uppercase">About Us</p>
                        <div className="mt-4 text-xs font-mono">TEXT EDITING</div>
                    </Link>

                    <Link href="/admin/promos" className="p-8 border border-black bg-surface hover:bg-black hover:text-white transition-colors group">
                        <h3 className="font-mono text-gray-500 group-hover:text-gray-400 mb-2">SALES</h3>
                        <p className="text-2xl font-bold uppercase">Promos</p>
                        <div className="mt-4 text-xs font-mono">DISCOUNT CODES</div>
                    </Link>

                    <Link href="/admin/settings" className="p-8 border border-black bg-surface hover:bg-black hover:text-white transition-colors group">
                        <h3 className="font-mono text-gray-500 group-hover:text-gray-400 mb-2">GLOBAL</h3>
                        <p className="text-2xl font-bold uppercase">Settings</p>
                        <div className="mt-4 text-xs font-mono">FOOTER / SOCIALS</div>
                    </Link>

                    <Link href="/admin/feedback" className="p-8 border border-black bg-surface hover:bg-black hover:text-white transition-colors group">
                        <h3 className="font-mono text-gray-500 group-hover:text-gray-400 mb-2">CLIENTS</h3>
                        <p className="text-2xl font-bold uppercase">Feedback</p>
                        <div className="mt-4 text-xs font-mono">MESSAGES / REQUESTS</div>
                    </Link>
                </div>

                <div className="mt-12">
                    <h2 className="text-2xl font-bold uppercase mb-6">Recent Orders</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left font-mono text-sm">
                            <thead>
                                <tr className="border-b-2 border-black">
                                    <th className="py-4">ORDER ID</th>
                                    <th className="py-4">CUSTOMER</th>
                                    <th className="py-4">TOTAL</th>
                                    <th className="py-4">STATUS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <tr key={i} className="border-b border-gray-200">
                                        <td className="py-4">#SWG-{1000 + i}</td>
                                        <td className="py-4">user_{i}@example.com</td>
                                        <td className="py-4">R {(Math.random() * 100 + 20).toFixed(2)}</td>
                                        <td className="py-4">
                                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold">
                                                PAID
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <Navigation />
        </main>
    );
}
