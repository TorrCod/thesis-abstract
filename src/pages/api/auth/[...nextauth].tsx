import { UserDetails } from "@/context/types.d";
import { verifyIdToken } from "@/lib/firebase-admin";
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
    signIn: "/?signin",
    signOut: "/",
    error: "/?signin", // Error code passed in query string as ?error=
  },
  debug: true,
};

export default NextAuth(authOptions);
