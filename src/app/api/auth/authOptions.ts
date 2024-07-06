import type { NextAuthOptions } from 'next-auth';
import { Adapter } from 'next-auth/adapters';
import GithubProvider, { GithubProfile } from 'next-auth/providers/github';
import GoogleProvider, { GoogleProfile } from 'next-auth/providers/google';
import TwitterProvider, { TwitterProfile } from 'next-auth/providers/twitter';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
// import FacebookProvider from 'next-auth/providers/facebook';
import MongoClient from '../../../db/mongoClient';

export const authOptions = {
  adapter: MongoDBAdapter(MongoClient) as Adapter,
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
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      profile(profile: GoogleProfile) {
        return {
          id: profile.sub.toString(),
          email: profile.email,
          name: profile.name ?? profile.given_name,
        };
      },
    }),
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID as string,
      clientSecret: process.env.TWITTER_CLIENT_SECRET as string,
      version: '2.0',
      profile(profile: TwitterProfile) {
        return {
          id: profile.data.id,
          email: profile.data.username,
          name: profile.data.name ?? profile.data.username,
        };
      },
    }),
    // FacebookProvider({
    //   clientId: process.env.FB_ID as string,
    //   clientSecret: process.env.FB_SECRET as string,
    // })
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
