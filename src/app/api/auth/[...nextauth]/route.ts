import NextAuth, { SessionStrategy, Session } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prismaClient } from "@/lib/prisma"; // your Prisma client

export const authOptions = {
  adapter: PrismaAdapter(prismaClient),
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Replace with your own user lookup + password check
        const user = await prismaClient.user.findUnique({
          where: { email: credentials?.email },
        });
        if (user) return user;
        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, user }: { session: Session; user: any }) {
      // Attach user id to session
      if (user && session.user) {
        // @ts-ignore
        session.user.id = user.id;
        console.log(session)
      }
      return session;
    },
  },
  session: {
    strategy: "database" as SessionStrategy,
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
