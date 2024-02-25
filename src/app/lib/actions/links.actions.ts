'use server';

import prismaClient from '@/app/db/prisma-client';
import { Link } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/authOptions';
import ogs, { SuccessResult } from 'open-graph-scraper';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { unstable_noStore as noStore } from 'next/cache';
import { LinkSchema } from './schemas';
import { ListLinkWithLink } from './lists.actions';

export type LinkMeta = Omit<
  Link,
  | 'id'
  | 'createdAt'
  | 'updatedAt'
  | 'title'
  | 'description'
  | 'creatorId'
  | 'isDeleted'
>;

interface StateErrors {
  url?: string[];
  title?: string[];
  description?: string[];
  tags?: string[];
  [key: number]: string[];
}

export interface Fields {
  url: string;
  title: string;
  description: string;
  tags: string[];
  [key: string]: string | string[] | undefined;
}

export interface State {
  errors?: StateErrors;
  message?: string | null;
  success?: boolean;
}

export interface FetchLinkProps {
  query?: string;
  isDeleted?: boolean;
  sort?: 'asc' | 'desc';
  orderBy?: 'createdAt' | 'updatedAt';
}

export type LinkAsAutocompleteOption = Partial<
  Pick<
    Link,
    | 'id'
    | 'title'
    | 'ogTitle'
    | 'rawUrl'
    | 'rawUrlHash'
    | 'description'
    | 'ogDescription'
  > & { isOption?: boolean; inputValue?: string }
>;

export async function getIdOrRedirect(): Promise<string> {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id)
    return redirect('/auth/signin');

  return session.user.id;
}

/**
 * Function to create a new link
 */
export async function createLink(values: Fields) {
  const creatorId = await getIdOrRedirect();

  if (!values.title && values.description) {
    throw {
      errors: {
        title: ['There must be a title with a description.'],
      },
    };
  }

  const validatedFields = LinkSchema.safeParse(values);

  if (!validatedFields.success) {
    throw {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { url, title, description } = validatedFields.data;

  try {
    const meta = await getLinkMetadata(url);
    if (!meta) {
      throw {
        errors: {
          url: ['This URL does not exist.'],
        },
      };
    }

    await prismaClient.link.create({
      data: {
        ...meta,
        title,
        description,
        creatorId
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error('Could not create link, please try again.');
  }

  revalidatePath('/home/links');
}

/**
 * Function to update a link
 */
export async function updateLink(
  linkId: string,
  values: Fields
): Promise<State> {
  const creatorId = await getIdOrRedirect();

  if (!values.title && values.description) {
    return {
      errors: {
        title: ['There must be a title with a description.'],
      },
    };
  }

  const validatedFields = LinkSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { url, title, description } = validatedFields.data;

  try {
    const meta = await getLinkMetadata(url);
    if (!meta)
      return {
        errors: {
          url: ['This URL does not exist.'],
        },
      };

    await prismaClient.link.update({
      data: {
        ...meta,
        title,
        description,
      },
      where: {
        id: linkId,
        creatorId
      },
    });
  } catch (error) {
    throw error;
  }

  revalidatePath('/home/links');
  return {
    success: true,
  };
}

/**
 * Function to send a link to trash
 */
export async function trashLink(linkId: string): Promise<State> {
  const creatorId = await getIdOrRedirect();

  try {
    await prismaClient.link.update({
      data: {
        isDeleted: true,
      },
      where: {
        id: linkId,
        creatorId
      },
    });
  } catch (error) {
    throw error;
  }

  revalidatePath('/home/links');
  return {
    success: true,
  };
}

/**
 * Function to restore a link from trash
 */
export async function restoreLink(linkId: string): Promise<State> {
  const creatorId = await getIdOrRedirect();

  try {
    await prismaClient.link.update({
      data: {
        isDeleted: false,
      },
      where: {
        id: linkId,
        creatorId
      },
    });
  } catch (error) {
    throw error;
  }

  revalidatePath('/home/trash');
  return {
    success: true,
  };
}

/**
 * Function to fetch all trashed links
 */
export async function fetchTrashLinks(query?: string): Promise<Link[]> {
  return await fetchLinks({ query, isDeleted: true, orderBy: 'updatedAt' });
}

/**
 * Function to permanently delete a link
 */
export async function deleteLink(linkId: string): Promise<State> {
  const creatorId = await getIdOrRedirect();

  try {
    const link = prismaClient.link.findFirstOrThrow({
      where: {
        id: linkId,
      },
      select: {
        list: true,
      },
    });

    const listIds = (await link.list()).map((l) => l.listId);

    await prismaClient.$transaction([
      prismaClient.listLink.deleteMany({
        where: {
          linkId,
          listId: {
            in: listIds,
          },
        },
      }),
      prismaClient.link.delete({
        where: {
          id: linkId,
          creatorId
      }})
    ]);
  } catch (error) {
    console.error(error);
    throw new Error('Could not delete link, please try again.');
  }

  revalidatePath('/home/trash');
  return {
    success: true,
  };
}

/**
 * Function to fetch links
 */
export async function fetchLinks({
  query,
  isDeleted = false,
  sort = 'desc',
  orderBy = 'createdAt'
}: FetchLinkProps): Promise<Link[]> {
  noStore();

  const creatorId = await getIdOrRedirect();

  let links = [];

  try {
    if (query) {
      links = await searchLinks(query, creatorId, isDeleted);
    } else {
      links = await prismaClient.link.findMany({
        where: {
          creatorId,
          isDeleted,
        },
        orderBy: {
          [orderBy]: sort,
        },
      });
    }
  } catch (error) {
    throw error;
  }

  return links;
}

/**
 * Function to fetch links for Autocomplete options
 */
export async function fetchLinksAsAutocompleteOptions(links?: ListLinkWithLink[]): Promise<
  LinkAsAutocompleteOption[]
> {
  noStore();
  const creatorId = await getIdOrRedirect();

  const listLinksIds = (links || []).map(l => l.id);

  try {
    return await prismaClient.link.findMany({
      where: {
        creatorId,
        isDeleted: false,
        AND: {
          id: {
            notIn: listLinksIds
          }
        }
      }
    });
  } catch (error) {
    throw error;
  }
}

/**
 * Function to fetch links based on a query
 */
export async function searchLinks(
  query: string,
  creatorId: string,
  isDeleted = false
): Promise<Link[]> {
  let links = [];

  try {
    links = await prismaClient.link.findMany({
      where: {
        AND: [
          {
            creatorId,
            isDeleted,
            OR: [
              { title: { contains: query } },
              { description: { contains: query } },
              { ogDescription: { contains: query } },
              { ogTitle: { contains: query } },
              { rawUrl: { contains: query } },
            ],
          },
        ],
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error('Could not find any links with this query.');
  }

  revalidatePath('/home/links');
  return links;
}

/**
 * Function to get the metadata for a link using open-graph-scraper
 */
export async function fetchOgMeta(url: string): Promise<State | SuccessResult> {
  const ogsResult = await ogs({ url }).catch((error) => error);
  if (ogsResult.error) {
    if (ogsResult.result.error === 'Page not found') {
      return {
        errors: {
          url: ['This URL does not exist'],
        },
      };
    }
  }
  return ogsResult;
}

/**
 * Function to get the metadata for a link using open-graph-scraper
 */
async function getLinkMetadata(uri: string): Promise<LinkMeta | undefined> {
  try {
    return await fetch('http://localhost:3000/api/ogs', {
      method: 'POST',
      body: JSON.stringify({ uri }),
    }).then((res) => res.json());
  } catch (error) {
    console.error(error);
  }
}
