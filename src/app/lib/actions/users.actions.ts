'use server';

import { User, IUser } from '@/db/models/user';
import { getIdOrRedirect } from './utils';

/**
 * Function to fetch current user
 */
export async function fetchUser(): Promise<Pick<IUser, 'name' | 'email'>> {
  const creatorId = await getIdOrRedirect();

  try {
    const user = await User.findById(creatorId).select('name email').lean();

    if (!user) {
      throw new Error('User not found');
    }

    return user as IUser;
  } catch (error) {
    throw error;
  }
}

/**
 * Function to delete a user
 */
export async function deleteAccount(): Promise<IUser> {
  const creatorId = await getIdOrRedirect();

  try {
    const user = await User.findByIdAndDelete(creatorId).lean();

    if (!user) {
      throw new Error('User not found');
    }

    return user as IUser;
  } catch (error) {
    throw error;
  }
}