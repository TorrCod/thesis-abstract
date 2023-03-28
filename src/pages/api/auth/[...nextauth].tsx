import { signIn } from "@/lib/firebase";
import { verifyIdToken } from "@/lib/firebase-admin";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import NextAuth, { User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(_, req) {
        const tokenId = req.query?.tokenId;
        const decodedToken = await verifyIdToken(tokenId);
        if (!decodedToken) return null;
        return {
          id: decodedToken.aud,
          email: decodedToken.email,
          image: decodedToken.picture,
        };
      },
    }),
  ],

  jwt: { secret: process.env.NEXTAUTH_SECRET },

  pages: {
    signIn: "/",
    signOut: "/",
    error: "/page-not-found", // Error code passed in query string as ?error=
  },

  callbacks: {
    async session({ session, token, user }: any) {
      console.log(token);
      console.log(user);
      return session;
    },
  },
};

export default NextAuth(authOptions);
