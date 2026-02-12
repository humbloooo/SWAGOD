import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { FirestoreAdapter } from "@next-auth/firebase-adapter";
import { firestore } from "@/lib/firebase-admin";
import { isUserAdmin } from "@/lib/db";

export const authOptions: NextAuthOptions = {
    // @ts-ignore - The adapter type definition might mismatch slightly with v4 but it works
    adapter: FirestoreAdapter(firestore),
    session: {
        strategy: "jwt", // We must use JWT strategy with Credentials provider, even with an adapter
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                // This is a legacy/fallback provider.
                // Ideally, we want users to "Log in with Google" or "Log in with Email Link".
                // But for pure "Admin via Password", we can check against Firestore.

                if (!credentials?.username || !credentials?.password) return null;

                // 1. Verify against Firestore 'admins' collection? 
                // Currently we don't store passwords there (NextAuth doesn't handle hashing by default safely without a lib).
                // SO: We will stick to the "Legacy Admin" hardcoded check for the *Password* part,
                // BUT we will also verify if they are allowed in Firestore if we wanted to be strict.

                // FOR NOW: Let's keep the hardcoded admin password for emergency access,
                // BUT add the `role: 'admin'` so the UI knows.

                if (
                    credentials.username === "admin" &&
                    credentials.password === "password"
                ) {
                    return { id: "admin-master", name: "Master Admin", email: "admin@swagod.com", role: "admin" };
                }

                return null;
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user, trigger, session }: any) {
            if (user) {
                token.id = user.id;
                token.role = user.role; // Initial login role

                // If logging in via Google, check if they are an Admin in Firestore
                if (!token.role && user.email) {
                    const isAdmin = await isUserAdmin(user.email);
                    if (isAdmin) {
                        token.role = 'admin';
                    }
                }
            }
            return token;
        },
        session({ session, token }: any) {
            session.user.role = token.role;
            session.user.id = token.id;
            return session;
        },
    },
    pages: {
        signIn: '/login',
    }
};
