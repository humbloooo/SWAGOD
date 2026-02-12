import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "missing-client-id",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "missing-client-secret",
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
                    return { id: "1", name: "Admin", email: "admin@swagod.com", role: "admin" };
                }
                return null;
            },
        }),
    ],
    callbacks: {
        jwt({ token, user }: any) {
            if (user) {
                token.role = user.role;
            }
            return token;
        },
        session({ session, token }: any) {
            session.user.role = token.role;
            return session;
        },
    },
    pages: {
        signIn: '/login',
    }
};
