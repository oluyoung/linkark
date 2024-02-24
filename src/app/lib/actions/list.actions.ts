'use server';

import prismaClient from '@/app/db/prisma-client';
import { List, User, ListLink, Link } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { unstable_noStore as noStore } from 'next/cache';
import { ListSchema, MultiLinkSchema } from './schemas';
import { LinkAsAutocompleteOption, getIdOrRedirect } from './links.actions';

export type ListWithUser = List & { creator: User };
export type ListLinkWithLink = ListLink & { link: Link };
export type ListWithLinks = ListWithUser & { links: ListLinkWithLink[] };

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
export async function createList(values: Fields) {
  const creatorId = await getIdOrRedirect();

  const { name, description, isPublic } = validatedFields(values);

  try {
    await prismaClient.list.create({
      data: {
        name,
        description,
        isPublic,
        creatorId,
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error('Could not create list, please try again.');
  }

  revalidatePath('/home/lists');
}

/**
 * Function to update a new list
 */
export async function updateList(
  values: Fields,
  listId: string
) {
  if (!listId) return;

  const creatorId = await getIdOrRedirect();

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
        creatorId,
      },
    });
  } catch (error) {
    console.error(error);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ('errors' in (error as any)) throw error;
    throw new Error('Could not update list, please try again.');
  }

  revalidatePath('/home/lists');
}

/**
 * Function to fetch lists
 */
export async function fetchLists({
  sort = 'desc',
  orderBy = 'createdAt',
}: FetchListProps): Promise<ListWithUser[]> {
  noStore();

  const creatorId = await getIdOrRedirect();

  try {
    const lists = await prismaClient.list.findMany({
      where: {
        creatorId,
      },
      include: {
        creator: true,
      },
      orderBy: {
        [orderBy]: sort,
      },
    });

    return lists;
  } catch (error) {
    throw error;
  }
}

/**
 * Function to fetch a single list with its child links
 */
export async function fetchList({
  id,
}: {
  id: string;
}): Promise<ListWithLinks> {
  const creatorId = await getIdOrRedirect();

  try {
    return await prismaClient.list.findFirstOrThrow({
      where: {
        id,
        creatorId,
      },
      include: {
        links: {
          where: {
            link: {
              isDeleted: false,
            },
          },
          include: {
            link: true,
          },
        },
        creator: true
      },
    });
  } catch (error) {
    throw error;
  }
}

/**
 * Function to permanently delete a list
 */
export async function deleteList(listId: string) {
  const creatorId = await getIdOrRedirect();

  try {
    await prismaClient.list.delete({
      where: {
        id: listId,
        creatorId,
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error('Could not delete list, please try again.');
  }

  revalidatePath('/home/lists');
}

/**
 * Function to add multiple links to a list
 */
export async function addListLinks(
  listId: string,
  links: Partial<LinkAsAutocompleteOption>[]
) {
  const creatorId = await getIdOrRedirect();

  const validatedFields = MultiLinkSchema.safeParse(links);

  if (!validatedFields.success) {
    throw {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const links_ = validatedFields.data;

  const connectedOrCreatedLinks = links_.map((l) => {
    return {
      link: {
        connectOrCreate: {
          where: { id: l.id || '' },
          create: {
            ...l,
            creatorId,
          },
        },
      },
    };
  });

  try {
    await prismaClient.list.update({
      data: {
        links: {
          create: connectedOrCreatedLinks,
        },
      },
      where: {
        id: listId,
        creatorId,
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }

  revalidatePath(`/home/list/${listId}`);
}

export async function removeListLinks(listId: string, linkIds: string[]) {
  try {
    await prismaClient.$transaction([
      prismaClient.listLink.deleteMany({
        where: {
          linkId: {
            in: linkIds,
          },
          listId,
        },
      }),
    ]);
  } catch (error) {
    console.error(error);
    throw error;
  }

  revalidatePath(`/home/list/${listId}`);
}
