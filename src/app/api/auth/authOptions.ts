import type { NextAuthOptions } from 'next-auth';
import { Adapter } from 'next-auth/adapters';
import GithubProvider, { GithubProfile } from 'next-auth/providers/github';
import { PrismaAdapter } from '@auth/prisma-adapter';
import prismaClient from '@/app/db/prisma-client';

export const authOptions = {
  adapter: PrismaAdapter(prismaClient) as Adapter,
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      profile(profile: GithubProfile) {
        return {
          id: profile.id.toString(),
          email: profile.email,
          name: profile.name ?? profile.login,
        };
      },
    }),
  ],
  debug: process.env.NODE_ENV === 'development',
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) session.user.id = token.sub;
      return session;
    },
  },
} satisfies NextAuthOptions;
