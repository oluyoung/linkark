import NextAuth from 'next-auth';
import type { NextAuthOptions } from 'next-auth';
import GithubProvider, { GithubProfile } from 'next-auth/providers/github';
import { findOrCreateSocialUser } from '../utils';

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      profile(profile: GithubProfile) {
        return {
          id: profile.id.toString(),
          email: profile.email,
          name: profile.name ?? profile.login
        };
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, email, credentials }) {
      if (account?.provider) await findOrCreateSocialUser(user, account);
      return true;
    }
  }
} satisfies NextAuthOptions;

export const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
