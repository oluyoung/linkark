'use server';

import axios from 'axios';
import ogs, { SuccessResult } from 'open-graph-scraper';
import { revalidatePath } from 'next/cache';
import { unstable_noStore as noStore } from 'next/cache';
import { Link, ILink } from '../../..//db/models/link'; // Assuming you have the Link model setup here
import { ListLink } from '../../..//db/models/listLink'; // Assuming you have the ListLink model setup here
import { getIdOrRedirect } from './utils';
import { LinkSchema } from './schemas';
import { ListLinkWithLink } from './lists.actions';
import connect from '../../../db/connect';

export type LinkMeta = Omit<ILink, 'id' | 'createdAt' | 'updatedAt' | 'title' | 'description' | 'creatorId'>;

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
  Pick<ILink, '_id' | 'title' | 'ogTitle' | 'rawUrl' | 'rawUrlHash' | 'description' | 'ogDescription'>
> & { isOption?: boolean; inputValue?: string };

/**
 * Function to create a new link
 */
export async function createLink(values: Fields) {
  await connect();

  const creator = await getIdOrRedirect();

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

    await Link.create({
      ...meta,
      title,
      description,
      creator,
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
export async function updateLink(linkId: string, values: Fields): Promise<State> {
  await connect();

  const creator = await getIdOrRedirect();

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
    if (!meta) {
      return {
        errors: {
          url: ['This URL does not exist.'],
        },
      };
    }

    await Link.findOneAndUpdate({ _id: linkId, creator }, {
      ...meta,
      title,
      description,
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
  await connect();

  const creator = await getIdOrRedirect();

  try {
    await Link.findOneAndUpdate({ _id: linkId, creator }, {
      isDeleted: true,
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
  await connect();
  const creator = await getIdOrRedirect();

  try {
    await Link.findOneAndUpdate({ _id: linkId, creator }, {
      isDeleted: false,
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
export async function fetchTrashLinks(query?: string): Promise<ILink[]> {
  return await fetchLinks({ query, isDeleted: true, orderBy: 'updatedAt' });
}

/**
 * Function to permanently delete a link
 */
export async function deleteLink(linkId: string): Promise<State> {
  await connect();
  const creator = await getIdOrRedirect();

  try {
    await Promise.all([
      Link.deleteMany({
        _id: linkId,
        creator,
      }),
      ListLink.deleteMany({
        linkId,
      }),
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
  orderBy = 'createdAt',
}: FetchLinkProps): Promise<ILink[]> {
  noStore();

  await connect();

  const creator = await getIdOrRedirect();

  try {
    let links: ILink[] = [];
    if (query) {
      links = await searchLinks(query, creator, isDeleted);
    } else {
      links = await Link.find({
        creator,
        isDeleted,
      }).sort({ [orderBy]: sort }).exec();
    }

    return links;
  } catch (error) {
    throw error;
  }
}

/**
 * Function to fetch links for Autocomplete options
 */
export async function fetchLinksAsAutocompleteOptions(links?: ListLinkWithLink[]): Promise<LinkAsAutocompleteOption[]> {
  noStore();
  
  await connect();

  const creator = await getIdOrRedirect();

  const listLinksIds = (links || []).map(l => l._id);

  try {
    return await Link.find({
      creator,
      isDeleted: false,
      id: {
        $nin: listLinksIds,
      },
    });

  } catch (error) {
    throw error;
  }
}

/**
 * Function to fetch links based on a query
 */
export async function searchLinks(query: string, creatorId: string, isDeleted = false): Promise<ILink[]> {
  await connect();

  try {
    return await Link.find({
      creator: creatorId,
      isDeleted,
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { ogDescription: { $regex: query, $options: 'i' } },
        { ogTitle: { $regex: query, $options: 'i' } },
        { rawUrl: { $regex: query, $options: 'i' } },
      ],
    }).sort({ updatedAt: 'desc' });

  } catch (error) {
    console.error(error);
    throw new Error('Could not find any links with this query.');
  }
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
    const response = await axios.post(`${process.env.API_URL}/ogs`, { uri }).catch((error) => {
      console.error(error);
      throw new Error('Failed to fetch metadata');
    });

    return response.data;
  } catch (error) {
    console.error(error);
  }
}
