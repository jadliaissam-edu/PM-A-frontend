import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";

const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Replace the URL below with your backend auth endpoint.
        // The backend should return a user object and (optionally) a token.
        try {
          const res = await fetch(process.env.BACKEND_AUTH_URL || "http://localhost:8000/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: credentials?.username, password: credentials?.password }),
          });
          if (!res.ok) return null;
          const data = await res.json();
          // Expect `data.user` or similar. Adjust to your backend response shape.
          if (data && (data.user || data.username)) {
            return { id: data.user?.id || data.id || data.username, name: data.user?.name || data.username, email: data.user?.email };
          }
        } catch (e) {
          return null;
        }
        return null;
      },
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: "/login" },
};

const handler = NextAuth(options);

export { handler as GET, handler as POST };
