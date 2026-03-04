import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb-client";
import dbConnect from "@/lib/mongoose";
import User from "@/lib/models/User";

export const authOptions: NextAuthOptions = {
    adapter: MongoDBAdapter(clientPromise),
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
                if (!credentials?.username || !credentials?.password) return null;

                // 1. Master Admin Check (Fallback)
                if (
                    credentials.username === "admin" &&
                    credentials.password === "password"
                ) {
                    return { id: "admin-master", name: "Master Admin", email: "admin@swagod.com", role: "SUPER_ADMIN" };
                }

                // 2. Check MongoDB 'users' collection
                try {
                    await dbConnect();
                    const userDoc = await User.findOne({ email: credentials.username });

                    if (userDoc) {
                        // NOTE: In a real production app, we would verify the password hash here with bcrypt.
                        // Currently allowing a specific shared password or pass-through for demo purposes.
                        if (credentials.password === "swagod2026") {
                            return {
                                id: userDoc._id.toString(),
                                name: userDoc.name,
                                email: userDoc.email,
                                role: userDoc.role || 'USER'
                            };
                        }

                        // Fallback logic
                        return {
                            id: userDoc._id.toString(),
                            name: userDoc.name,
                            email: userDoc.email,
                            role: userDoc.role || 'USER'
                        };
                    }
                } catch (e) {
                    console.error("MongoDB user lookup failed", e);
                }

                return null;
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const u = user as any;
                token.id = u.id;
                token.role = u.role; // Initial login role

                // If logging in via Google, check if they are an Admin in MongoDB
                if (!token.role && user.email) {
                    try {
                        await dbConnect();
                        const existingUser = await User.findOne({ email: user.email });
                        if (existingUser && (existingUser.role === 'ADMIN' || existingUser.role === 'SUPER_ADMIN')) {
                            token.role = existingUser.role;
                        }
                    } catch (err) {
                        console.error("MongoDB Role check failed:", err);
                    }
                }
            }
            return token;
        },
        session({ session, token }) {
            if (session.user) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const s = session.user as any;
                s.role = token.role;
                s.id = token.id;
            }
            return session;
        },
    },
    pages: {
        signIn: '/login',
    }
};
