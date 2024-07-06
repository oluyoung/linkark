'use server';

import { revalidatePath } from 'next/cache';
import { unstable_noStore as noStore } from 'next/cache';
import { ListSchema, MultiLinkSchema } from './schemas';

import { List, IList } from '../../../db/models/list';
import { IUser, User } from '../../../db/models/user';
import { ListLink, IListLink } from '../../../db/models/listLink';
import { ILink } from '../../../db/models/link';
import { IListSubscriber } from '../../../db/models/listSubscriber';
import { isAfter, isBefore } from 'date-fns';
import { LinkAsAutocompleteOption } from './links.actions';

import { getIdOrRedirect } from './utils';
import connect from '../../../db/connect';
import { FilterQuery } from 'mongoose';

export type ListWithUser = IList & { creator: IUser };
export type ListLinkWithLink = IListLink & { link: ILink };
export type ListWithLinks = ListWithUser & { links: ListLinkWithLink[] };
export type ListWithSubscribers = ListWithUser & { subscribers: IListSubscriber[] };

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

// Function to create a new list
export async function createList(values: Fields) {
  await connect();

  const creator = await getIdOrRedirect();

  const { name, description, isPublic } = validatedFields(values);

  try {
    await List.create({
      name,
      description,
      isPublic,
      creator,
    });
  } catch (error) {
    console.error(error);
    throw new Error('Could not create list, please try again.');
  }

  revalidatePath('/home/lists');
}

// Function to update a list
export async function updateList(values: Fields, listId: string) {
  await connect();

  if (!listId) return;

  const creator = await getIdOrRedirect();

  const { name, description, isPublic } = validatedFields(values);

  try {
    await List.findOneAndUpdate(
      { _id: listId, creator },
      { name, description, isPublic },
      { new: true }
    );
  } catch (error) {
    console.error(error);
    throw new Error('Could not update list, please try again.');
  }

  revalidatePath('/home/lists');
}

// Function to fetch users' lists
export async function fetchLists({
  orderBy = 'createdAt',
}: FetchListProps): Promise<ListWithUser[]> {
  noStore();

  await connect();

  const creator = await getIdOrRedirect();

  try {
    const lists = await List.find({ creator: creator }).exec();
    
    const subd: ListWithUser[] = await List.find({ subscribers: creator })
      .populate({
        path: 'list',
        populate: {
          path: 'creator',
        },
      })
      .exec();

    return [...lists, ...subd]
      .sort((a, b) => {
        if (isBefore(b[orderBy], a[orderBy])) return -1;
        if (isAfter(b[orderBy], a[orderBy])) return 1;
        return 0;
      });
    // return lists as ListWithUser[];
  } catch (error) {
    throw error;
  }
}

// Function to fetch a single list with its child links
export async function fetchList({ id }: { id: string }): Promise<ListWithLinks> {
  await connect();

  const creatorId = await getIdOrRedirect();

  try {
    const list = await List.findOne({ _id: id, creator: creatorId })
      .populate({
        path: 'links',
        populate: {
          path: 'link',
          match: { isDeleted: false },
        },
      })
      // .populate({ path: 'creator', })
      .exec();
      const creator = await User.findById(list.creator).lean().exec();

    if (!list || !creator) throw new Error('List not found');

    return { ...(list.toJSON()), creator } as ListWithLinks;
  } catch (error) {
    throw error;
  }
}

// Function to permanently delete a list
export async function deleteList(listId: string) {
  await connect();

  const creatorId = await getIdOrRedirect();

  try {
    await List.findOneAndDelete({ _id: listId, creatorId }).exec();
  } catch (error) {
    console.error(error);
    throw new Error('Could not delete list, please try again.');
  }

  revalidatePath('/home/lists');
}

// Function to add multiple links to a list
export async function addListLinks(
  listId: string,
  links: Partial<LinkAsAutocompleteOption>[]
) {
  await connect();

  const creatorId = await getIdOrRedirect();

  const validatedFields = MultiLinkSchema.safeParse(links);

  if (!validatedFields.success) {
    throw {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const links_ = validatedFields.data;

  // const connectedOrCreatedLinks = links_.map((l) => {
  //   return {
  //     link: {
  //       connectOrCreate: {
  //         where: { _id: l.id || '' },
  //         create: {
  //           ...l,
  //           creatorId,
  //         },
  //       },
  //     },
  //   };
  // });

  try {
    const list = await List.findOne({ _id: listId, creatorId }).exec();
    // TODO create new links if they don't exist
    if (!list) throw new Error('List not found');

    list.links.push(links_);

    await list.save();
  } catch (error) {
    console.error(error);
    throw error;
  }

  revalidatePath(`/home/list/${listId}`);
}

// Function to remove multiple links from a list
export async function removeListLinks(listId: string, linkIds: string[]) {
  await connect();

  try {
    await ListLink.deleteMany({ linkId: { $in: linkIds }, listId }).exec();
  } catch (error) {
    console.error(error);
    throw error;
  }

  revalidatePath(`/home/list/${listId}`);
}

// Function to fetch all public lists
export async function fetchPublicLists({
  query,
  sort = 'desc',
  orderBy = 'createdAt',
}: FetchListProps): Promise<ListWithSubscribers[]> {
  noStore();

  await connect();

  try {
    const filter: FilterQuery<IList> = { isPublic: true };

    if (query) {
      filter.$or = [{ name: { $regex: query, $options: 'i' } }, { description: { $regex: query, $options: 'i' } }];
    }

    const lists = await List.find(filter)
      .populate('creator')
      .populate('subscribers')
      .sort({ [orderBy]: sort })
      .exec();

    return lists as ListWithSubscribers[];
  } catch (error) {
    throw error;
  }
}
