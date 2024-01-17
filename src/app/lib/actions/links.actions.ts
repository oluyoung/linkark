'use server';

import z from 'zod';
import prismaClient from '@/app/db/prisma-client';
import { Link } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/authOptions';
import ogs, { SuccessResult } from 'open-graph-scraper';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

interface StateErrors {
  url?: string[];
  title?: string[];
  description?: string[];
  tags?: string[];
  [key: number]: string[];
};

export interface Fields {
  url: string;
  title: string;
  description: string;
  tags: string[];
  [key: string]: string |string[] | undefined;
};

export interface State {
  errors?: StateErrors;
  message?: string | null;
}

const LinkSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  url: z.string().url({
    message: 'Please enter a valid url',
  }),
  tags: z.array(z.string().cuid()).optional(), // use mui/chip to add tags and pass the cuids
});

export async function createLink(values: Fields): Promise<State> {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) return redirect('/auth/signin');

  if (!values.title && values.description) {
    return {
      errors: {
        title: ['There must be a title with a description.']
      }
    };
  }

  const validatedFields =  LinkSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors
    };
  }

  const { url, title, description } = validatedFields.data;

  try {
    const meta = await getLinkMetadata(url);
    if (!meta) return {
      errors: {
        url: ['This URL does not exist.']
      }
    };

    await prismaClient.link.create({
      data: {
        ...meta,
        title,
        description,
        creatorId: session.user.id
      }
    });
  } catch (error) {
    console.error(error);
    throw new Error('Could not create link, please try again.');
  }

  revalidatePath('/home/links');
  return {
    message: 'SUCCESS'
  };
}

export async function updateLink(linkId: string, existingUrl: string, values: Fields): Promise<State> {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) return redirect('/auth/signin');

  if (!values.title && values.description) {
    return {
      errors: {
        title: ['There must be a title with a description.']
      }
    };
  }

  const validatedFields =  LinkSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors
    };
  }

  const { url, title, description } = validatedFields.data;

  try {
    const meta = await getLinkMetadata(url);
    if (!meta) return {
      errors: {
        url: ['This URL does not exist.']
      }
    };

    await prismaClient.link.update({
      data: {
        ...meta,
        title,
        description,
      },
      where: {
        id: linkId,
        creatorId: session.user.id
      }
    });
  } catch (error) {
    console.error(error);
    throw new Error('Could not create link, please try again.');
  }

  revalidatePath('/home/links');
  return {
    message: 'SUCCESS'
  };
}

export async function fetchOgMeta(url: string): Promise<State | SuccessResult> {
  const ogsResult = await ogs({ url }).catch(error => error);
  if (ogsResult.error) {
    if (ogsResult.result.error === 'Page not found') {
      return {
        errors: {
          url: ['This URL does not exist']
        }
      };
    }
  }
  return ogsResult;
}

async function getLinkMetadata(url_: string): Promise<Omit<Link, 'id' | 'createdAt' | 'updatedAt' | 'title' | 'description' | 'creatorId'> | undefined> {
  try {
    const url = new URL(url_);

    // this is written this away so errors fail silently
    const ogsResult = await ogs({ url: url_ }).then((res) => res).catch(error => error);

    let ogTitle, ogType, ogUrl, ogDescription;

    if (ogsResult) {
      if (ogsResult.error) {
        // Only care if the url does not exist
        if (ogsResult.result.error === 'Page not found') throw new Error('This URL does not exist');
     } else {
        ogTitle = ogsResult.result.ogTitle;
        ogType = ogsResult.result.ogType;
        ogUrl = ogsResult.result.ogUrl,
        ogDescription = ogsResult.result.ogDescription;
      }
    }

    return {
      origin: url.origin,
      hostname: url.hostname,
      path: url.pathname,
      query: url.search,
      rawUrl: url.href,
      ogTitle,
      ogDescription,
      ogType,
      ogUrl
    };
  } catch (error) {
    console.error(error);
  }
}
