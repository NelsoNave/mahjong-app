import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    // Google OAuth 2.0 provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          // Todo: Check if it's necessary to always display the consent screen
          prompt: "consent",
        },
      },
    }),
  ],

  session: {
    strategy: "jwt", // Using JWT for session handling
  },

  callbacks: {
    // JWT callback to add user details into the token when the user logs in
    async jwt({ token, account, user }) {
      if (account && user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
      }
      return token;
    },

    // Session callback to enrich the session object with token data
    async session({ session, token }) {
      // Add the token properties into the session object
      session.user.id = token.id as string;
      session.user.email = token.email || "";
      session.user.name = token.name || "";
      session.user.image = token.image as string;

      return session;
    },

    async signIn({ user }) {
      if (!user.email) {
        return false;
      }
      // save user in database
      await prisma.user.upsert({
        where: { email: user.email },
        create: {
          email: user.email,
          user_name: user.name || "",
          image: user.image || "",
          language: "ja",
        },
        update: {
          user_name: user.name || "",
          image: user.image || "",
        },
      });
      return true;
    },
  },
});

export const { GET, POST } = handlers;
