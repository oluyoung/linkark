'use server';

import prismaClient from '@/app/db/prisma-client';
import { User } from '@prisma/client';
import { getIdOrRedirect } from './utils';

/**
 * Function to fetch current user
 */
export async function fetchUser(): Promise<Pick<User, 'name' | 'email'>> {
  const creatorId = await getIdOrRedirect();

  try {
    return await prismaClient.user.findFirstOrThrow({
      where: {
        id: creatorId,
      },
      select: {
        name: true,
        email: true
      }
    });
  } catch (error) {
    throw error;
  }
}

/**
 * Function to delete a user
 */
export async function deleteAccount(): Promise<User> {
  const creatorId = await getIdOrRedirect();

  try {
    return await prismaClient.user.delete({
      where: {
        id: creatorId,
      },
    });
  } catch (error) {
    throw error;
  }
}