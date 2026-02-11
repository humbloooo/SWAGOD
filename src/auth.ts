import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
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
        jwt({ token, user }) {
            if (user) {
                // @ts-ignore
                token.role = user.role;
            }
            return token;
        },
        session({ session, token }) {
            // @ts-ignore
            session.user.role = token.role;
            return session;
        },
    },
    pages: {
        signIn: '/login',
    }
};
