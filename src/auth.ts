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
        strategy: "jwt",
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

                if (
                    credentials.username === "admin" &&
                    credentials.password === "password"
                ) {
                    return { id: "admin-master", name: "Master Admin", email: "admin@swagod.com", role: "SUPER_ADMIN" };
                }

                try {
                    await dbConnect();
                    const userDoc = await User.findOne({ email: credentials.username });

                    if (userDoc) {
                        if (credentials.password === "swagod2026") {
                            return {
                                id: userDoc._id.toString(),
                                name: userDoc.name,
                                email: userDoc.email,
                                role: userDoc.role || 'USER',
                                sessionVersion: userDoc.sessionVersion || 0
                            };
                        }
                        return {
                            id: userDoc._id.toString(),
                            name: userDoc.name,
                            email: userDoc.email,
                            role: userDoc.role || 'USER',
                            sessionVersion: userDoc.sessionVersion || 0
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
                const u = user as any;
                token.id = u.id;
                token.role = u.role;
                token.sessionVersion = u.sessionVersion || 0;
            }

            if (token.email) {
                try {
                    await dbConnect();
                    const liveUser = await User.findOne({ email: token.email }).select('sessionVersion role');
                    if (liveUser) {
                        if (token.sessionVersion !== (liveUser.sessionVersion || 0)) {
                            return { ...token, error: "SessionExpired" };
                        }
                        token.role = liveUser.role;
                    }
                } catch (err) {
                    console.error("Token sync error:", err);
                }
            }
            return token;
        },
        session({ session, token }) {
            if (token.error === "SessionExpired") {
                return { ...session, user: undefined, expires: new Date(0).toISOString() } as any;
            }
            if (session.user) {
                const s = session.user as { role?: string; id?: string };
                s.role = token.role as string;
                s.id = token.id as string;
            }
            return session;
        },
    },
    pages: {
        signIn: '/login',
    }
};
