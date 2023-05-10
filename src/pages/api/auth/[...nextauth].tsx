import { UserDetails } from "@/context/types.d";
import { getCustomClaims, verifyIdToken } from "@/lib/firebase-admin";
import { getData } from "@/lib/mongo";
import NextAuth, { AuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(_, req) {
        const tokenId = req.query?.tokenId as string;
        const decodedToken = await verifyIdToken(tokenId);
        if (!decodedToken) return null;
        return {
          id: decodedToken.uid,
          email: decodedToken.email,
          image: decodedToken.picture,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
    signOut: "/login",
    error: "/login", // Error code passed in query string as ?error=
  },
  debug: process.env.NODE_ENV === "development",
  callbacks: {
    async session({ session, token }) {
      // Return a cookie value as part of the session
      // This is read when `req.query.nextauth.includes("session") && req.method === "GET"`
      if (token.sub) {
        const customClaims = await getCustomClaims(token.sub);
        (session as unknown as any).customClaims = customClaims;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
