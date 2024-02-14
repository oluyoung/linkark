'use server';

import prismaClient from '@/app/db/prisma-client';
import { List, User } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/authOptions';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { unstable_noStore as noStore } from 'next/cache';
import { ListSchema } from './schemas';

export type ListWithUser = List & { creator: User };

interface StateErrors {
  name?: string[];
  description?: string[];
  isPublic?: string[];
  links?: string[];
  editors?: string[];
  subscribers?: string[];
  [key: number]: string[];
}

export interface Fields {
  name: string;
  description: string;
  isPublic: boolean;
  [key: string]: string | boolean | undefined;
}

export interface State {
  errors?: StateErrors;
  message?: string | null;
  success?: boolean;
}

export interface FetchListProps {
  query?: string;
  sort?: 'asc' | 'desc';
  orderBy?: 'createdAt' | 'updatedAt';
}

/**
 * Function to create a new link
 */
export async function createList(values: Fields): Promise<State> {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id)
    return redirect('/auth/signin');

  if (!values.name && values.description) {
    return {
      errors: {
        name: ['There must be a name with a description.'],
      },
    };
  }

  const validatedFields = ListSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, description, isPublic } = validatedFields.data;

  try {
    await prismaClient.list.create({
      data: {
        name,
        description,
        isPublic,
        creatorId: session.user.id,
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error('Could not create link, please try again.');
  }

  revalidatePath('/home/links');
  return {
    success: true,
  };
}

/**
 * Function to fetch links
 */
export async function fetchLists({
  sort = 'desc',
  orderBy = 'createdAt',
}: FetchListProps): Promise<ListWithUser[]> {
  noStore();

  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id)
    return redirect('/auth/signin');

  try {
    const lists = await prismaClient.list.findMany({
      where: {
        creatorId: session.user.id
      },
      include: {
        creator: true
      },
      orderBy: {
        [orderBy]: sort
      },
    });

    return lists;
  } catch (error) {
    throw error;
  }
}
