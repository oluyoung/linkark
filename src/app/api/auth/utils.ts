import type { User, Account } from 'next-auth';
import prismaClient from '@/app/db/prisma-client';

export async function findOrCreateSocialUser(user: User, account?: Account): Promise<User | null> {
  try {
    const existingUser = await prismaClient.user.findFirst({
      where: {
        email: user.email as string,
        profileId: user.id as string,
        provider: account?.provider
      }
    });

    if (!existingUser) {
      return await prismaClient.user.create({
        data: {
          name: user.name as string,
          email: user.email as string,
          profileId: user.id,
          provider: account?.provider
        }
      });
    }
    return null;
  } catch(error) {
    throw new Error('Could not create user');
  }
};
