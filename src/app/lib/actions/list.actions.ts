'use server';

import prismaClient from '@/app/db/prisma-client';
import { List, User, ListLink, Link } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/authOptions';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { unstable_noStore as noStore } from 'next/cache';
import { ListSchema } from './schemas';

export type ListWithUser = List & { creator: User };
export type ListLinkWithLink = ListLink & { link: Link };
export type ListWithLinks = List & { links: ListLinkWithLink[] };

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

async function getSessionIdOrRedirect(): Promise<string> {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id)
    return redirect('/auth/signin');

  return session.user.id;
}

function validatedFields(values: Fields) {
  if (!values.name && values.description) {
    throw {
      errors: {
        name: ['There must be a name with a description.'],
      },
    };
  }

  const validatedFields = ListSchema.safeParse(values);

  if (!validatedFields.success) {
    throw {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  return validatedFields.data;
}

/**
 * Function to create a new list
 */
export async function createList(values: Fields): Promise<State> {
  const creatorId = await getSessionIdOrRedirect();

  const { name, description, isPublic } = validatedFields(values);

  try {
    await prismaClient.list.create({
      data: {
        name,
        description,
        isPublic,
        creatorId
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error('Could not create list, please try again.');
  }

  revalidatePath('/home/lists');
  return {
    success: true,
  };
}

/**
 * Function to update a new list
 */
export async function updateList(values: Fields, listId: string): Promise<State> {
  const creatorId = await getSessionIdOrRedirect();

  const { name, description, isPublic } = validatedFields(values);

  try {
    await prismaClient.list.update({
      data: {
        name,
        description,
        isPublic,
      },
      where: {
        id: listId,
        creatorId
      }
    });
  } catch (error) {
    console.error(error);
    // if ('errors' in error) return error;
    throw new Error('Could not update list, please try again.');
  }

  revalidatePath('/home/lists');
  return {
    success: true,
  };
}

/**
 * Function to fetch lists
 */
export async function fetchLists({
  sort = 'desc',
  orderBy = 'createdAt',
}: FetchListProps): Promise<ListWithUser[]> {
  noStore();

  const creatorId = await getSessionIdOrRedirect();

  try {
    const lists = await prismaClient.list.findMany({
      where: {
        creatorId
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

export async function fetchList({ id }: { id: string }) {
  const creatorId = await getSessionIdOrRedirect();

  try {
    const list = await prismaClient.list.findFirstOrThrow({
      where: {
        id,
        creatorId
      },
      include: {
        links: {
          include: {
            link: true
          }
        }
      }
    });
    return { list, listLinks: list.links };
  } catch (error) {
    throw error;
  }
}

/**
 * Function to permanently delete a list
 */
export async function deleteList(listId: string): Promise<State> {
  const creatorId = await getSessionIdOrRedirect();

  try {
    await prismaClient.list.delete({
      where: {
        id: listId,
        creatorId
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error('Could not delete list, please try again.');
  }

  revalidatePath('/home/lists');
  return {
    success: true,
  };
}
