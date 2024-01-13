'use server';

import z from 'zod';
import prismaClient from '@/app/db/prisma-client';
import { Link } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/authOptions';
import ogs from 'open-graph-scraper';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

interface StateErrors {
  url?: string[];
  title?: string[];
  description?: string[];
  tags?: string[];
  [key: number]: string[];
};

export interface State {
  errors?: StateErrors;
  message?: string | null;
}

const LinkSchema = z.object({
  url: z.string().url({
    message: 'Please enter a valid url',
  }),
  title: z.string(),
  description: z.string(),
  tags: z.array(z.string().cuid()), // use mui/chip to add tags and pass the cuids
});

async function getLinkMetadata(url_: string): Promise<Omit<Link, 'id' | 'createdAt' | 'updatedAt' | 'title' | 'description' | 'creatorId'> | undefined> {
  try {
    const url = new URL(url_);

    // this is written this away so errors fail silently
    const ogsResult = await ogs({ url: url_ }).then((res) => res).catch(error => error);

    let ogTitle, ogType, ogUrl, ogDescription;

    if (ogsResult) {
      if (ogsResult.error) {
        // Only care if the url does not exist
        if (ogsResult.result.error === 'Page not found') throw new Error('Invalid URL: This URL does not exist');
        // Log error if needed
        // else console.error(ogsResult.result)
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

export async function createLink(prevState: State, formData: FormData): Promise<State> {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) return redirect('/auth/signin');

  const validatedFields =  LinkSchema.safeParse({
    url: formData.get('url'),
    title: formData.get('title'),
    description: formData.get('description')
  })

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    console.log(validatedFields.error);
    return {
      errors: validatedFields.error.flatten().fieldErrors
    };
  }

  // Prepare data for insertion into the database
  const { url, title, description } = validatedFields.data;

  
  try {
    const meta = await getLinkMetadata(url);
    if (!meta) throw new Error('Database Error: Failed to Create Link');

    await prismaClient.link.create({
      data: {
        ...meta,
        title,
        description,
        creatorId: session.user.id
      }
    });
  } catch (error) {
    throw new Error('Database Error: Failed to Create Link');
  }

  revalidatePath('/home/links');
  redirect('/home/links');
}
